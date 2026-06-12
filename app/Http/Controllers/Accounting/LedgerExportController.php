<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\FeeStructure;
use App\Models\LedgerAccount;
use App\Models\MemberFee;
use App\Models\MemberOpeningBalance;
use App\Models\MemberProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use ZipArchive;

class LedgerExportController extends Controller
{
    // ── Export ────────────────────────────────────────────────────

    public function export(Request $request)
    {
        abort_unless(auth()->user()->hasAccountingAccess(), 403);

        $fy = $request->get('fy'); // null = all financial years

        $tmp = tempnam(sys_get_temp_dir(), 'ledger_export_');

        $zip = new ZipArchive();
        $zip->open($tmp, ZipArchive::CREATE | ZipArchive::OVERWRITE);
        $zip->addFromString('members.csv',                $this->membersCsv());
        $zip->addFromString('fee_structures.csv',         $this->feeStructuresCsv());
        $zip->addFromString('member_fees.csv',            $this->memberFeesCsv($fy));
        $zip->addFromString('expenses.csv',               $this->expensesCsv($fy));
        $zip->addFromString('opening_balances.csv',       $this->openingBalancesCsv($fy));
        $zip->addFromString('member_opening_balances.csv', $this->memberOpeningBalancesCsv());
        $zip->addFromString('README.txt',                 $this->readme());
        $zip->close();

        $label    = $fy ? "_$fy" : '_all';
        $filename = 'ledger' . $label . '_' . now()->format('Ymd') . '.zip';

        return response()->download($tmp, $filename, ['Content-Type' => 'application/zip'])
            ->deleteFileAfterSend();
    }

    // ── Import ────────────────────────────────────────────────────

    public function import(Request $request)
    {
        abort_unless(auth()->user()->canEditAccounting(), 403);

        $request->validate([
            'file' => 'required|file|max:20480',
        ]);

        $uploadedPath = $request->file('file')->path();

        $zip = new ZipArchive();
        if ($zip->open($uploadedPath) !== true) {
            return back()->withErrors(['import_file' => 'Could not open the ZIP file. Make sure it is a valid .zip archive.']);
        }

        $results = [];

        // Members must be imported before anything that references them
        if (($csv = $zip->getFromName('members.csv')) !== false) {
            $results['Members']                 = $this->importMembers($csv);
        }
        if (($csv = $zip->getFromName('fee_structures.csv')) !== false) {
            $results['Fee structures']          = $this->importFeeStructures($csv);
        }
        if (($csv = $zip->getFromName('member_fees.csv')) !== false) {
            $results['Member fees']             = $this->importMemberFees($csv);
        }
        if (($csv = $zip->getFromName('expenses.csv')) !== false) {
            $results['Expenses']                = $this->importExpenses($csv);
        }
        if (($csv = $zip->getFromName('opening_balances.csv')) !== false) {
            $results['Opening balances']        = $this->importOpeningBalances($csv);
        }
        if (($csv = $zip->getFromName('member_opening_balances.csv')) !== false) {
            $results['Member opening balances'] = $this->importMemberOpeningBalances($csv);
        }

        $zip->close();

        if (empty($results)) {
            return back()->withErrors(['import_file' => 'No recognised CSV files found in the ZIP. Expected: member_fees.csv, expenses.csv, opening_balances.csv, member_opening_balances.csv.']);
        }

        return back()->with('import_results', $results);
    }

    // ── CSV builders ──────────────────────────────────────────────

    private function memberFeesCsv(?string $fy): string
    {
        $query = MemberFee::with(['member.profile'])
            ->orderBy('financial_year')
            ->orderBy('payment_date');

        if ($fy) {
            $query->where('financial_year', $fy);
        }

        $out = $this->csvMemory();
        fputcsv($out, ['financial_year', 'payment_date', 'member_phone', 'member_name', 'firm_name', 'fee_type', 'amount', 'payment_mode', 'cheque_number', 'notes']);

        foreach ($query->get() as $fee) {
            fputcsv($out, [
                $fee->financial_year,
                $fee->payment_date->format('Y-m-d'),
                $fee->member->phone_number,
                $fee->member->name,
                $fee->member->profile?->firm_name ?? '',
                $fee->fee_type,
                number_format((float) $fee->amount, 2, '.', ''),
                $fee->payment_mode,
                $fee->cheque_number ?? '',
                $fee->notes ?? '',
            ]);
        }

        return $this->csvRead($out);
    }

