<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $etat = $this->etat == 0 ? "compte bloqué" : "compte active";

        return [
            'numero_compte' => $this->numero_compte,
            'fournisseur' => $this->getFournisseurLabel($this->fournisseur),
            'solde' => $this->solde,
            'numero_client' => $this->numero_client,
            'etat' =>$etat
        ];
    }

    private function getFournisseurLabel($type)
    {
        $types = [
            "OM" => 'Orange Money',
            "WV" => 'Wave',
            "WR" => 'Wari',
            "CB" => 'Compte Bancaire',
        ];

        return $types[$type] ?? 'Inconnu';
    }
}
