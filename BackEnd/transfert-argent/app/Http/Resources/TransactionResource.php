<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray($request)
    {
        $code = $this->code ? $this->code : "pas de code";
        return [
            'id' => $this->id,
            'type_transaction' => $this->getTypeTransactionLabel($this->type_transaction),
            'montant' => $this->montant,
            'code' => $code,
            'date_transaction' => $this->date_transaction,
            'numero_expediteur' => $this->numero_expediteur,
            'numero_destinataire' => $this->numero_destinataire,
        ];
    }

    private function getTypeTransactionLabel($type)
    {
        $types = [
            1 => 'DEPOT',
            2 => 'RETRAIT',
            3 => 'TRANSFERT',
            4 => 'TRANSFERT AVEC CODE',
            5 => 'TRANSFERT IMMEDIAT',
        ];

        return $types[$type] ?? 'Inconnu';
    }
}
