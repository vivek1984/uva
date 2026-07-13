<?php

namespace App\Jobs;

use App\Mail\NewRequirementNotification;
use App\Models\Requirement;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class NotifyAdminsOfNewRequirement implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 300;

    public function __construct(public Requirement $requirement)
    {
    }

    /**
     * Email every admin with the full requirement details, one at a time,
     * paced to stay under Resend's 2 requests/second API limit.
     */
    public function handle(): void
    {
        User::where('role', 'admin')
            ->whereNotNull('email')
            ->pluck('email')
            ->each(function (string $email, int $i) {
                if ($i > 0) {
                    usleep(600_000);
                }

                Mail::to($email)->sendNow(new NewRequirementNotification($this->requirement));
            });
    }
}
