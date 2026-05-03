<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

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

        try {
            $validated['user_id'] = Auth::id();

            Category::create($validated);

            return back();
        } catch (\Exception $e) {
            Log::error('カテゴリー保存失敗', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);

            return back()->withErrors([
                'error' => 'データの保存に失敗しました。',
            ]);
        }
    }

    public function destroy($id)
    {
        try {
            $category = Category::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            $category->delete();

            return back();
        } catch (\Exception $e) {
            Log::error('カテゴリー削除失敗', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);

            return back()->withErrors([
                'error' => 'データの削除に失敗しました。',
            ]);
        }
    }

    public function edit($id)
    {
        $category = Category::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('CategoryEdit', [
            'category' => $category,
        ]);
    }

    public function update($id, Request $request)
    {
        $validated = $request->validate(Category::$rules, Category::$messages);

        try {
            $category = Category::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            $validated['user_id'] = Auth::id();

            $category->update($validated);

            return back();
        } catch (\Exception $e) {
            Log::error('カテゴリー更新失敗', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);

            return back()->withErrors([
                'error' => 'データの更新に失敗しました。',
            ]);
        }
    }
}
