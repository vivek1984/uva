<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('member_profiles', function (Blueprint $table) {
            $table->string('father_husband_name', 150)->nullable()->after('user_id');
            $table->text('firm_address')->nullable()->after('firm_name');
            $table->string('whatsapp_number', 20)->nullable()->after('phone_number');
            $table->string('email', 255)->nullable()->after('whatsapp_number');
            $table->enum('nature_of_business', ['wholesale', 'retail', 'both'])->nullable()->after('email');
            $table->text('business_services')->nullable()->after('nature_of_business');
            $table->text('residential_address')->nullable()->after('business_services');
            $table->string('spouse_phone_number', 20)->nullable()->after('spouse_name');
            $table->boolean('is_married')->default(false)->after('number_of_children');
        });
    }

    public function down(): void
    {
        Schema::table('member_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'father_husband_name',
                'firm_address',
                'whatsapp_number',
                'email',
                'nature_of_business',
                'business_services',
                'residential_address',
                'spouse_phone_number',
                'is_married',
            ]);
        });
    }
};
