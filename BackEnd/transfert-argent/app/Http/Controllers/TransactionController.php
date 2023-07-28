<?php

namespace App\Http\Controllers;

use App\Models\Compte;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{

    /**
     *
     */
    public function moneyDeposit(Request $request)
    {
         $destinataire = Compte::findOrFail($request->compte_expediteur_id);

         if ($destinataire) {
           return  $request->compte_expediteur_id;
         }
         else {
            echo "n'a pas de compte";
         }
    }
}
