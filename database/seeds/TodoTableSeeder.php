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

      for($i=0; $i<100; $i++){
        Todo::create([
          'title' => 'タスク'.$i,
          'user_id' => rand(1,5),
          'priority' => rand(1,5),
          'due_date' => $faker->date($format='Y-m-d'),
          'comp_date' => rand(0,10)==0 ? $faker->date($format='Y-m-d') : null
        ]);
      }
    }
}
