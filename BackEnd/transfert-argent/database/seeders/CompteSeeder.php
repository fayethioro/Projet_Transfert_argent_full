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
                "numero_client" => "785830419"
            ],
            [
                "numero_compte" => "OM_771234567",
                "fournisseur" =>"OM",
                "numero_client" => "771234567"
            ],
            [
                "numero_compte" => "WV_771234523",
                "fournisseur" =>"WV",
                "numero_client" => "771234523"
            ],
            [
                "numero_compte" => "WR_782646880",
                "fournisseur" =>"WR",
                "numero_client" => "782646880"
            ],
            [
                "numero_compte" => "CB_765830419",
                "fournisseur" =>"CB",
                "numero_client" => "765830419"
            ]

        ];

        Compte::insert($comptes);

    }
}
