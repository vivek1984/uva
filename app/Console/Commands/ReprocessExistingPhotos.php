<?php

namespace App\Console\Commands;

use App\Models\MemberProfile;
use App\Services\ImageService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class ReprocessExistingPhotos extends Command
{
    protected $signature = 'photos:reprocess-existing {--dry-run : Preview what would change without touching any files}';

    protected $description = 'Re-crop already-uploaded member/firm photos to the standard square/banner size, so old uploads look consistent with new ones';

    public function handle(): void
    {
        $dryRun = (bool) $this->option('dry-run');

        $profiles = MemberProfile::query()
            ->where(function ($q) {
                $q->whereNotNull('photo')->orWhereNotNull('firm_photo');
            })
            ->get();

        $this->info(($dryRun ? '[DRY RUN] ' : '') . "Found {$profiles->count()} profile(s) with a photo to check.");

        $processed = 0;
        $skipped = 0;
        $failed = 0;

        $bar = $this->output->createProgressBar($profiles->count());
        $bar->start();

        foreach ($profiles as $profile) {
            $updates = [];

            if ($profile->photo) {
                try {
                    if (!Storage::disk('public')->exists($profile->photo)) {
                        $skipped++;
                    } elseif ($dryRun) {
                        $processed++;
                    } else {
                        $newPath = ImageService::reprocessStored('public', $profile->photo, 'member-photos', 800, 800);
                        Storage::disk('public')->delete($profile->photo);
                        $updates['photo'] = $newPath;
                        $processed++;
                    }
                } catch (\Throwable $e) {
                    $failed++;
                    $this->newLine();
                    $this->error("Profile #{$profile->id} photo failed: {$e->getMessage()}");
                }
            }

            if ($profile->firm_photo) {
                try {
                    if (!Storage::disk('public')->exists($profile->firm_photo)) {
                        $skipped++;
                    } elseif ($dryRun) {
                        $processed++;
                    } else {
                        $newPath = ImageService::reprocessStored('public', $profile->firm_photo, 'firm-photos', 1200, 675);
                        Storage::disk('public')->delete($profile->firm_photo);
                        $updates['firm_photo'] = $newPath;
                        $processed++;
                    }
                } catch (\Throwable $e) {
                    $failed++;
                    $this->newLine();
                    $this->error("Profile #{$profile->id} firm_photo failed: {$e->getMessage()}");
                }
            }

            if (!$dryRun && $updates) {
                $profile->update($updates);
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("Processed: {$processed}, skipped (file missing): {$skipped}, failed: {$failed}.");

        if ($dryRun) {
            $this->comment('Dry run only — nothing was changed. Re-run without --dry-run to apply.');
        }
    }
}
