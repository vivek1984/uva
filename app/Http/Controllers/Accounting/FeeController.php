<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use App\Models\FeeStructure;
use App\Models\MemberFee;
use App\Models\User;
use App\Support\FinancialYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeeController extends Controller
{
    public function index(Request $request)
    {
        $user      = auth()->user();
        $currentFy = FinancialYear::current();
        $fy        = $request->get('fy', $currentFy);

        $structure = FeeStructure::forYear($fy);

        $members = User::where('role', '!=', 'admin')
            ->with(['profile', 'memberFees' => fn($q) => $q->where('financial_year', $fy)->with('recorder')])
            ->orderBy('name')
            ->get()
            ->map(function ($u) use ($fy) {
                $fees = $u->memberFees->groupBy('fee_type');
                return [
                    'id'               => $u->id,
                    'name'             => $u->name,
                    'phone'            => $u->phone_number,
                    'firm_name'        => $u->profile?->firm_name,
                    'status'           => $u->status,
                    'role'             => $u->role,
                    'is_new_member'    => FinancialYear::fromDate($u->created_at) === $fy,
                    'membership_fees'  => $fees->get('membership', collect())->map(fn($f) => $this->feeRow($f))->values(),
                    'joining_fees'     => $fees->get('joining', collect())->map(fn($f) => $this->feeRow($f))->values(),
                ];
            });

        $allYears = $this->allYears();

        return Inertia::render('Accounting/Fees', [
            'fy'         => $fy,
            'current_fy' => $currentFy,
            'all_years'  => $allYears,
            'can_edit'   => $user->canEditAccounting(),
            'structure'  => $structure ? [
                'membership_fee' => (float) $structure->membership_fee,
                'joining_fee'    => (float) $structure->joining_fee,
            ] : null,
            'members'    => $members,
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->canEditAccounting()) {
            abort(403);
        }

        $request->validate([
            'user_id'        => 'required|exists:users,id',
            'financial_year' => 'required|string|regex:/^\d{4}-\d{2}$/',
            'fee_type'       => 'required|in:membership,joining',
            'amount'         => 'required|numeric|min:0.01',
            'payment_date'   => 'required|date',
            'payment_mode'   => 'required|in:cash,upi,bank_transfer,cheque',
            'cheque_number'  => 'nullable|string|max:50',
            'notes'          => 'nullable|string|max:500',
        ]);

        // Joining fee only applies to members who joined in the same financial year
        if ($request->fee_type === 'joining') {
            $member = User::findOrFail($request->user_id);
            $joinedFy = FinancialYear::fromDate($member->created_at);
            if ($joinedFy !== $request->financial_year) {
                return back()->withErrors(['fee_type' => 'Joining fee only applies to new members who joined in the selected financial year.']);
            }
        }

        MemberFee::create([
            'user_id'        => $request->user_id,
            'financial_year' => $request->financial_year,
            'fee_type'       => $request->fee_type,
            'amount'         => $request->amount,
            'payment_date'   => $request->payment_date,
            'payment_mode'   => $request->payment_mode,
            'cheque_number'  => $request->cheque_number,
            'notes'          => $request->notes,
            'recorded_by'    => auth()->id(),
        ]);

        return back()->with('success', 'Fee payment recorded successfully.');
    }

    public function destroy(MemberFee $fee)
    {
        if (!auth()->user()->canEditAccounting()) {
            abort(403);
        }

        $fee->delete();

        return back()->with('success', 'Fee record deleted.');
    }

    private function feeRow(MemberFee $f): array
    {
        return [
            'id'             => $f->id,
            'amount'         => (float) $f->amount,
            'payment_date'   => $f->payment_date->format('Y-m-d'),
            'payment_mode'   => $f->payment_mode,
            'cheque_number'  => $f->cheque_number,
            'notes'          => $f->notes,
            'recorded_by'    => $f->recorder->name,
        ];
    }

    private function allYears(): array
    {
        return MemberFee::distinct()->pluck('financial_year')
            ->push(FinancialYear::current())
            ->unique()->sort()->reverse()->values()->all();
    }
}
