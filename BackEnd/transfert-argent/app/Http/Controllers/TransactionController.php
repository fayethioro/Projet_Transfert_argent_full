<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Compte;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{

    /**
     * Méthode pour traiter le dépôt
     */
    public function traiterTransfertArgent(Request $request)
    {
        $typeTransfert = $request->type_transaction;
        $montant = $request->montant;
        $numeroExpediteur = $request->expediteur;
        $numeroDestinataire = $request->destinataire;

        $destinataireCompte = Compte::where('numero_client', $numeroDestinataire)->get()->first();

        if ($destinataireCompte) {
            $validationMontant = $this->validerMontantDepot($destinataireCompte, $montant);
            if ($validationMontant) {
                return $validationMontant;
            }
        }
        if ($montant < 1000) {
            return "Le montant de depot pour Wari doit est etre comprise entre 1000 et 1.000.000";
        }
        if ($typeTransfert === 1) {
            return $this->traiterDepot($typeTransfert, $numeroExpediteur, $numeroDestinataire, $montant);
        }
        if ($typeTransfert === 3) {

            return $this->traiterTransfertPermanent($typeTransfert, $numeroExpediteur, $numeroDestinataire, $montant);
        }
    }
    /**
     * valider Montant
     */
    private function validerMontantDepot($destinataireCompte, $montant)
    {
        if ((($destinataireCompte->fournisseur === "OM") || ($destinataireCompte->fournisseur === "WV"))
            && ($montant < 500 || $montant > 1000000)
        ) {
            return "Le montant de dépôt pour Orange Money ou Wave doit être compris entre 500 et 1.000.000";
        }
        if ($destinataireCompte->fournisseur === "WR" && ($montant < 1000 || $montant > 1000000)) {
            return "Le montant de dépôt pour Wari doit être compris entre 1000 et 1.000.000";
        }
        if ($destinataireCompte->fournisseur === "CB" && $montant < 10000) {
            return "Le montant de dépôt pour les comptes Bancaire doit être supérieur à 10000";
        }

        return null; // Aucune erreur de montant de dépôt
    }
    /**
     * verifie si le client a un compte
     */
    private function clientPossedeCompte($numeroClient)
    {
        return Compte::where('numero_client', $numeroClient)->get()->first() !== null;
    }
    /**
     * verifie si le numero  client est valide
     */
    private function estClient($clientId)
    {
        return Client::find($clientId) !== null;
    }
    /**
     * generer code
     */
    public  function  genererCode($nombreChiffres)
    {
        $min = intval('1' . str_repeat('0', $nombreChiffres - 1));
        $max = intval(str_repeat('9', $nombreChiffres));
        $nombreAleatoire = mt_rand($min, $max);
        return (string)$nombreAleatoire;
    }
    /**
     * traiter depot
     */
    private function traiterDepot($typeTransfert, $numeroExpediteur, $numeroDestinataire, $montant)
    {
        if ($this->estClient($numeroExpediteur)) {

            $destinataireCompte = Compte::where('numero_client', $numeroDestinataire)->get()->first();

            $transactionData = [
                'type_transaction' => $typeTransfert,
                'montant' => $montant,
                'date_transaction' => now(),
                'numero_expediteur' => $numeroExpediteur,
                'numero_destinataire' => $numeroDestinataire,
            ];
            if ($this->clientPossedeCompte($numeroDestinataire)) {
                $transaction = new Transaction($transactionData);
                $transaction->save();

                $destinataireCompte->solde += $montant;
                $destinataireCompte->save();

                return [
                    "message" => "Le dépôt a été effectué avec succès.",
                    "destinataire" => $destinataireCompte,
                    "transaction" => $transaction
                ];
            }
            if ($this->estClient($numeroDestinataire)) {
                $transactionData['code'] = $this->genererCode(15);
                $transaction = new Transaction($transactionData);
                $transaction->save();

                return [
                    "message" => "Le dépôt a été effectué avec succès.",
                    "destinataire" => "le destinataire n'a pas de compte => fournisseur est wari",
                    "transaction" => $transaction
                ];
            }
            return "Le numero du destinataire  n'est pas valide. Le dépôt ne peut pas être effectué.";
        }
        return "Le numero de l'expediteur  ou n'est pas valide. Le dépôt ne peut pas être effectué.";
    }
    /**
     * Traiter les frais pour chaque fournisseur et le solde
     */ private function traiterFraisEtSolde($expediteurCompte, $destinataireCompte, $montant)
    {
        // Calculer les frais en fonction du fournisseur
        if ($destinataireCompte->fournisseur === "OM" || $destinataireCompte->fournisseur === "WV") {
            $frais = $montant * 0.01;
        } elseif ($destinataireCompte->fournisseur === "WR") {
            $frais = $montant * 0.02;
        } elseif ($destinataireCompte->fournisseur === "CB") {
            $frais = $montant * 0.05;
        } else {
            return  "Fournisseur non reconnu.";
        }

        // Vérifier si le solde est suffisant pour le montant et les frais
        if ($expediteurCompte->solde < ($montant + $frais)) {
            return  "Votre solde est insuffisant.";
        }

        // Mettre à jour le solde du compte expéditeur et du compte destinataire
        $expediteurCompte->solde -= ($montant + $frais);
        $expediteurCompte->save();
        $destinataireCompte->solde += $montant;
        $destinataireCompte->save();

        return  $frais;
    }

    /**
     * traiter transfert Permanent sans Code
     */
    private function traiterTransfertPermanent($typeTransfert, $numeroExpediteur, $numeroDestinataire, $montant)
    {
        $destinataireCompte = Compte::where('numero_client', $numeroDestinataire)->first();
        $expediteurCompte = Compte::where('numero_client', $numeroExpediteur)->first();

        if ($this->clientPossedeCompte($numeroExpediteur) && $this->clientPossedeCompte($numeroDestinataire)) {
            if ($destinataireCompte->fournisseur === $expediteurCompte->fournisseur) {
                $transactionData = [
                    'type_transaction' => $typeTransfert,
                    'montant' => $montant,
                    'date_transaction' => now(),
                    'numero_expediteur' => $numeroExpediteur,
                    'numero_destinataire' => $numeroDestinataire,
                ];
                $transaction = new Transaction($transactionData);
                $transaction->save();

                $result = $this->traiterFraisEtSolde($expediteurCompte, $destinataireCompte, $montant);

                if ($result !== "Fournisseur non reconnu." && $result !== "Votre solde est insuffisant.") {
                    return [
                        "message" => "Le transfert a été effectué avec succès.",
                        "expediteur" => $expediteurCompte,
                        "destinataire" => $destinataireCompte,
                        "transaction" => $transaction,
                        "frais" => $result
                    ];
                }
                    return $result;
            }
            return "Les transferts se font qu'entre compte de même fournisseur (Par exemple: CB vers CB).";
        }
        return "Les deux clients doivent posséder un compte.";
    }

}
