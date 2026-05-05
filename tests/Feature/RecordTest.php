<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Record;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RecordTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_record(): void
    {
        $user = User::factory()->create();

        $category = Category::create([
            'category_name' => 'Laravel',
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->post('/store', [
            'study_date' => '2026-05-05',
            'study_time' => 60,
            'category_id' => $category->id,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('records', [
            'study_date' => '2026-05-05',
            'study_time' => 60,
            'category_id' => $category->id,
            'user_id' => $user->id,
        ]);
    }

    public function test_user_can_update_record(): void
    {
        $user = User::factory()->create();

        $category = Category::create([
            'category_name' => 'Laravel',
            'user_id' => $user->id,
        ]);

        $record = Record::create([
            'study_date' => '2026-05-05',
            'study_time' => 60,
            'category_id' => $category->id,
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->put('/update/' . $record->id, [
            'study_date' => '2026-05-06',
            'study_time' => 90,
            'category_id' => $category->id,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('records', [
            'id' => $record->id,
            'study_date' => '2026-05-06',
            'study_time' => 90,
            'category_id' => $category->id,
            'user_id' => $user->id,
        ]);
    }

    public function test_user_can_delete_record(): void
    {
        $user = User::factory()->create();

        $category = Category::create([
            'category_name' => 'Laravel',
            'user_id' => $user->id,
        ]);

        $record = Record::create([
            'study_date' => '2026-05-05',
            'study_time' => 60,
            'category_id' => $category->id,
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->delete('/destroy/' . $record->id);

        $response->assertRedirect();

        $this->assertDatabaseMissing('records', [
            'id' => $record->id,
        ]);
    }

    public function test_validation_error_when_required_fields_are_missing(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/store', [
            'study_date' => '',
            'study_time' => '',
            'category_id' => '',
        ]);

        $response->assertSessionHasErrors([
            'study_date',
            'study_time',
            'category_id',
        ]);


    }

    public function test_user_cannot_update_other_users_record(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $otherCategory = Category::create([
            'category_name' => 'Java',
            'user_id' => $otherUser->id,
        ]);

        $otherRecord = Record::create([
            'study_date' => '2026-05-05',
            'study_time' => 60,
            'category_id' => $otherCategory->id,
            'user_id' => $otherUser->id,
        ]);

        $response = $this->actingAs($user)->put('/update/' . $otherRecord->id, [
            'study_date' => '2026-05-05',
            'study_time' => 120,
            'category_id' => $otherCategory->id,
        ]);

        $response->assertRedirect();
        $response->assertSessionHasErrors(['error']);

        $this->assertDatabaseHas('records', [
            'id' => $otherRecord->id,
            'study_time' => 60,
            'user_id' => $otherUser->id,
        ]);
    }

    public function test_user_cannot_delete_other_users_record(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $otherCategory = Category::create([
            'category_name' => 'Java',
            'user_id' => $otherUser->id,
        ]);

        $otherRecord = Record::create([
            'study_date' => '2026-05-05',
            'study_time' => 60,
            'category_id' => $otherCategory->id,
            'user_id' => $otherUser->id,
        ]);

        $response = $this->actingAs($user)->delete('/destroy/' . $otherRecord->id);

        $response->assertRedirect();
        $response->assertSessionHasErrors(['error']);

        $this->assertDatabaseHas('records', [
            'id' => $otherRecord->id,
            'user_id' => $otherUser->id,
        ]);
    }

    public function test_study_time_totals_are_correct(): void
    {
        $user = User::factory()->create();

        $category = Category::create([
            'category_name' => 'Laravel',
            'user_id' => $user->id,
        ]);

        Record::create([
            'study_date' => '2026-05-05',
            'study_time' => 60,
            'category_id' => $category->id,
            'user_id' => $user->id,
        ]);

        Record::create([
            'study_date' => '2026-05-06',
            'study_time' => 90,
            'category_id' => $category->id,
            'user_id' => $user->id,
        ]);

        Record::create([
            'study_date' => '2026-06-01',
            'study_time' => 120,
            'category_id' => $category->id,
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->get('/records/by-date?date=2026-05-05');

        $response->assertOk();

        $response->assertJson([
            'todayStudyTime' => 60,
            'weeklyStudyTime' => 150,
            'monthlyStudyTime' => 150,
            'yearlyStudyTime' => 270,
            'totalStudyTime' => 270,
        ]);
    }
}
