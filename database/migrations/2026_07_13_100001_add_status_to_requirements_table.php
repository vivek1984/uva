<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('requirements', function (Blueprint $table) {
            $table->enum('status', ['open', 'attended', 'completed'])->default('open')->after('details');
            $table->timestamp('completed_at')->nullable()->after('attended_at');
        });

        // Backfill status for any existing rows based on current attended_by state.
        DB::table('requirements')->whereNotNull('attended_by')->update(['status' => 'attended']);
    }

    public function down(): void
    {
        Schema::table('requirements', function (Blueprint $table) {
            $table->dropColumn(['status', 'completed_at']);
        });
    }
};
