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

      for($i=1; $i<101; $i++){
        Todo::create([
          'title' => 'タスク'.$i,
          'user_id' => rand(1,6),
          'detail' => $faker->text,
          'priority' => rand(1,5),
          'due_date' => $faker->date($format='Y-m-d'),
          'comp_date' => rand(0,3)==0 ? $faker->date($format='Y-m-d') : null
        ]);
      }
    }
}
