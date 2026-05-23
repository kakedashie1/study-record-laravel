<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrateSqliteToPostgres extends Command
{
    protected $signature = 'app:migrate-sqlite-to-postgres';

    protected $description = 'Migrate SQLite data to PostgreSQL';

    public function handle()
    {
        $this->info('SQLite → PostgreSQL migration started.');

        $sqlitePath = database_path('database_backup.sqlite');

        config([
            'database.connections.sqlite_old' => [
                'driver' => 'sqlite',
                'database' => $sqlitePath,
                'prefix' => '',
                'foreign_key_constraints' => true,
            ],
        ]);

        DB::connection('pgsql')->statement(
            'TRUNCATE records, categories, users RESTART IDENTITY CASCADE'
        );

        foreach (DB::connection('sqlite_old')->table('users')->get() as $user) {
            DB::connection('pgsql')->table('users')->insert((array) $user);
        }

        $categories = DB::connection('sqlite_old')
            ->table('categories')
            ->get();

        foreach ($categories as $category) {
            DB::connection('pgsql')
                ->table('categories')
                ->insert([
                    'id' => $category->id,
                    'category_name' => $category->category_name,
                    'user_id' => $category->user_id,
                    'created_at' => $category->created_at,
                    'updated_at' => $category->updated_at,
                    'color' => $category->color ?: '#2563eb',
                ]);
        }

        foreach (DB::connection('sqlite_old')->table('records')->get() as $record) {
            DB::connection('pgsql')->table('records')->insert((array) $record);
        }

        DB::connection('pgsql')->statement(
            "SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1))"
        );

        DB::connection('pgsql')->statement(
            "SELECT setval('categories_id_seq', COALESCE((SELECT MAX(id) FROM categories), 1))"
        );

        DB::connection('pgsql')->statement(
            "SELECT setval('records_id_seq', COALESCE((SELECT MAX(id) FROM records), 1))"
        );

        $this->info('Migration completed.');
    }
}
