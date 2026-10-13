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
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('category')
                ->constrained('categories')->restrictOnDelete();
        });

        // Backfill: each distinct (user_id, category) pair becomes a real
        // Category row owned by that same seller, then matching products
        // are linked to it. Two sellers who typed the same word each get
        // their own separate Category — categories are never shared.
        $used = [];

        DB::table('products')
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->select('user_id', 'category')
            ->distinct()
            ->orderBy('user_id')
            ->get()
            ->each(function ($row) use (&$used) {
                $base = Str::slug($row->category) ?: 'category';
                $slug = $base;
                $i = 2;

                while (isset($used[$row->user_id][$slug])) {
                    $slug = $base . '-' . $i;
                    $i++;
                }

                $used[$row->user_id][$slug] = true;

                $categoryId = DB::table('categories')->insertGetId([
                    'user_id'    => $row->user_id,
                    'name'       => $row->category,
                    'slug'       => $slug,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                DB::table('products')
                    ->where('user_id', $row->user_id)
                    ->where('category', $row->category)
                    ->update(['category_id' => $categoryId]);
            });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropConstrainedForeignId('category_id');
        });
    }
};
