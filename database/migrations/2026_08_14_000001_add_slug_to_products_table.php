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
            $table->string('slug')->nullable()->after('name');
        });

        $used = [];

        DB::table('products')
            ->orderBy('user_id')
            ->orderBy('id')
            ->get(['id', 'user_id', 'name'])
            ->each(function ($product) use (&$used) {
                $base = Str::slug($product->name) ?: 'product';
                $slug = $base;
                $i = 2;

                while (isset($used[$product->user_id][$slug])) {
                    $slug = $base . '-' . $i;
                    $i++;
                }

                $used[$product->user_id][$slug] = true;

                DB::table('products')
                    ->where('id', $product->id)
                    ->update(['slug' => $slug]);
            });

        Schema::table('products', function (Blueprint $table) {
            $table->unique(['user_id', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'slug']);
            $table->dropColumn('slug');
        });
    }
};
