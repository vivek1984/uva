<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_their_own_category(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/categories', ['name' => 'Clothing']);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('categories', [
            'user_id' => $user->id,
            'name'    => 'Clothing',
            'slug'    => 'clothing',
        ]);
    }

    public function test_two_users_can_have_a_category_with_the_same_name(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $this->actingAs($userA)->post('/categories', ['name' => 'Clothing']);
        $this->actingAs($userB)->post('/categories', ['name' => 'Clothing']);

        $this->assertSame(2, Category::where('name', 'Clothing')->count());
    }

    public function test_user_cannot_delete_another_users_category(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $category = $owner->categories()->create(['name' => 'Clothing', 'slug' => 'clothing']);

        $response = $this->actingAs($other)->delete("/categories/{$category->id}");

        $response->assertForbidden();
        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }

    public function test_deleting_a_category_with_products_is_blocked(): void
    {
        $user = User::factory()->create();
        $category = $user->categories()->create(['name' => 'Clothing', 'slug' => 'clothing']);
        $user->products()->create([
            'name'        => 'T-Shirt',
            'slug'        => 't-shirt',
            'category_id' => $category->id,
        ]);

        $response = $this->actingAs($user)->delete("/categories/{$category->id}");

        $response->assertSessionHas('error');
        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }

    public function test_deleting_an_empty_category_succeeds(): void
    {
        $user = User::factory()->create();
        $category = $user->categories()->create(['name' => 'Clothing', 'slug' => 'clothing']);

        $response = $this->actingAs($user)->delete("/categories/{$category->id}");

        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_product_category_id_must_belong_to_the_same_user(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $foreignCategory = $otherUser->categories()->create(['name' => 'Clothing', 'slug' => 'clothing']);

        $response = $this->actingAs($user)->post('/my/products', [
            'name'        => 'T-Shirt',
            'category_id' => $foreignCategory->id,
        ]);

        $response->assertSessionHasErrors('category_id');
    }

    public function test_business_page_paginates_at_twenty_and_filters_by_category(): void
    {
        $user = User::factory()->create(['business_slug' => 'test-seller']);
        $clothing = $user->categories()->create(['name' => 'Clothing', 'slug' => 'clothing']);

        for ($i = 1; $i <= 25; $i++) {
            $user->products()->create([
                'name'         => "Product {$i}",
                'slug'         => "product-{$i}",
                'category_id'  => $i <= 5 ? $clothing->id : null,
                'is_published' => true,
            ]);
        }

        $response = $this->get('/test-seller');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('BusinessPage')
            ->where('totalCount', 25)
            ->where('pagination.lastPage', 2)
            ->has('products', 20)
            ->where('uncategorizedCount', 20)
            ->has('categoryTabs', 1)
        );

        $filtered = $this->get('/test-seller?category=clothing');
        $filtered->assertInertia(fn ($page) => $page
            ->where('activeCategory', 'clothing')
            ->has('products', 5)
        );
    }
}
