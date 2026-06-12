<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class MemberProfile extends Model
{
    protected $fillable = [
        'user_id',
        'photo',
        'firm_photo',
        'father_husband_name',
        'firm_name',
        'firm_address',
        'phone_number',
        'whatsapp_number',
        'email',
        'nature_of_business',
        'business_services',
        'residential_address',
        'spouse_name',
        'spouse_phone_number',
        'date_of_birth',
        'spouse_date_of_birth',
        'anniversary_date',
        'is_married',
        'number_of_children',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'spouse_date_of_birth' => 'date',
            'anniversary_date' => 'date',
            'is_married' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function children()
    {
        return $this->hasMany(Child::class);
    }

    public static function todaysCelebrations(): array
    {
        $month = now()->month;
        $day   = now()->day;
        $list  = [];

        // Member birthdays
        static::with('user')
            ->whereNotNull('date_of_birth')
            ->whereMonth('date_of_birth', $month)
            ->whereDay('date_of_birth', $day)
            ->get()
            ->each(function ($p) use (&$list) {
                $firm = $p->firm_name ? " of M/s {$p->firm_name}" : '';
                $list[] = [
                    'type'    => 'birthday',
                    'message' => "🎂🎉 UVA Vyapari Welfare Association wishes Yu {$p->user->name}{$firm} a very Happy Birthday! 🎈🎁",
                ];
            });

        // Spouse birthdays
        static::with('user')
            ->whereNotNull('spouse_date_of_birth')
            ->whereNotNull('spouse_name')
            ->whereMonth('spouse_date_of_birth', $month)
            ->whereDay('spouse_date_of_birth', $day)
            ->get()
            ->each(function ($p) use (&$list) {
                $firm = $p->firm_name ? " of M/s {$p->firm_name}" : '';
                $list[] = [
                    'type'    => 'spouse_birthday',
                    'message' => "🎂🌸 UVA Vyapari Welfare Association wishes Mrs {$p->spouse_name} wife of Yu {$p->user->name}{$firm} a very Happy Birthday! 🎉💐",
                ];
            });

        // Anniversaries
        static::with('user')
            ->whereNotNull('anniversary_date')
            ->whereMonth('anniversary_date', $month)
            ->whereDay('anniversary_date', $day)
            ->get()
            ->each(function ($p) use (&$list) {
                $firm = $p->firm_name ? " of M/s {$p->firm_name}" : '';
                $list[] = [
                    'type'    => 'anniversary',
                    'message' => "💍🥂 UVA Vyapari Welfare Association wishes Yu {$p->user->name}{$firm} a very Happy Anniversary! ❤️🌹",
                ];
            });

        // Children's birthdays
        Child::with('memberProfile.user')
            ->whereNotNull('date_of_birth')
            ->whereMonth('date_of_birth', $month)
            ->whereDay('date_of_birth', $day)
            ->get()
            ->each(function ($c) use (&$list) {
                $p    = $c->memberProfile;
                $firm = $p->firm_name ? " of M/s {$p->firm_name}" : '';
                $rel  = $c->gender === 'female' ? 'daughter of' : 'son of';
                $list[] = [
                    'type'    => 'child_birthday',
                    'message' => "🎈🎁 UVA Vyapari Welfare Association wishes {$c->name} {$rel} Yu {$p->user->name}{$firm} a very Happy Birthday! 🎂⭐",
                ];
            });

        return $list;
    }

    public function toFormData(): array
    {
        return [
            'photo_url'       => $this->photo ? asset('storage/' . $this->photo) : null,
            'firm_photo_url'  => $this->firm_photo ? asset('storage/' . $this->firm_photo) : null,
            'father_husband_name' => $this->father_husband_name,
            'firm_name' => $this->firm_name,
            'firm_address' => $this->firm_address,
            'phone_number' => $this->phone_number,
            'whatsapp_number' => $this->whatsapp_number,
            'email' => $this->email,
            'nature_of_business' => $this->nature_of_business,
            'business_services' => $this->business_services,
            'residential_address' => $this->residential_address,
            'spouse_name' => $this->spouse_name,
            'spouse_phone_number' => $this->spouse_phone_number,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'spouse_date_of_birth' => $this->spouse_date_of_birth?->format('Y-m-d'),
            'anniversary_date' => $this->anniversary_date?->format('Y-m-d'),
            'is_married' => $this->is_married,
            'number_of_children' => $this->number_of_children,
            'children' => $this->children->map(fn($c) => [
                'name' => $c->name,
                'date_of_birth' => $c->date_of_birth?->format('Y-m-d'),
                'gender' => $c->gender,
            ])->values()->all(),
        ];
    }
}
