<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Compte;
use App\Models\Transaction;
use Carbon\Traits\Date;
use Illuminate\Http\Request;

class TransactionController extends Controller
{

    /**
     *
     */
    public function moneyDeposit(Request $request)
    {
        $expediteurClient = Client::find($request->compte_expediteur_id);

        if ($expediteurClient) {

            $destinataireCompte = Compte::find($request->compte_destinataire_id);
            
            if ($destinataireCompte) {

                $transaction = Transaction::create([
                    "type_transcation" => $request->type_transaction,
                    "montant" => $request->montant,
                    "date_transaction" => $request->date_transaction,
                    "compte_expediteur_id" => $request->compte_expediteur_id,
                    "compte_destinataire_id" => $request->compte_destinataire_id
                ]);

                $destinataireCompte->solde += $request->montant;
                $destinataireCompte->save();

                return   [
                    "transaction" => $transaction,
                    "destinataire" => $destinataireCompte
                ];
            }
            return "ce numero n'a pas de compte";
        }
        return "vous ne pouvez pas faire de depot";
    }
}
