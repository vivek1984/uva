<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The old free-text column is kept for historical reference (its
        // values are already migrated into real `categories` rows), but it
        // must not keep the name `category` — that name collides with the
        // new `Product::category()` Eloquent relation, which always loses
        // to a same-named raw attribute/column.
        Schema::table('products', function (Blueprint $table) {
            $table->renameColumn('category', 'legacy_category');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->renameColumn('legacy_category', 'category');
        });
    }
};
