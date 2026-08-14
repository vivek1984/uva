<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class BusinessPageController extends Controller
{
    public function show(User $user)
    {
        $profile = $user->profile;

        $products = $user->products()
            ->where('is_published', true)
            ->with('photos')
            ->orderByDesc('created_at')
            ->get()
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
            'products' => $products,
        ]);
    }
}
