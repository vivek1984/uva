<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;

class ProductPageController extends Controller
{
    public function show(User $user, Product $product)
    {
        abort_if($product->user_id !== $user->id, 404);
        abort_if(! $product->is_published, 404);

        $profile = $user->profile;
        $product->load('photos');

        return Inertia::render('ProductPage', [
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
                'photo_url'          => $profile?->photo ? asset('storage/' . $profile->photo) : null,
                'firm_photo_url'     => $profile?->firm_photo ? asset('storage/' . $profile->firm_photo) : null,
                'page_url'           => route('business.show', $user->business_slug),
            ],
            'product' => $product->toCardData() + [
                'page_url' => route('product.show', [$user->business_slug, $product->slug]),
            ],
        ]);
    }
}
