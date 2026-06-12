<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\FeeStructure;
use App\Models\LedgerAccount;
use App\Models\MemberFee;
use App\Models\MemberOpeningBalance;
use App\Models\User;
use App\Support\FinancialYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LedgerController extends Controller
{
    // Mode => which payment modes belong to this ledger
    private const BANK_MODES = ['upi', 'bank_transfer', 'cheque'];

    public function index(Request $request)
    {
        $user      = auth()->user();
        $currentFy = FinancialYear::current();
        $fy        = $request->get('fy', $currentFy);
        $allYears  = $this->allYears($fy);

        $cashSummary     = $this->ledgerSummary('cash', $fy);
        $bankSummary     = $this->ledgerSummary('bank', $fy);
        $expenseSummary  = $this->expenseSummary($fy);
        $members         = $this->allMemberBalances($fy);

        return Inertia::render('Accounting/Ledger/Index', [
            'fy'              => $fy,
            'current_fy'      => $currentFy,
            'all_years'       => $allYears,
            'can_edit'        => $user->canEditAccounting(),
            'cash_summary'    => $cashSummary,
            'bank_summary'    => $bankSummary,
            'expense_summary' => $expenseSummary,
            'members'         => $members,
        ]);
    }

    public function cashBook(Request $request)
    {
        return $this->buildBook($request, 'cash');
    }

    public function bankBook(Request $request)
    {
        return $this->buildBook($request, 'bank');
    }

    public function member(Request $request, User $member)
    {
        $currentFy = FinancialYear::current();
        $allYears  = $this->memberLedgerYears($member->id);

        // Year-by-year ledger with carry-forward
        $openingBalance = MemberOpeningBalance::forMember($member->id);
        $ledger         = [];

        foreach ($allYears as $fy) {
            $structure      = FeeStructure::forYear($fy);
            $membershipDue  = $structure ? (float) $structure->membership_fee : 0.0;

            $membershipPaid = (float) MemberFee::where('user_id', $member->id)
                ->where('financial_year', $fy)
                ->where('fee_type', 'membership')
                ->sum('amount');

            $joiningPaid = (float) MemberFee::where('user_id', $member->id)
                ->where('financial_year', $fy)
                ->where('fee_type', 'joining')
                ->sum('amount');

            // Payment details for this year
            $payments = MemberFee::where('user_id', $member->id)
                ->where('financial_year', $fy)
                ->orderBy('payment_date')
                ->with('recorder')
                ->get()
                ->map(fn($f) => [
                    'id'           => $f->id,
                    'fee_type'     => $f->fee_type,
                    'amount'       => (float) $f->amount,
                    'payment_date' => $f->payment_date->format('d M Y'),
                    'payment_mode' => $f->payment_mode,
                    'recorded_by'  => $f->recorder->name,
                    'notes'        => $f->notes,
                ]);

            $closingBalance = $openingBalance + $membershipDue - $membershipPaid;

            $ledger[] = [
                'financial_year'  => $fy,
                'opening_balance' => $openingBalance,
                'membership_due'  => $membershipDue,
                'membership_paid' => $membershipPaid,
                'joining_paid'    => $joiningPaid,
                'closing_balance' => $closingBalance,
                'payments'        => $payments,
            ];

            $openingBalance = $closingBalance;
        }

        // Members list for the selector
        $members = User::where('role', '!=', 'admin')
            ->orderBy('name')
            ->get()
            ->map(fn($u) => [
                'id'        => $u->id,
                'name'      => $u->name,
                'firm_name' => $u->profile?->firm_name,
                'role'      => $u->role,
            ]);

        return Inertia::render('Accounting/Ledger/Member', [
            'member'                  => [
                'id'        => $member->id,
                'name'      => $member->name,
                'phone'     => $member->phone_number,
                'role'      => $member->role,
                'firm_name' => $member->profile?->firm_name,
                'status'    => $member->status,
            ],
            'ledger'                  => $ledger,
            'members'                 => $members,
            'current_fy'              => $currentFy,
            'can_edit'                => auth()->user()->canEditAccounting(),
            'member_opening_balance'  => MemberOpeningBalance::forMember($member->id),
        ]);
    }

    public function expenseLedger(Request $request): \Inertia\Response
    {
        $user      = auth()->user();
        $currentFy = FinancialYear::current();
        $fy        = $request->get('fy', $currentFy);
        $allYears  = $this->allYears($fy);

        $entries = Expense::with('recorder')
            ->where('financial_year', $fy)
            ->orderBy('expense_date')
            ->orderBy('id')
            ->get()
            ->map(fn($e) => [
                'id'           => $e->id,
                'date'         => $e->expense_date->format('Y-m-d'),
                'category'     => $e->category,
                'description'  => $e->description,
                'amount'       => (float) $e->amount,
                'payment_mode' => $e->payment_mode,
                'cheque'       => $e->cheque_number,
                'recorded_by'  => $e->recorder->name,
                'notes'        => $e->notes,
            ]);

        // Running total
        $running = 0.0;
        $entries = $entries->map(function ($row) use (&$running) {
            $running += $row['amount'];
            return [...$row, 'running_total' => $running];
        });

        // Category breakdown
        $byCategory = $entries->groupBy('category')->map(fn($rows) => [
            'total' => $rows->sum('amount'),
            'count' => $rows->count(),
        ])->sortByDesc('total')->all();

        return Inertia::render('Accounting/Ledger/Expenses', [
            'fy'          => $fy,
            'current_fy'  => $currentFy,
            'all_years'   => $allYears,
            'can_edit'    => $user->canEditAccounting(),
            'entries'     => $entries->values(),
            'total'       => (float) $entries->sum('amount'),
            'by_category' => $byCategory,
        ]);
    }

    public function saveOpeningBalance(Request $request)
    {
        abort_unless(auth()->user()->canEditAccounting(), 403);

        $request->validate([
            'type'            => 'required|in:cash,bank',
            'financial_year'  => 'required|string|regex:/^\d{4}-\d{2}$/',
            'opening_balance' => 'required|numeric|min:0',
        ]);

        LedgerAccount::updateOrCreate(
            ['type' => $request->type, 'financial_year' => $request->financial_year],
            ['opening_balance' => $request->opening_balance, 'updated_by' => auth()->id()]
        );

        return back()->with('success', ucfirst($request->type) . ' opening balance saved for ' . $request->financial_year . '.');
    }

    public function saveMemberOpeningBalance(Request $request, User $member)
    {
        abort_unless(auth()->user()->canEditAccounting(), 403);

        $request->validate([
            'opening_balance' => 'required|numeric',
        ]);

        MemberOpeningBalance::updateOrCreate(
            ['user_id' => $member->id],
            ['opening_balance' => $request->opening_balance, 'updated_by' => auth()->id()]
        );

        return back()->with('success', 'Opening balance saved for ' . $member->name . '.');
    }

    // ── Private helpers ───────────────────────────────────────────

    private function buildBook(Request $request, string $type): \Inertia\Response
    {
        $user      = auth()->user();
        $currentFy = FinancialYear::current();
        $fy        = $request->get('fy', $currentFy);
        $allYears  = $this->allYears($fy);

        $opening = LedgerAccount::openingBalance($type, $fy);
        $modes   = $type === 'cash' ? ['cash'] : self::BANK_MODES;

        // Receipts: fee payments in this ledger's modes
        $receipts = MemberFee::with('member')
            ->where('financial_year', $fy)
            ->whereIn('payment_mode', $modes)
            ->orderBy('payment_date')
            ->get()
            ->map(fn($f) => [
                'date'        => $f->payment_date->format('Y-m-d'),
                'particulars' => $this->feeParticulars($f),
                'mode'        => $f->payment_mode,
                'cheque'      => $f->cheque_number,
                'receipt'     => (float) $f->amount,
                'payment'     => 0.0,
            ]);

        // Payments: expenses in this ledger's modes
        $payments = Expense::with('recorder')
            ->where('financial_year', $fy)
            ->whereIn('payment_mode', $modes)
            ->orderBy('expense_date')
            ->get()
            ->map(fn($e) => [
                'date'        => $e->expense_date->format('Y-m-d'),
                'particulars' => $e->description . ' [' . $e->category . ']',
                'mode'        => $e->payment_mode,
                'cheque'      => $e->cheque_number,
                'receipt'     => 0.0,
                'payment'     => (float) $e->amount,
            ]);

        // Merge and sort by date, then compute running balance
        $balance = $opening;
        $entries = $receipts->concat($payments)
            ->sortBy('date')
            ->values()
            ->map(function ($row) use (&$balance) {
                $balance += $row['receipt'] - $row['payment'];
                return [...$row, 'balance' => $balance];
            });

        $totalReceipts = $receipts->sum('receipt');
        $totalPayments = $payments->sum('payment');

        return Inertia::render('Accounting/Ledger/CashBank', [
            'type'           => $type,
            'fy'             => $fy,
            'current_fy'     => $currentFy,
            'all_years'      => $allYears,
            'can_edit'       => $user->canEditAccounting(),
            'opening'        => $opening,
            'entries'        => $entries,
            'total_receipts' => $totalReceipts,
            'total_payments' => $totalPayments,
            'closing'        => $opening + $totalReceipts - $totalPayments,
        ]);
    }

    private function feeParticulars(MemberFee $f): string
    {
        $type = $f->fee_type === 'joining' ? 'Joining fee' : 'Membership fee';
        return $type . ' — ' . $f->member->name
            . ($f->member->profile?->firm_name ? ' (' . $f->member->profile->firm_name . ')' : '');
    }

    private function expenseSummary(string $fy): array
    {
        $total      = (float) Expense::where('financial_year', $fy)->sum('amount');
        $byCategory = Expense::where('financial_year', $fy)
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->orderByDesc('total')
            ->pluck('total', 'category')
            ->map(fn($v) => (float) $v)
            ->all();

        return ['total' => $total, 'by_category' => $byCategory];
    }

    private function ledgerSummary(string $type, string $fy): array
    {
        $modes    = $type === 'cash' ? ['cash'] : self::BANK_MODES;
        $opening  = LedgerAccount::openingBalance($type, $fy);
        $receipts = (float) MemberFee::where('financial_year', $fy)->whereIn('payment_mode', $modes)->sum('amount');
        $payments = (float) Expense::where('financial_year', $fy)->whereIn('payment_mode', $modes)->sum('amount');
        return [
            'opening'  => $opening,
            'receipts' => $receipts,
            'payments' => $payments,
            'closing'  => $opening + $receipts - $payments,
        ];
    }

    private function allMemberBalances(string $upToFy): array
    {
        $allYears = $this->memberLedgerYearsAll($upToFy);

        return User::where('role', '!=', 'admin')
            ->with('profile')
            ->orderBy('name')
            ->get()
            ->map(function ($u) use ($allYears) {
                $balance = MemberOpeningBalance::forMember($u->id);
                foreach ($allYears as $fy) {
                    $structure = FeeStructure::forYear($fy);
                    $due  = $structure ? (float) $structure->membership_fee : 0.0;
                    $paid = (float) MemberFee::where('user_id', $u->id)->where('financial_year', $fy)->where('fee_type', 'membership')->sum('amount');
                    $balance = $balance + $due - $paid;
                }
                return [
                    'id'              => $u->id,
                    'name'            => $u->name,
                    'firm_name'       => $u->profile?->firm_name,
                    'role'            => $u->role,
                    'status'          => $u->status,
                    'outstanding'     => $balance,
                ];
            })
            ->sortByDesc('outstanding')
            ->values()
            ->all();
    }

    private function memberLedgerYears(int $userId): array
    {
        $fyFromStructures = FeeStructure::pluck('financial_year');
        $fyFromPayments   = MemberFee::where('user_id', $userId)->pluck('financial_year');

        $all = $fyFromStructures->merge($fyFromPayments)
            ->push(FinancialYear::current())
            ->unique()
            ->sort()
            ->values()
            ->all();

        return $all;
    }

    private function memberLedgerYearsAll(string $upToFy): array
    {
        return FeeStructure::pluck('financial_year')
            ->push($upToFy)
            ->unique()
            ->sort()
            ->filter(fn($y) => $y <= $upToFy)
            ->values()
            ->all();
    }

    private function allYears(string $currentFy): array
    {
        return MemberFee::distinct()->pluck('financial_year')
            ->merge(Expense::distinct()->pluck('financial_year'))
            ->merge(FeeStructure::distinct()->pluck('financial_year'))
            ->push($currentFy)
            ->unique()->sort()->reverse()->values()->all();
    }
}
