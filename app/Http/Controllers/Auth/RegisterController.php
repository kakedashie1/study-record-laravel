<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RegisterController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
            ]);

            $user->categories()->createMany([
                [
                    'category_name' => 'プログラミング',
                    'color' => '#3B82F6',
                ],
                [
                    'category_name' => '英語',
                    'color' => '#22C55E',
                ],
                [
                    'category_name' => '資格勉強',
                    'color' => '#F59E0B',
                ],
                [
                    'category_name' => '読書',
                    'color' => '#8B5CF6',
                ],
                [
                    'category_name' => 'その他',
                    'color' => '#6B7280',
                ],
            ]);

            return $user;
        });

        Auth::login($user);

        return redirect('/');
    }
}
