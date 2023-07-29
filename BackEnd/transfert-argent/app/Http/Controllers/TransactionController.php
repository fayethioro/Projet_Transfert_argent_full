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
      * Méthode pour traiter le dépôt
      */
    public function traiterDepot(Request $request)
    {
        $montant = $request->montant;
        $compteExpediteurId = $request->compte_expediteur_id;
        $compteDestinataireId = $request->compte_destinataire_id;

        // Effectuer des vérifications (par exemple, montant > minimum, etc.)

        if ($this->clientPossedeCompte($compteExpediteurId)) {
            return $this->traiterDepotExpediteurAvecCompte($compteExpediteurId, $compteDestinataireId, $montant);
        } else {
            return $this->traiterDepotExpediteurSansCompte($compteExpediteurId, $compteDestinataireId, $montant);
        }
    }
    /**
     * verifie si l'expediteur a un compte
     */

    private function clientPossedeCompte($compteClientId)
    {
        return Compte::find($compteClientId) !== null;
    }
    /**
     * verifie si le numero  client est valide
     */
    private function estClient($clientId)
    {
        return Client::find($clientId) !== null;
    }
    /**
     *  traiter destinataire possedant un compte => client
     */
    private function traiterDepotExpediteurAvecCompte($compteExpediteurId, $compteDestinataireId, $montant)
    {

        $destinataireCompte = Compte::find($compteDestinataireId);

        if ($destinataireCompte) {

            $transaction = new Transaction([
                'type_transaction' => 'DEPOT',
                'montant' => $montant,
                'date_transaction' => now(),
                'compte_expediteur_id' => $compteExpediteurId,
                'compte_destinataire_id' => $compteDestinataireId,
            ]);
            $transaction->save();

            $destinataireCompte->solde += $montant;
            $destinataireCompte->save();
            return [
                "message" => "Le dépôt a été effectué avec succès.",
                "destinataire" => $destinataireCompte,
                "transaction" => $transaction
            ];
        }

        return "Le destinataire n'a pas de compte. Le dépôt ne peut pas être effectué.";
    }

    /**
     * Summary of traiterDepotExpediteurSansCompte
     * @param mixed $compteExpediteurId
     * @param mixed $compteDestinataireId
     * @param mixed $montant
     * @return string
     * expediteur n'a pas compte
     */
    private function traiterDepotExpediteurSansCompte($compteExpediteurId, $compteDestinataireId, $montant)
    {
       if ($this->estClient($compteExpediteurId)) {

        $destinataireCompte = Compte::find($compteDestinataireId);

        $transaction = new Transaction([
            'type_transaction' => 'DEPOT',
            'montant' => $montant,
            'date_transaction' => now()
        ]);

        if ($compteExpediteurId) {
            $transaction->compte_expediteur_id = null;
        }
        $transaction->save();

        $destinataireCompte->solde += $montant;
            $destinataireCompte->save();
            return [
                "message" => "Le dépôt a été effectué avec succès.",
                "destinataire" => $destinataireCompte,
                "transaction" => $transaction
            ];

       }
       return "Le numero n'est pas valide. Le dépôt ne peut pas être effectué.";
    }

}
