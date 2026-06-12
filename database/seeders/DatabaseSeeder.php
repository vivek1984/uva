<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'phone_number' => '0000000000',
            'email' => 'admin@uva.com',
            'password' => Hash::make('admin@123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $posts = [
            ['name' => 'Chairman', 'description' => 'Head of the association'],
            ['name' => 'Vice Chairman', 'description' => 'Deputy head of the association'],
            ['name' => 'Secretary', 'description' => 'Manages association records and correspondence'],
            ['name' => 'Joint Secretary', 'description' => 'Assists the Secretary'],
            ['name' => 'Treasurer', 'description' => 'Manages association finances'],
            ['name' => 'President', 'description' => 'President of the association'],
            ['name' => 'Vice President', 'description' => 'Deputy President'],
            ['name' => 'Executive Member', 'description' => 'General executive committee member'],
        ];

        foreach ($posts as $post) {
            Post::create($post);
        }

        $this->call(DummyDataSeeder::class);
    }
}
