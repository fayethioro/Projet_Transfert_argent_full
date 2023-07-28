<?php

namespace Database\Seeders;

use App\Models\Compte;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CompteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $comptes =[
            [
                "numero_compte" => "OM_785830419",
                "fournisseur" =>"OM",
                "client_id" => 1
            ],
            [
                "numero_compte" => "WV_771234523",
                "fournisseur" =>"WV",
                "client_id" => 2
            ],
            [
                "numero_compte" => "CB_765830419",
                "fournisseur" =>"CB",
                "client_id" => 3
            ]

        ];

        Compte::insert($comptes);

    }
}
