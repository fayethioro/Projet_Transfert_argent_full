<?php

namespace App\Http\Controllers;

use App\Models\Compte;
use Illuminate\Http\Request;
use App\Http\Resources\CompteResource;
use App\Http\Requests\StoreCompteRequest;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class CompteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return [
            "statutCode" => Response::HTTP_OK,
            "message" => "liste des comptes crées",
            "comptes" => CompteResource::collection(Compte::all())
        ];
    }

    public function store(StoreCompteRequest $request)
    {

        $fournisseur = $request->fournisseur;
        $numeroClient = $request->numero_client;
        /**
         * $numero = [] ;
         * array_push($numero, $fournisseur , $numeroClient);
         * $numeroCompte = implode("_", $numero)
         */
        $numeroCompte = $fournisseur . '_' . $numeroClient;

        $validator = Validator::make($request->all(), $request->rules(), $request->messages());

        $existingCompte = Compte::where('numero_compte', $numeroCompte)->first();

        if ($existingCompte) {
            return [
                'statusCode' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'message' => 'Ce client possede deja un compte chez ce fournisseur',
            ];
        }

        if ($validator->fails()) {
            return [
                'statusCode' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'errors' => $validator->errors(),
            ];
        }
        $compte = Compte::create([
            "numero_compte" => $numeroCompte,
            "fournisseur" => $fournisseur,
            "numero_client" => $numeroClient
        ]);

        return [
            'statusCode' => Response::HTTP_CREATED,
            'comptes' => $compte,
        ];
    }


    public function bloqueCompte($numeroCompte)
    {
        try {
            $compte = Compte::where('numero_compte', $numeroCompte)->first();
            if ($compte) {
                $compte->etat = 0;
                $compte->save();

                return [
                    'statusCode' => Response::HTTP_OK,
                    'message' => 'Le compte a été bloqué avec succes',
                    'bloque'   => $compte,
                ];
            }
        } catch (\Exception $e) {
            return [
                'statusCode' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'Erreur lors du blocage',
                'error' => $e->getMessage()
            ];
        }
    }

    public function debloqueCompte($numeroCompte)
    {
        try {
            $compte = Compte::where('numero_compte', $numeroCompte)->first();
            if ($compte) {
                $compte->etat = 1;
                $compte->save();

                return [
                    'statusCode' => Response::HTTP_OK,
                    'message' => 'Le compte a été débloqué avec succes',
                    'data'   => $compte,
                ];
            }
        } catch (\Exception $e) {
            return [
                'statusCode' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'message' => 'Erreur lors du déblocage',
                'error' => $e->getMessage()
            ];
        }
    }

    public function getIdByNumeroCompte($numero)
    {
        $numeroClient = $numero;

        $id = Compte::where('numero_compte', $numeroClient)->first();
        if ($id) {
            return ["id" =>$id->id];
        }
        return ["error" =>"le numero n'existe pas"];
    }

    public function destoy($numeroCompte)
    {
        $compte = Compte::where('numero_compte', $numeroCompte)->first();

        if ($compte) {

            $compte->delete();
            return [
                'statusCode' => Response::HTTP_NO_CONTENT,
                'message' => 'suppression reussi',
                'data'   => $compte
            ];
        } else {
            return [
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => "ce compte n'existe pas",
                'data'   => $compte
            ];
        }
    }

    public function restore($numeroCompte)
    {
        $compte = Compte::withTrashed()->where('numero_compte', $numeroCompte)->first();
        
        if ($compte) {

            $compte->restore();
            return [
                'statusCode' => Response::HTTP_NO_CONTENT,
                'message' => 'restauration reussi',
                'data'   => $compte
            ];
        } else {
            return [
                'statusCode' => Response::HTTP_NOT_FOUND,
                'message' => "ce compte n'existe pas",
                'data'   => $compte
            ];
        }
    }
}
