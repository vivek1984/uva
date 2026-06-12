<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('business_slug')->nullable()->unique()->after('status');
        });

        // Populate existing users
        $users = DB::table('users')->get();

        foreach ($users as $user) {
            $profile  = DB::table('member_profiles')->where('user_id', $user->id)->first();
            $source   = ($profile?->firm_name) ?: $user->name;
            $base     = Str::slug($source) ?: 'member';

            $taken = DB::table('users')
                ->where('business_slug', $base)
                ->where('id', '!=', $user->id)
                ->exists();

            $slug = $taken ? $base . '-' . $user->id : $base;

            DB::table('users')->where('id', $user->id)->update(['business_slug' => $slug]);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('business_slug');
        });
    }
};
