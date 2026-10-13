<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('categories', 'name')->where('user_id', $request->user()->id),
            ],
        ]);

        $category = $request->user()->categories()->create([
            'name' => $data['name'],
            'slug' => Category::generateSlug($request->user()->id, $data['name']),
        ]);

        return back()->with('success', 'Category added.')->with('newCategory', [
            'id'   => $category->id,
            'name' => $category->name,
        ]);
    }

    public function destroy(Request $request, Category $category)
    {
        abort_if($category->user_id !== $request->user()->id, 403);

        if ($category->products()->exists()) {
            return back()->with('error', 'This category still has products assigned to it. Reassign or delete those products first.');
        }

        $category->delete();

        return back()->with('success', 'Category deleted.');
    }
}
