<?php

namespace App\Support;

class FinancialYear
{
    // April–March financial year, formatted as "YYYY-YY" (e.g. "2025-26")
    public static function current(): string
    {
        $now = now();
        return $now->month >= 4
            ? $now->year . '-' . substr($now->year + 1, -2)
            : ($now->year - 1) . '-' . substr($now->year, -2);
    }

    public static function fromDate(\DateTimeInterface $date): string
    {
        $month = (int) $date->format('m');
        $year  = (int) $date->format('Y');
        return $month >= 4
            ? $year . '-' . substr($year + 1, -2)
            : ($year - 1) . '-' . substr($year, -2);
    }

    // Returns list of FYs from startYear up to current FY, newest first
    public static function listFrom(int $startYear): array
    {
        $current = self::current();
        [$startY] = explode('-', $current);
        $years = [];
        for ($y = (int) $startY; $y >= $startYear; $y--) {
            $years[] = $y . '-' . substr($y + 1, -2);
        }
        return $years;
    }
}
