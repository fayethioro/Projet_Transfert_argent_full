<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransactionResource;
use App\Models\Client;
use App\Models\Compte;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;

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
        $codeSaisie = $request->codeSaisie;

        $destinataireCompte = Compte::where('numero_client', $numeroDestinataire)->get()->first();

        if ($typeTransfert === 2) {

            return $this->traiterRetrait($typeTransfert, $numeroExpediteur, $montant);
        }
        if ($typeTransfert === 7) {

            return $this->verifierRetraitAvecCode($typeTransfert , $codeSaisie , $numeroExpediteur, $montant);
        }
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
        if ($typeTransfert === 4) {

            return $this->traiterTransfertAvecCode($typeTransfert, $numeroExpediteur, $numeroDestinataire, $montant);
        }
        if ($typeTransfert === 5) {

            return $this->traiterTransfertImmediat($typeTransfert, $numeroExpediteur, $numeroDestinataire, $montant);
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
            return ["error" => "Le montant de dépôt pour Orange Money ou Wave doit être compris entre 500 et 1.000.000"];
        }
        if ($destinataireCompte->fournisseur === "WR" && ($montant < 1000 || $montant > 1000000)) {
            return ["error" => "Le montant de dépôt pour Wari doit être compris entre 1000 et 1.000.000"];
        }
        if ($destinataireCompte->fournisseur === "CB" && $montant < 10000) {
            return ["error" => "Le montant de dépôt pour les comptes Bancaire doit être supérieur à 10000"];
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
    public function afficheNomComplet($numero)
    {
        $numeroClient = $numero;

        if ($this->estClient($numeroClient)) {
            $client = Client::where('numero', $numeroClient)->get()->first();
            if (!$this->clientPossedeCompte($numeroClient)) {
                return [
                    "message" => "Client ne possede pas de compte on peut faire que de dépot ou de retrait avec code",
                    "NomComplet" => "{$client->prenom} {$client->nom} "
                ];
            }
            return [
                "message" => "",
                "NomComplet" => "{$client->prenom} {$client->nom} "
            ];
        }
        return [
            "message" => "le numero n'existe pas",
            "error" => "le numero n'existe pas"
        ];
    }

    public function rechercherParCompte($numero)
    {
        $numeroCompte = $numero;
        $compte = Compte::where('numero_compte', $numeroCompte)->get()->first();
        if ($compte) {
            $numeroClient = $compte->numero_client;
            $client = Client::where('numero', $numeroClient)->get()->first();
            return [
                "NomComplet" => "{$client->prenom} {$client->nom} "
            ];
        }
        return ["error" => "le numero de compte n'existe pas"];
    }

    public function nomFournisseur($numero)
    {
        $numeroClient = $numero;

        $fournisseur = Compte::where('numero_client', $numeroClient)
            ->orWhere('numero_compte', $numeroClient)
            ->first();
        if ($fournisseur) {
            return ["fournisseur" => $fournisseur->fournisseur];
        }
        if ($this->estClient($numeroClient)) {
            return ["fournisseur" => "WR"];
        }
        return ["error" => "le numero n'existe pas"];
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

    private function traiterRetrait($typeTransfert, $numeroExpediteur, $montant)
    {
        $expediteurCompte = Compte::where('numero_client', $numeroExpediteur)->get()->first();

        if ($expediteurCompte && $expediteurCompte->etat !== 0) {
            if ($expediteurCompte->solde < $montant) {
                return  ["error" => "Votre solde est insuffisant. Vous ne pouvez pas faire de retrait"];
            }
            $transactionData = [
                'type_transaction' => $typeTransfert,
                'montant' => $montant,
                'date_transaction' => now(),
                'numero_expediteur' => $numeroExpediteur,
                'numero_destinataire' => null,
            ];
            $transaction = new Transaction($transactionData);
            $transaction->etat_transaction = 2;
            $transaction->save();

            $expediteurCompte->solde -= $montant;
            $expediteurCompte->save();

            return [
                "message" => "Le retrait a été effectué avec succès.",
                "client" => $expediteurCompte,
                "transaction" => $transaction
            ];
        }
        return ["retraitError" => "le client doit avoir un compte ou son compte est peut etre bloques"];
    }
    /**
     * Traiter les frais pour chaque fournisseur et le solde
     */ private function traiterFraisEtSolde($numeroExpediteur, $montant)
    {
        $expediteurCompte = Compte::where('numero_client', $numeroExpediteur)->first();

        if ($expediteurCompte->fournisseur === "OM" || $expediteurCompte->fournisseur === "WV") {
            $frais = $montant * 0.01;
        } elseif ($expediteurCompte->fournisseur === "WR") {
            $frais = $montant * 0.02;
        } elseif ($expediteurCompte->fournisseur === "CB") {
            $frais = $montant * 0.05;
        } else {
            return  "Fournisseur non reconnu.";
        }
        if ($expediteurCompte->solde < ($montant + $frais)) {
            return  ["error" => "Votre solde est insuffisant. Vous ne pouvez faire ni de depot ni de transfert"];
        }

        $expediteurCompte->solde -= ($montant + $frais);
        $expediteurCompte->save();
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
                if ($expediteurCompte->etat === 1) {
                    $transactionData = [
                        'type_transaction' => $typeTransfert,
                        'montant' => $montant,
                        'date_transaction' => now(),
                        'numero_expediteur' => $numeroExpediteur,
                        'numero_destinataire' => $numeroDestinataire,
                    ];
                    $result = $this->traiterFraisEtSolde($expediteurCompte->numero_client, $montant);

                    if (is_numeric($result)) {

                        $transaction = new Transaction($transactionData);
                        $transaction->save();
                        $destinataireCompte->solde += $montant;
                        $destinataireCompte->save();
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
                return ["fournisseurError" => "Le compte est bloque il ne peut faire  que de depot ou transfert entrant"];;
            }
            return ["fournisseurError" => "Les transferts se font qu'entre compte de même fournisseur (Par exemple: CB vers CB)."];
        }
        return "Les deux clients doivent posséder un compte.";
    }

    private function traiterTransfertAvecCode($typeTransfert, $numeroExpediteur, $numeroDestinataire, $montant)
    {
        $expediteurCompte = Compte::where('numero_client', $numeroExpediteur)->first();
        if ($this->clientPossedeCompte($numeroExpediteur) && $this->estClient($numeroDestinataire)) {
            $transactionData = [
                'type_transaction' => $typeTransfert,
                'montant' => $montant,
                'date_transaction' => now(),
                'numero_expediteur' => $numeroExpediteur,
                'numero_destinataire' => $numeroDestinataire,
                'code' => $this->genererCode(25)
            ];

            $result = $this->traiterFraisEtSolde($expediteurCompte->numero_client, $montant);

            if (is_numeric($result)) {

                $transaction = new Transaction($transactionData);
                $transaction->save();
                return [
                    "message" => "Le transfert a été effectué avec succès.",
                    "expediteur" => $expediteurCompte,
                    "transaction" => $transaction,
                    "frais" => $result
                ];
            }
            return $result;
        }
        return ["fournisseurError" => "L'expediteur doit posséder un compte et le le numero du destinataire doit etre valide"];
    }


    private function traiterTransfertImmediat($typeTransfert, $numeroExpediteur, $numeroDestinataire, $montant)
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
                    'code' => $this->genererCode(30)
                ];

                $result = $this->traiterFraisEtSolde($expediteurCompte->numero_client, $montant);

                if (is_numeric($result)) {
                    $transaction = new Transaction($transactionData);
                    $transaction->save();
                    $destinataireCompte->solde += $montant;
                    $destinataireCompte->save();
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
            return ["fournisseurError" => "Les transferts se font qu'entre compte de même fournisseur (Par exemple: CB vers CB)."];
        }
        return "Les deux clients doivent posséder un compte.";
    }

    public function afficheTransaction()
    {

        $transactions = Transaction::all();
        $transactions = $transactions->sortByDesc('date_transaction');

        return ["transaction" => TransactionResource::collection($transactions)];
    }


    public function listeTransactionClient($numeroClient)
    {

        $transactionsExpediteur = Transaction::where("numero_expediteur", $numeroClient)->get();
        $transactionsDestinataire = Transaction::where("numero_destinataire", $numeroClient)->get();

        $transactions = $transactionsExpediteur->merge($transactionsDestinataire);

        return [
            "statutCode" => Response::HTTP_OK,
            "message" => "listes des transaction d'un client",
            "transactionsclients" => TransactionResource::collection($transactions)
        ];
    }


    public function listeTransactionClientParTrie($numeroClient, $critere)
    {

        $transactionsExpediteur = Transaction::where("numero_expediteur", $numeroClient)->get();
        $transactionsDestinataire = Transaction::where("numero_destinataire", $numeroClient)->get();

        $transactions = $transactionsExpediteur->merge($transactionsDestinataire);

        switch ($critere) {
            case 'date_transaction':
                $transactions = $transactions->sortBy('date_transaction');
                break;
            case 'numero_destinataire':
                $transactions = $transactions->sortBy('numero_destinataire');
                break;
            case 'montant':
                $transactions = $transactions->sortBy('montant');
                break;
            default:
                // Par défaut, trier par date_transaction de manière décroissante
                $transactions = $transactions->sortByDesc('date_transaction');
        }

        return [
            "statutCode" => Response::HTTP_OK,
            "message" => "Liste des transactions d'un client",
            "transactions" => TransactionResource::collection($transactions)
        ];
    }



    public function annulerDerniereTransaction($numeroClient)
    {
        $derniereTransaction = Transaction::where('numero_expediteur', $numeroClient)
            ->orderByDesc('date_transaction')
            ->first();

        if (!$derniereTransaction ) {
            return [
                "error" => "Seule la dernière transaction du client peut être annulée.",
                "transaction" => ""
            ];
        }


        if ($derniereTransaction->type_transaction === "2" || $derniereTransaction->etat_transaction != "1" ) {
            return [
                "error" => "Seules les transactions de dépôt ou de transfert peuvent être annulées",
                "transaction" => ""

            ];
        }

        $dateDerniereTransaction = Carbon::parse($derniereTransaction->date_transaction);
        $maintenant = Carbon::now();

        if ($dateDerniereTransaction->diffInDays($maintenant) > 0 ) {
            return [
                "error" => "La dernière transaction ne peut plus être annulée car elle a plus d'un jour",
                "transaction" => ""

            ];
        }

        if($derniereTransaction->type_transaction === "1")
        {
            $derniereTransaction->etat_transaction = "3";
            $derniereTransaction->type_transaction = "6";
            $derniereTransaction->save();

            return [
                "message" => "La dernière transaction a été annulée avec succès",
                "transaction" => ""
            ];
        }

        $expediteurCompte = Compte::where('numero_client', $derniereTransaction->numero_expediteur)->first();
        $destinataireCompte = Compte::where('numero_client', $derniereTransaction->numero_destinataire)->first();

        $derniereTransaction->etat_transaction = "3";
        $derniereTransaction->type_transaction = "6";

        $expediteurCompte->solde =$expediteurCompte->solde + $derniereTransaction->montant;
        $destinataireCompte->solde = $destinataireCompte->solde - $derniereTransaction->montant;
        $derniereTransaction->save();
        $expediteurCompte->save();
        $destinataireCompte->save();


        return [
            "message" => "La dernière transaction a été annulée avec succès",
            "transaction" => $derniereTransaction,
            "destinataire" =>$destinataireCompte,
            "expediteur" =>$expediteurCompte
        ] ;
    }



public function verifierRetraitAvecCode($typeTransfert , $codeSaisi , $numeroExpediteur, $montant)
{

    $transaction = Transaction::where('code', $codeSaisi)
                                ->where('numero_expediteur', $numeroExpediteur,)
                                ->first();
    if (!$transaction) {
        return ['retraitError' => 'Code ou numero invalide.'];
    }

    if ($transaction->etat_transaction === "2") {
        return ['retraitError' => 'Cette transaction a déjà été retirée.'];
    }
    if ($transaction->montant !==  $montant) {
        return ['error' => 'Le montant est incorrect'];
    }
    $transaction->etat_transaction = '2';
    $transaction->type_transaction = $typeTransfert;
    $transaction->save();


    return [
        'message' => 'Retrait effectué avec succès.',
           "transaction" => $transaction
            ];
}

}
