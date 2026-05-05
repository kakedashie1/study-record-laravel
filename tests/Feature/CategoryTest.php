<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_category(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/categories/store', [
            'category_name' => 'Laravel',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('categories', [
            'category_name' => 'Laravel',
            'user_id' => $user->id,
        ]);
    }

    public function test_usr_can_update_category(): void
    {
        $user = User::factory()->create();

        $category = Category::create([
            'category_name' => 'Laravel',
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->put('/categories/update/' . $category->id, [
            'category_name' => 'Updated Laravel',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'category_name' => 'Updated Laravel',
            'user_id' => $user->id,
        ]);
    }

    public function test_usr_can_delete_category(): void
    {
        $user = User::factory()->create();

        $category = Category::create([
            'category_name' => 'Laravel',
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->delete('/categories/destroy/' . $category->id);

        $response->assertRedirect();

        $this->assertDatabaseMissing('categories', [
            'id' => $category->id,
            'category_name' => 'Laravel',
            'user_id' => $user->id,
        ]);
    }

    public function test_validation_error_when_category_name_is_missing(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/categories/store', [
            'category_name' => '',
        ]);

        $response->assertSessionHasErrors([
            'category_name',
        ]);
    }

    public function test_user_cannot_update_other_users_category(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $otherCategory = Category::create([
            'category_name' => 'Java',
            'user_id' => $otherUser->id,
        ]);

        $response = $this->actingAs($user)->put('/categories/update/' . $otherCategory->id, [
            'category_name' => 'Updated',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasErrors(['error']);

        $this->assertDatabaseHas('categories', [
            'id' => $otherCategory->id,
            'category_name' => 'Java',
            'user_id' => $otherUser->id,
        ]);
    }

    public function test_user_cannot_delete_other_users_category(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $otherCategory = Category::create([
            'category_name' => 'Java',
            'user_id' => $otherUser->id,
        ]);

        $response = $this->actingAs($user)->delete('/categories/destroy/' . $otherCategory->id);

        $response->assertRedirect();
        $response->assertSessionHasErrors(['error']);

        $this->assertDatabaseHas('categories', [
            'id' => $otherCategory->id,
            'category_name' => 'Java',
            'user_id' => $otherUser->id,
        ]);
    }
}
