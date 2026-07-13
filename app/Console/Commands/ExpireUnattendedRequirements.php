<?php

namespace App\Console\Commands;

use App\Models\Requirement;
use Illuminate\Console\Command;

class ExpireUnattendedRequirements extends Command
{
    protected $signature = 'requirements:expire-unattended';

    protected $description = 'Release requirements back to the pool if not marked complete within 24 hours of being attended';

    public function handle(): void
    {
        $count = Requirement::where('status', 'attended')
            ->where('attended_at', '<', now()->subDay())
            ->update([
                'attended_by' => null,
                'attended_at' => null,
                'status'      => 'open',
            ]);

        $this->info("Released {$count} requirement(s) back to the pool.");
    }
}
