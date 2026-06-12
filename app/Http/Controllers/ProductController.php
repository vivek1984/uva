<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductPhoto;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $products = $user->products()
            ->with('photos')
            ->orderByDesc('created_at')
            ->get()
            ->map->toCardData()
            ->values();

        return \Inertia\Inertia::render('MyProducts', [
            'products'     => $products,
            'businessSlug' => $user->business_slug,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'         => 'required|string|max:255',
            'description'  => 'nullable|string',
            'price'        => 'nullable|string|max:50',
            'category'     => 'nullable|string|max:100',
            'is_published' => 'boolean',
            'photos'       => 'nullable|array|max:10',
            'photos.*'     => 'image|max:4096',
        ]);

        $product = $request->user()->products()->create([
            'name'         => $data['name'],
            'description'  => $data['description'] ?? null,
            'price'        => $data['price'] ?? null,
            'category'     => $data['category'] ?? null,
            'is_published' => $data['is_published'] ?? true,
        ]);

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $i => $file) {
                $path = ImageService::storeAsWebp($file, "products/{$product->id}");
                $product->photos()->create(['path' => $path, 'sort_order' => $i]);
            }
        }

        return back()->with('success', 'Product added successfully.');
    }

    public function update(Request $request, Product $product)
    {
        abort_if($product->user_id !== $request->user()->id, 403);

        $data = $request->validate([
            'name'              => 'required|string|max:255',
            'description'       => 'nullable|string',
            'price'             => 'nullable|numeric|min:0',
            'category'          => 'nullable|string|max:100',
            'is_published'      => 'boolean',
            'photos'            => 'nullable|array|max:10',
            'photos.*'          => 'image|max:4096',
            'delete_photo_ids'  => 'nullable|array',
            'delete_photo_ids.*'=> 'integer',
        ]);

        $product->update([
            'name'         => $data['name'],
            'description'  => $data['description'] ?? null,
            'price'        => $data['price'] ?? null,
            'category'     => $data['category'] ?? null,
            'is_published' => $data['is_published'] ?? true,
        ]);

        // Remove photos marked for deletion
        if (!empty($data['delete_photo_ids'])) {
            $toDelete = ProductPhoto::whereIn('id', $data['delete_photo_ids'])
                ->where('product_id', $product->id)
                ->get();

            foreach ($toDelete as $photo) {
                Storage::disk('public')->delete($photo->path);
                $photo->delete();
            }
        }

        // Add new photos
        if ($request->hasFile('photos')) {
            $nextOrder = $product->photos()->max('sort_order') + 1;
            foreach ($request->file('photos') as $i => $file) {
                $path = ImageService::storeAsWebp($file, "products/{$product->id}");
                $product->photos()->create(['path' => $path, 'sort_order' => $nextOrder + $i]);
            }
        }

        return back()->with('success', 'Product updated successfully.');
    }

    public function destroy(Request $request, Product $product)
    {
        abort_if($product->user_id !== $request->user()->id, 403);

        foreach ($product->photos as $photo) {
            Storage::disk('public')->delete($photo->path);
        }

        $product->delete();

        return back()->with('success', 'Product deleted.');
    }
}
