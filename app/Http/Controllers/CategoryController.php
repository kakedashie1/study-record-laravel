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
        try {
            $validated = $request->validate(Category::$rules, Category::$messages);
            $validated['user_id'] = Auth::id();
            $result = Category::create($validated);

            return redirect()->action([TopController::class, 'index']);
        } catch (\Exception $e) {
            Log::error('記録保存失敗', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);
            return redirect()->action([TopController::class, 'index'])->withErrors(['error' => 'データの保存に失敗しました。']);
        }
    }

    public function destroy($id)
    {
        try {
            $category = Category::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();
            if ($category) {
                $category->delete();
            }

            return redirect()->action([TopController::class, 'index']);
        } catch (\Exception $e) {
            Log::error('記録保存失敗', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);
            return redirect()->action([TopController::class, 'index'])->withErrors(['error' => 'データの削除に失敗しました。']);
        }
    }

    public function edit($id)
    {
        $category = Category::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();
        if (!$category) {
            return redirect()->action([TopController::class, 'index']);
        }

        return Inertia::render('CategoryEdit', [
            'category' => $category,
        ]);
    }

    public function update($id, Request $request)
    {
        try {
            $category = Category::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();
            if ($category) {
                $validated = $request->validate(Category::$rules, Category::$messages);
                $validated['user_id'] = Auth::id();
                $category->update($validated);
            }

            return redirect()->action([TopController::class, 'index']);
        } catch (\Exception $e) {
            Log::error('記録保存失敗', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);
            return redirect()->action([TopController::class, 'index'])->withErrors(['error' => 'データの更新に失敗しました。']);
        }
    }
}
