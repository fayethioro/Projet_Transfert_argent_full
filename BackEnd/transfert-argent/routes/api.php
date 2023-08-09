<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\CompteController;
use App\Http\Controllers\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::resource('/clients' , ClientController::class)->only("index" , "store");


Route::apiresource('/comptes' , CompteController::class)->only("index", "store");
Route::get('/comptes/bloque/{numeroCompte}' , [CompteController::class , "bloqueCompte"]);
Route::get('/comptes/debloque/{numeroCompte}' , [CompteController::class , "debloqueCompte"]);
Route::get('/comptes/id/{numero}' , [CompteController::class , "getIdByNumeroCompte"]);
Route::delete('/comptes/fermer/{numeroCompte}' , [CompteController::class , "destoy"]);
Route::post('/comptes/restaure/{numeroCompte}' , [CompteController::class , "restore"]);




Route::post('/transactions' , [TransactionController::class , "traiterTransfertArgent"]);
// Route::post('/transactions/retraitCode' , [TransactionController::class , "verifierRetraitAvecCode"]);
Route::get('/transactions' , [TransactionController::class , "afficheTransaction"]);
Route::get('/transactions/client/{numeroClient}' , [TransactionController::class , "listeTransactionClient"]);
Route::get('/transactions/client/{numeroClient}/trie/{critere}' , [TransactionController::class , "listeTransactionClientParFiltre"]);
Route::get('/transactions/client/{numeroClient}/critre/{critere}/filtre/{valeur}' , [TransactionController::class , "listeTransactionClientParTrie"]);
Route::get('/transactions/annuler/{numeroClient}' , [TransactionController::class , "annulerDerniereTransaction"]);

Route::get('/clients/nomComplet/{numero}' , [TransactionController::class , "afficheNomComplet"]);
Route::get('/clients/fournisseur/{numero}' , [TransactionController::class , "nomFournisseur"]);
Route::get('/clients/compte/{numero}' , [TransactionController::class , "rechercherParCompte"]);



