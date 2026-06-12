<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\MemberProfile;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'         => 'required|string|max:255',
            'firm_name'    => 'required|string|max:150',
            'phone_number' => 'required|digits:10|unique:'.User::class.',phone_number',
            'email'        => 'nullable|string|lowercase|email|max:255|unique:'.User::class.',email',
            'password'     => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name'         => $request->name,
            'phone_number' => $request->phone_number,
            'email'        => $request->email ?: null,
            'password'     => Hash::make($request->password),
        ]);

        $firmName = $request->firm_name;

        MemberProfile::create([
            'user_id'   => $user->id,
            'firm_name' => $firmName,
        ]);

        $user->update(['business_slug' => User::generateBusinessSlug($user, $firmName)]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
