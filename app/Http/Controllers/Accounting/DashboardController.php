<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\FeeStructure;
use App\Models\MemberFee;
use App\Models\User;
use App\Support\FinancialYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user      = auth()->user();
        $currentFy = FinancialYear::current();
        $fy        = $request->get('fy', $currentFy);
        $allYears  = $this->allYears($fy);

        $membershipTotal = MemberFee::where('financial_year', $fy)
            ->where('fee_type', 'membership')
            ->sum('amount');

        $joiningTotal = MemberFee::where('financial_year', $fy)
            ->where('fee_type', 'joining')
            ->sum('amount');

        $expensesTotal = Expense::where('financial_year', $fy)->sum('amount');

        $netBalance = ($membershipTotal + $joiningTotal) - $expensesTotal;

        // Recent 15 transactions: fees + expenses combined
        $recentFees = MemberFee::with(['member', 'recorder'])
            ->where('financial_year', $fy)
            ->latest('payment_date')
            ->take(15)
            ->get()
            ->map(fn($f) => [
                'id'          => $f->id,
                'type'        => 'fee',
                'fee_type'    => $f->fee_type,
                'date'        => $f->payment_date->format('Y-m-d'),
                'label'       => $f->member->name,
                'amount'      => (float) $f->amount,
                'mode'        => $f->payment_mode,
                'recorded_by' => $f->recorder->name,
            ]);

        $recentExpenses = Expense::with('recorder')
            ->where('financial_year', $fy)
            ->latest('expense_date')
            ->take(15)
            ->get()
            ->map(fn($e) => [
                'id'          => $e->id,
                'type'        => 'expense',
                'fee_type'    => null,
                'date'        => $e->expense_date->format('Y-m-d'),
                'label'       => $e->description,
                'category'    => $e->category,
                'amount'      => (float) $e->amount,
                'mode'        => $e->payment_mode,
                'recorded_by' => $e->recorder->name,
            ]);

        $recent = $recentFees->concat($recentExpenses)
            ->sortByDesc('date')
            ->take(15)
            ->values();

        // Active members who haven't paid membership fee this year
        $paidUserIds = MemberFee::where('financial_year', $fy)
            ->where('fee_type', 'membership')
            ->pluck('user_id');

        $unpaidMembers = User::where('status', 'active')
            ->where('role', '!=', 'admin')
            ->whereNotIn('id', $paidUserIds)
            ->with('profile')
            ->orderBy('name')
            ->get()
            ->map(fn($u) => [
                'id'        => $u->id,
                'name'      => $u->name,
                'firm_name' => $u->profile?->firm_name,
                'phone'     => $u->phone_number,
            ]);

        return Inertia::render('Accounting/Dashboard', [
            'fy'               => $fy,
            'current_fy'       => $currentFy,
            'all_years'        => $allYears,
            'can_edit'         => $user->canEditAccounting(),
            'stats'            => [
                'membership_total' => (float) $membershipTotal,
                'joining_total'    => (float) $joiningTotal,
                'expenses_total'   => (float) $expensesTotal,
                'net_balance'      => (float) $netBalance,
            ],
            'recent'           => $recent,
            'unpaid_members'   => $unpaidMembers,
        ]);
    }

    public function settings()
    {
        $structures = FeeStructure::with('creator')
            ->orderByDesc('financial_year')
            ->get()
            ->map(fn($s) => [
                'id'             => $s->id,
                'financial_year' => $s->financial_year,
                'membership_fee' => (float) $s->membership_fee,
                'joining_fee'    => (float) $s->joining_fee,
                'created_by'     => $s->creator->name,
            ]);

        return Inertia::render('Accounting/Settings', [
            'structures'  => $structures,
            'current_fy'  => FinancialYear::current(),
        ]);
    }

    public function saveSettings(Request $request)
    {
        $request->validate([
            'financial_year' => 'required|string|regex:/^\d{4}-\d{2}$/',
            'membership_fee' => 'required|numeric|min:0',
            'joining_fee'    => 'required|numeric|min:0',
        ]);

        FeeStructure::updateOrCreate(
            ['financial_year' => $request->financial_year],
            [
                'membership_fee' => $request->membership_fee,
                'joining_fee'    => $request->joining_fee,
                'created_by'     => auth()->id(),
            ]
        );

        return back()->with('success', 'Fee structure saved for ' . $request->financial_year . '.');
    }

    private function allYears(string $currentFy): array
    {
        [$startY] = explode('-', $currentFy);
        $dbYears = MemberFee::distinct()->pluck('financial_year')
            ->merge(Expense::distinct()->pluck('financial_year'))
            ->merge(FeeStructure::distinct()->pluck('financial_year'))
            ->push($currentFy)
            ->unique()
            ->sort()
            ->reverse()
            ->values()
            ->all();
        return $dbYears;
    }
}
