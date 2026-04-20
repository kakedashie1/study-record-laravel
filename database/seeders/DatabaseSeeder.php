<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test2 User',
            'email' => 'test2@example.com',
            'password' => Hash::make('password'),
        ]);

        User::factory()->create([
            'name' => 'kubota',
            'email' => 'kubota@example.com',
            'password' => Hash::make('password'),
        ]);
    }
}
