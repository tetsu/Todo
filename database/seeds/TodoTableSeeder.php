<?php

use Illuminate\Database\Seeder;
use App\Todo;

class TodoTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $faker = Faker\Factory::create('ja_JP');

      Todo::create([
          'title' => 'Task A',
          'content' => 'Content A',
          'starts_at' => $faker->dateTime(),
          'ends_at' => $faker->dateTime()
      ]);
      Todo::create([
          'title' => 'Task B',
          'content' => 'Content B',
          'starts_at' => $faker->dateTime(),
          'ends_at' => $faker->dateTime()
      ]);
      Todo::create([
          'title' => 'Task C',
          'content' => 'Content C',
          'starts_at' => $faker->dateTime(),
          'ends_at' => $faker->dateTime()
      ]);
      Todo::create([
          'title' => 'Task D',
          'content' => 'Content D',
          'starts_at' => $faker->dateTime(),
          'ends_at' => $faker->dateTime()
      ]);
      Todo::create([
          'title' => 'Task E',
          'content' => 'Content E',
          'starts_at' => $faker->dateTime(),
          'ends_at' => $faker->dateTime()
      ]);
    }
}
