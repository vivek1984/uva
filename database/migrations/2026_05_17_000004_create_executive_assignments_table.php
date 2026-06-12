<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Which executive manages which general member. general_member_id is unique — one executive per general member.
    public function up(): void
    {
        Schema::create('executive_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('executive_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('general_member_id')->unique()->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('executive_assignments');
    }
};
