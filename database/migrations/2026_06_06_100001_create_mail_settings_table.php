<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mail_settings', function (Blueprint $table) {
            $table->id();
            $table->string('host')->default('smtp.gmail.com');
            $table->unsignedSmallInteger('port')->default(587);
            $table->string('encryption')->default('tls');
            $table->string('username')->nullable();
            $table->string('password')->nullable();
            $table->string('from_address')->default('');
            $table->string('from_name')->default('UVA Vyapari Welfare Association');
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mail_settings');
    }
};
