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
                "numero" => "785830419",
                "prenom" => "Thioro",
                "nom" => "Faye",
                "email" => "fayethioro@gmail.com",
            ],
            [
                "numero" => "771234523",
                "prenom" => "Mar",
                "nom" => "Ndiaye",
                "email" => "ndiayemar@gmail.com",
            ],
            [
                "numero" => "765830419",
                "prenom" => "Diogal",
                "nom" => "Ndiaye",
                "email" => "ndiayedioagl@gmail.com",
            ],
            [
                "numero" => "782646880",
                "prenom" => "Lamine",
                "nom" => "Gaye",
                "email" => "gayelamine@gmail.com",
            ],
            [
                "numero" => "762646880",
                "prenom" => "Moussa",
                "nom" => "Sagna",
                "email" => "sagnamoussa@gmail.com",
            ],
            [
                "numero" => "771234567",
                "prenom" => "matar",
                "nom" => "Ndiaye",
                "email" => "ndiayematar@gmail.com",
            ],

        ];
        Client::insert($clients);
    }
}
