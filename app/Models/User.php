<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'phone_number',
        'email',
        'password',
        'role',
        'status',
        'business_slug',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public static function generateBusinessSlug(self $user, ?string $firmName): string
    {
        $source = ($firmName && trim($firmName) !== '') ? $firmName : $user->name;
        $base   = Str::slug($source) ?: 'member';

        $taken = static::where('business_slug', $base)
            ->where('id', '!=', $user->id)
            ->exists();

        return $taken ? $base . '-' . $user->id : $base;
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isActive(): bool
    {
        return $this->role === 'admin' || $this->status === 'active';
    }

    public function isExecutive(): bool
    {
        return $this->role === 'executive';
    }

    public function isGeneral(): bool
    {
        return $this->role === 'general';
    }

    public function profile()
    {
        return $this->hasOne(MemberProfile::class);
    }

    // The post this executive holds
    public function heldPost()
    {
        return $this->hasOne(UserPost::class);
    }

    // General members managed by this executive
    public function managedMembers()
    {
        return $this->hasMany(ExecutiveAssignment::class, 'executive_id');
    }

    // The executive managing this general member
    public function assignedExecutive()
    {
        return $this->hasOne(ExecutiveAssignment::class, 'general_member_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function memberFees()
    {
        return $this->hasMany(MemberFee::class);
    }

    public function accountingPermission()
    {
        return $this->hasOne(AccountingPermission::class);
    }

    public function hasAccountingAccess(): bool
    {
        return $this->isAdmin() || $this->accountingPermission !== null;
    }

    public function canEditAccounting(): bool
    {
        return $this->isAdmin() || $this->accountingPermission?->permission === 'edit';
    }
}
