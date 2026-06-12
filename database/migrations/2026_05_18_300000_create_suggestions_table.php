<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('suggestions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->timestamps();
        });

        Schema::create('suggestion_reads', function (Blueprint $table) {
            $table->foreignId('executive_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('suggestion_id')->constrained()->onDelete('cascade');
            $table->primary(['executive_id', 'suggestion_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('suggestion_reads');
        Schema::dropIfExists('suggestions');
    }
};