    private function membersCsv(): string
    {
        $users = User::where('role', '!=', 'admin')
            ->with('profile')
            ->orderBy('name')
            ->get();

        $out = $this->csvMemory();
        fputcsv($out, [
            'name', 'phone_number', 'login_email', 'role', 'status',
            'firm_name', 'firm_address', 'father_husband_name',
            'profile_phone', 'whatsapp_number', 'profile_email',
            'nature_of_business', 'business_services', 'residential_address',
            'spouse_name', 'spouse_phone_number',
            'date_of_birth', 'spouse_date_of_birth', 'anniversary_date',
            'is_married', 'number_of_children',
        ]);

        foreach ($users as $u) {
            $p = $u->profile;
            fputcsv($out, [
                $u->name,
                $u->phone_number,
                $u->email,
                $u->role,
                $u->status,
                $p?->firm_name ?? '',
                $p?->firm_address ?? '',
                $p?->father_husband_name ?? '',
                $p?->phone_number ?? '',
                $p?->whatsapp_number ?? '',
                $p?->email ?? '',
                $p?->nature_of_business ?? '',
                $p?->business_services ?? '',
                $p?->residential_address ?? '',
                $p?->spouse_name ?? '',
                $p?->spouse_phone_number ?? '',
                $p?->date_of_birth?->format('Y-m-d') ?? '',
                $p?->spouse_date_of_birth?->format('Y-m-d') ?? '',
                $p?->anniversary_date?->format('Y-m-d') ?? '',
                $p?->is_married ? '1' : '0',
                $p?->number_of_children ?? '0',
            ]);
        }

        return $this->csvRead($out);
    }

    private function feeStructuresCsv(): string
    {
        $out = $this->csvMemory();
        fputcsv($out, ['financial_year', 'membership_fee', 'joining_fee']);

        foreach (FeeStructure::orderBy('financial_year')->get() as $fs) {
            fputcsv($out, [
                $fs->financial_year,
                number_format((float) $fs->membership_fee, 2, '.', ''),
                number_format((float) $fs->joining_fee, 2, '.', ''),
            ]);
        }

        return $this->csvRead($out);
    }

    private function expensesCsv(?string $fy): string
    {
        $query = Expense::orderBy('financial_year')->orderBy('expense_date');

        if ($fy) {
            $query->where('financial_year', $fy);
        }

        $out = $this->csvMemory();
        fputcsv($out, ['financial_year', 'expense_date', 'category', 'description', 'amount', 'payment_mode', 'cheque_number', 'notes']);

        foreach ($query->get() as $exp) {
            fputcsv($out, [
                $exp->financial_year,
                $exp->expense_date->format('Y-m-d'),
                $exp->category,
                $exp->description,
                number_format((float) $exp->amount, 2, '.', ''),
                $exp->payment_mode,
                $exp->cheque_number ?? '',
                $exp->notes ?? '',
            ]);
        }

        return $this->csvRead($out);
    }

    private function openingBalancesCsv(?string $fy): string
    {
        $query = LedgerAccount::orderBy('financial_year')->orderBy('type');

        if ($fy) {
            $query->where('financial_year', $fy);
        }

        $out = $this->csvMemory();
        fputcsv($out, ['type', 'financial_year', 'opening_balance']);

        foreach ($query->get() as $ob) {
            fputcsv($out, [
                $ob->type,
                $ob->financial_year,
                number_format((float) $ob->opening_balance, 2, '.', ''),
            ]);
        }

        return $this->csvRead($out);
    }

    private function memberOpeningBalancesCsv(): string
    {
        $rows = MemberOpeningBalance::with('member.profile')->get();

        $out = $this->csvMemory();
        fputcsv($out, ['member_phone', 'member_name', 'firm_name', 'opening_balance']);

        foreach ($rows as $mob) {
            fputcsv($out, [
                $mob->member->phone_number,
                $mob->member->name,
                $mob->member->profile?->firm_name ?? '',
                number_format((float) $mob->opening_balance, 2, '.', ''),
            ]);
        }

        return $this->csvRead($out);
    }

    // ── Import handlers ───────────────────────────────────────────

    private function importMemberFees(string $content): array
    {
        $rows     = $this->parseCsv($content);
        $imported = $skipped = $errors = 0;

        foreach ($rows as $i => $row) {
            $phone  = $row['member_phone'] ?? '';
            $member = User::where('phone_number', $phone)->first();

            if (! $member) {
                $errors++;
                continue;
            }

            if (empty($row['financial_year']) || empty($row['payment_date']) ||
                empty($row['fee_type'])       || ! is_numeric($row['amount'] ?? '')) {
                $errors++;
                continue;
            }

            $duplicate = MemberFee::where('user_id', $member->id)
                ->where('financial_year', $row['financial_year'])
                ->whereDate('payment_date', $row['payment_date'])
                ->where('fee_type', $row['fee_type'])
                ->where('amount', $row['amount'])
                ->where('payment_mode', $row['payment_mode'] ?? '')
                ->exists();

            if ($duplicate) {
                $skipped++;
                continue;
            }

            MemberFee::create([
                'user_id'        => $member->id,
                'financial_year' => $row['financial_year'],
                'payment_date'   => $row['payment_date'],
                'fee_type'       => $row['fee_type'],
                'amount'         => $row['amount'],
                'payment_mode'   => $row['payment_mode'] ?? 'cash',
                'cheque_number'  => $row['cheque_number'] ?: null,
                'notes'          => $row['notes'] ?: null,
                'recorded_by'    => auth()->id(),
            ]);

            $imported++;
        }

        return compact('imported', 'skipped', 'errors');
    }

