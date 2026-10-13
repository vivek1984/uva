<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('member_profiles', function (Blueprint $table) {
            $table->string('external_website_url')->nullable()->after('business_services');
            $table->boolean('redirect_to_external_website')->default(false)->after('external_website_url');
        });
    }

    public function down(): void
    {
        Schema::table('member_profiles', function (Blueprint $table) {
            $table->dropColumn(['external_website_url', 'redirect_to_external_website']);
        });
    }
};
