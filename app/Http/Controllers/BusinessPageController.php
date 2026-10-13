<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessPageController extends Controller
{
    private const PER_PAGE = 20;

    public function show(User $user, Request $request)
    {
        $profile = $user->profile;

        if ($profile?->redirect_to_external_website && $profile->external_website_url && ! $request->boolean('catalog')) {
            return Inertia::render('ExternalRedirect', [
                'member' => [
                    'name'      => $user->name,
                    'firm_name' => $profile->firm_name,
                    'photo_url' => $profile->photo ? asset('storage/' . $profile->photo) : null,
                ],
                'externalUrl' => $profile->external_website_url,
                'fallbackUrl' => route('business.show', $user->business_slug) . '?catalog=1',
            ]);
        }

        $base = $user->products()->where('is_published', true);

        // Category tabs: only categories this seller actually has published
        // products in, each with a count — "All Products" is simply "no
        // filter applied", never a literal row every product belongs to.
        $categoryCounts = (clone $base)
            ->whereNotNull('category_id')
            ->selectRaw('category_id, count(*) as aggregate')
            ->groupBy('category_id')
            ->pluck('aggregate', 'category_id');

        $categoryTabs = Category::whereIn('id', $categoryCounts->keys())
            ->orderBy('name')
            ->get(['id', 'name', 'slug'])
            ->map(fn ($category) => [
                'id'    => $category->id,
                'name'  => $category->name,
                'slug'  => $category->slug,
                'count' => $categoryCounts[$category->id],
            ])
            ->values();

        $uncategorizedCount = (clone $base)->whereNull('category_id')->count();
        $totalCount = (clone $base)->count();

        $activeCategorySlug = $request->query('category');
        $query = (clone $base)->with(['photos', 'category']);

        if ($activeCategorySlug === 'uncategorized') {
            $query->whereNull('category_id');
        } elseif ($activeCategorySlug) {
            $matched = $categoryTabs->firstWhere('slug', $activeCategorySlug);
            if ($matched) {
                $query->where('category_id', $matched['id']);
            }
        }

        $paginated = $query->orderByDesc('created_at')
            ->paginate(self::PER_PAGE)
            ->withQueryString();

        $products = collect($paginated->items())
            ->map(fn ($product) => $product->toCardData() + [
                'page_url' => $product->slug
                    ? route('product.show', [$user->business_slug, $product->slug])
                    : null,
            ])
            ->values();

        $canonicalUrl = route('business.show', $user->business_slug);

        return Inertia::render('BusinessPage', [
            'member' => [
                'id'                 => $user->id,
                'name'               => $user->name,
                'firm_name'          => $profile?->firm_name,
                'firm_address'       => $profile?->firm_address,
                'nature_of_business' => $profile?->nature_of_business,
                'business_services'  => $profile?->business_services,
                'phone_number'       => $profile?->phone_number,
                'whatsapp_number'    => $profile?->whatsapp_number,
                'email'              => $profile?->email ?? $user->email,
                'photo_url'          => $profile?->photo      ? asset('storage/' . $profile->photo)      : null,
                'firm_photo_url'     => $profile?->firm_photo ? asset('storage/' . $profile->firm_photo) : null,
                'page_url'           => $canonicalUrl,
            ],
            'products'           => $products,
            'activeCategory'     => $activeCategorySlug,
            'categoryTabs'       => $categoryTabs,
            'uncategorizedCount' => $uncategorizedCount,
            'totalCount'         => $totalCount,
            'pagination'         => [
                'currentPage' => $paginated->currentPage(),
                'lastPage'    => $paginated->lastPage(),
                'total'       => $paginated->total(),
                'nextPageUrl' => $paginated->nextPageUrl(),
                'prevPageUrl' => $paginated->previousPageUrl(),
                'pageUrls'    => collect(range(1, max($paginated->lastPage(), 1)))
                    ->mapWithKeys(fn ($page) => [$page => $paginated->url($page)]),
            ],
        ]);
    }
}
