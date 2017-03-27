<?php

use Illuminate\Database\Seeder;
use App\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $faker = Faker\Factory::create('ja_JP');

      User::create([
          'name' => '鉄郎',
          'email' => 'tetsuromori@gmail.com',
          'password' => bcrypt('secret')
      ]);

      User::create([
          'name' => 'テストユーザー',
          'email' => 'test@test.com',
          'password' => bcrypt('secret')
      ]);

      for($i=0; $i<4; $i++){
        User::create([
          'name' => $faker->name,
          'email' => $faker->email,
          'password' => bcrypt('secret')
        ]);
      }
    }
}