    private function importExpenses(string $content): array
    {
        $rows     = $this->parseCsv($content);
        $imported = $skipped = $errors = 0;

        foreach ($rows as $row) {
            if (empty($row['financial_year']) || empty($row['expense_date']) ||
                empty($row['category'])       || ! is_numeric($row['amount'] ?? '')) {
                $errors++;
                continue;
            }

            $duplicate = Expense::where('financial_year', $row['financial_year'])
                ->whereDate('expense_date', $row['expense_date'])
                ->where('category', $row['category'])
                ->where('description', $row['description'] ?? '')
                ->where('amount', $row['amount'])
                ->where('payment_mode', $row['payment_mode'] ?? '')
                ->exists();

            if ($duplicate) {
                $skipped++;
                continue;
            }

            Expense::create([
                'financial_year' => $row['financial_year'],
                'expense_date'   => $row['expense_date'],
                'category'       => $row['category'],
                'description'    => $row['description'] ?? '',
                'amount'         => $row['amount'],
                'payment_mode'   => $row['payment_mode'] ?? 'cash',
                'cheque_number'  => $row['cheque_number'] ?: null,
                'notes'          => $row['notes'] ?: null,
                'recorded_by'    => auth()->id(),
            ]);

            $imported++;
        }

        return compact('imported', 'skipped', 'errors');
    }

    private function importMembers(string $content): array
    {
        $rows     = $this->parseCsv($content);
        $created  = $updated = $errors = 0;

        foreach ($rows as $row) {
            $phone = $row['phone_number'] ?? '';
            $name  = $row['name'] ?? '';
            $email = $row['login_email'] ?? '';

            if (empty($phone) || empty($name)) {
                $errors++;
                continue;
            }

            $user = User::where('phone_number', $phone)->first();

            if ($user) {
                $user->update([
                    'name'   => $name,
                    'email'  => $email ?: $user->email,
                    'role'   => in_array($row['role'] ?? '', ['general', 'executive']) ? $row['role'] : $user->role,
                    'status' => in_array($row['status'] ?? '', ['active', 'non-active']) ? $row['status'] : $user->status,
                ]);
                $updated++;
            } else {
                if (empty($email)) {
                    $errors++;
                    continue;
                }
                $user = User::create([
                    'name'              => $name,
                    'phone_number'      => $phone,
                    'email'             => $email,
                    'role'              => in_array($row['role'] ?? '', ['general', 'executive']) ? $row['role'] : 'general',
                    'status'            => in_array($row['status'] ?? '', ['active', 'non-active']) ? $row['status'] : 'active',
                    'password'          => Hash::make(Str::random(16)),
                    'email_verified_at' => now(),
                ]);
                $created++;
            }

            // Create or update profile
            MemberProfile::updateOrCreate(
                ['user_id' => $user->id],
                array_filter([
                    'firm_name'             => $row['firm_name'] ?: null,
                    'firm_address'          => $row['firm_address'] ?: null,
                    'father_husband_name'   => $row['father_husband_name'] ?: null,
                    'phone_number'          => $row['profile_phone'] ?: null,
                    'whatsapp_number'       => $row['whatsapp_number'] ?: null,
                    'email'                 => $row['profile_email'] ?: null,
                    'nature_of_business'    => $row['nature_of_business'] ?: null,
                    'business_services'     => $row['business_services'] ?: null,
                    'residential_address'   => $row['residential_address'] ?: null,
                    'spouse_name'           => $row['spouse_name'] ?: null,
                    'spouse_phone_number'   => $row['spouse_phone_number'] ?: null,
                    'date_of_birth'         => $row['date_of_birth'] ?: null,
                    'spouse_date_of_birth'  => $row['spouse_date_of_birth'] ?: null,
                    'anniversary_date'      => $row['anniversary_date'] ?: null,
                    'is_married'            => isset($row['is_married']) ? (bool) $row['is_married'] : null,
                    'number_of_children'    => $row['number_of_children'] !== '' ? (int) $row['number_of_children'] : null,
                ], fn($v) => $v !== null)
            );
        }

        return compact('created', 'updated', 'errors');
    }

