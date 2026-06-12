<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Support\FinancialYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public const CATEGORIES = [
        'Office Expenses',
        'Event / Program',
        'Maintenance',
        'Legal & Professional',
        'Advertising & Communication',
        'Welfare / Donation',
        'Miscellaneous',
    ];

    public function index(Request $request)
    {
        $user      = auth()->user();
        $currentFy = FinancialYear::current();
        $fy        = $request->get('fy', $currentFy);
        $category  = $request->get('category');

        $query = Expense::with('recorder')
            ->where('financial_year', $fy)
            ->orderByDesc('expense_date');

        if ($category) {
            $query->where('category', $category);
        }

        $expenses = $query->get()->map(fn($e) => [
            'id'           => $e->id,
            'category'     => $e->category,
            'description'  => $e->description,
            'amount'       => (float) $e->amount,
            'expense_date' => $e->expense_date->format('Y-m-d'),
            'payment_mode' => $e->payment_mode,
            'cheque_number'=> $e->cheque_number,
            'notes'        => $e->notes,
            'recorded_by'  => $e->recorder->name,
        ]);

        $total = $expenses->sum('amount');

        $allYears = Expense::distinct()->pluck('financial_year')
            ->push($currentFy)
            ->unique()->sort()->reverse()->values()->all();

        return Inertia::render('Accounting/Expenses', [
            'fy'              => $fy,
            'current_fy'      => $currentFy,
            'all_years'       => $allYears,
            'can_edit'        => $user->canEditAccounting(),
            'categories'      => self::CATEGORIES,
            'active_category' => $category,
            'expenses'        => $expenses,
            'total'           => (float) $total,
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->canEditAccounting()) {
            abort(403);
        }

        $data = $request->validate([
            'financial_year' => 'required|string|regex:/^\d{4}-\d{2}$/',
            'category'       => 'required|string|max:100',
            'description'    => 'required|string|max:500',
            'amount'         => 'required|numeric|min:0.01',
            'expense_date'   => 'required|date',
            'payment_mode'   => 'required|in:cash,upi,bank_transfer,cheque',
            'cheque_number'  => 'nullable|string|max:50',
            'notes'          => 'nullable|string|max:500',
        ]);

        Expense::create([...$data, 'recorded_by' => auth()->id()]);

        return back()->with('success', 'Expense recorded successfully.');
    }

    public function update(Request $request, Expense $expense)
    {
        if (!auth()->user()->canEditAccounting()) {
            abort(403);
        }

        $data = $request->validate([
            'category'       => 'required|string|max:100',
            'description'    => 'required|string|max:500',
            'amount'         => 'required|numeric|min:0.01',
            'expense_date'   => 'required|date',
            'payment_mode'   => 'required|in:cash,upi,bank_transfer,cheque',
            'cheque_number'  => 'nullable|string|max:50',
            'notes'          => 'nullable|string|max:500',
        ]);

        $expense->update($data);

        return back()->with('success', 'Expense updated successfully.');
    }

    public function destroy(Expense $expense)
    {
        if (!auth()->user()->canEditAccounting()) {
            abort(403);
        }

        $expense->delete();

        return back()->with('success', 'Expense deleted.');
    }
}
