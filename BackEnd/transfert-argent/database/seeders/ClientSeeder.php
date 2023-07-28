<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = [
            [
                "prenom" => "Thioro",
                "nom" => "Faye",
                "telephone" => "785830419",
                "email" => "fayethioro@gmail.com",
            ],
            [
                "prenom" => "Mar",
                "nom" => "Ndiaye",
                "telephone" => "771234523",
                "email" => "ndiayemar@gmail.com",
            ],
            [
                "prenom" => "Diogal",
                "nom" => "Ndiaye",
                "telephone" => "765830419",
                "email" => "ndiayedioagl@gmail.com",
            ],

        ];
        Client::insert($clients);
    }
}