    private function importFeeStructures(string $content): array
    {
        $rows     = $this->parseCsv($content);
        $upserted = $errors = 0;

        foreach ($rows as $row) {
            if (empty($row['financial_year']) ||
                ! is_numeric($row['membership_fee'] ?? '') ||
                ! is_numeric($row['joining_fee'] ?? '')) {
                $errors++;
                continue;
            }

            FeeStructure::updateOrCreate(
                ['financial_year' => $row['financial_year']],
                [
                    'membership_fee' => $row['membership_fee'],
                    'joining_fee'    => $row['joining_fee'],
                    'created_by'     => auth()->id(),
                ]
            );

            $upserted++;
        }

        return ['upserted' => $upserted, 'errors' => $errors];
    }

    private function importOpeningBalances(string $content): array
    {
        $rows    = $this->parseCsv($content);
        $upserted = $errors = 0;

        foreach ($rows as $row) {
            if (! in_array($row['type'] ?? '', ['cash', 'bank']) ||
                empty($row['financial_year']) ||
                ! is_numeric($row['opening_balance'] ?? '')) {
                $errors++;
                continue;
            }

            LedgerAccount::updateOrCreate(
                ['type' => $row['type'], 'financial_year' => $row['financial_year']],
                ['opening_balance' => $row['opening_balance'], 'updated_by' => auth()->id()]
            );

            $upserted++;
        }

        return ['upserted' => $upserted, 'errors' => $errors];
    }

    private function importMemberOpeningBalances(string $content): array
    {
        $rows    = $this->parseCsv($content);
        $upserted = $errors = 0;

        foreach ($rows as $row) {
            $phone  = $row['member_phone'] ?? '';
            $member = User::where('phone_number', $phone)->first();

            if (! $member || ! is_numeric($row['opening_balance'] ?? '')) {
                $errors++;
                continue;
            }

            MemberOpeningBalance::updateOrCreate(
                ['user_id' => $member->id],
                ['opening_balance' => $row['opening_balance'], 'updated_by' => auth()->id()]
            );

            $upserted++;
        }

        return ['upserted' => $upserted, 'errors' => $errors];
    }

    // ── Helpers ───────────────────────────────────────────────────

    /** @return resource */
    private function csvMemory()
    {
        return fopen('php://memory', 'w+');
    }

    /** @param resource $handle */
    private function csvRead($handle): string
    {
        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);
        return $content;
    }

    private function parseCsv(string $content): array
    {
        // Normalise line endings
        $content = str_replace(["\r\n", "\r"], "\n", $content);
        $lines   = array_filter(explode("\n", $content), fn($l) => trim($l) !== '');
        $lines   = array_values($lines);

        if (count($lines) < 2) {
            return [];
        }

        $header = str_getcsv(array_shift($lines));
        $rows   = [];

        foreach ($lines as $line) {
            $values = str_getcsv($line);
            if (count($values) === count($header)) {
                $rows[] = array_combine($header, $values);
            }
        }

        return $rows;
    }

    private function readme(): string
    {
        return <<<TEXT
LEDGER EXPORT — BACKUP & RESTORE GUIDE
========================================

This ZIP is a complete backup of all accounting and member data.
To restore, upload this ZIP using the "Import CSV" button on the Ledgers page.
Import order matters: members.csv is processed first so that fee and balance
files can reference members by mobile number.

members.csv  ← import creates/updates user accounts and profiles
  name                  full name
  phone_number          mobile number (primary key for import lookup)
  login_email           email used to log in (required for new members)
  role                  general | executive
  status                active | non-active
  firm_name, firm_address, father_husband_name
  profile_phone, whatsapp_number, profile_email
  nature_of_business, business_services, residential_address
  spouse_name, spouse_phone_number
  date_of_birth, spouse_date_of_birth, anniversary_date  (YYYY-MM-DD)
  is_married            1 | 0
  number_of_children    integer

fee_structures.csv  ← upserted by financial_year
  financial_year        e.g. 2025-26
  membership_fee        numeric
  joining_fee           numeric

member_fees.csv  ← exact duplicates skipped; members matched by phone_number
  financial_year, payment_date (YYYY-MM-DD), member_phone
  member_name, firm_name  (informational, ignored on import)
  fee_type              membership | joining
  amount, payment_mode  cash | upi | bank_transfer | cheque
  cheque_number, notes  optional

expenses.csv  ← exact duplicates skipped
  financial_year, expense_date (YYYY-MM-DD)
  category, description, amount
  payment_mode          cash | upi | bank_transfer | cheque
  cheque_number, notes  optional

opening_balances.csv  ← upserted by type + financial_year
  type                  cash | bank
  financial_year, opening_balance

member_opening_balances.csv  ← upserted by member phone
  member_phone          must match a user's mobile number
  member_name, firm_name  (informational, ignored on import)
  opening_balance       positive = dues owed, negative = credit

NOTES FOR NEW MEMBERS ON IMPORT
- If a member with the given mobile number does not exist, a new account is
  created with a random password. They must use "Forgot Password" to set their
  own password on first login.
TEXT;
    }
}
