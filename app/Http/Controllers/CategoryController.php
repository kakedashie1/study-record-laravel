<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('user_id', Auth::id())->get();
        return Inertia::render('Category', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate(Category::$rules, Category::$messages);
        $validated['user_id'] = Auth::id();
        $result = Category::create($validated);

        return redirect()->action([TopController::class, 'index']);
    }

    public function destroy($id)
    {
        $category = Category::find($id);

        if ($category) {
            $category->delete();
        }

        return redirect()->action([TopController::class, 'index']);
    }

    public function edit($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return redirect()->action([TopController::class, 'index']);
        }

        return Inertia::render('CategoryEdit', [
            'category' => $category,
        ]);
    }

    public function update($id, Request $request)
    {
        $category = Category::find($id);
        if ($category) {
            $validated = $request->validate(Category::$rules, Category::$messages);
            $validated['user_id'] = Auth::id();
            $category->update($validated);
        }

        return redirect()->action([TopController::class, 'index']);
    }
}
