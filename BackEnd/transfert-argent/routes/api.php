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

Route::apiresource('/clients' , ClientController::class)->only("index");

Route::apiresource('/comptes' , CompteController::class)->only("index");

Route::post('/transactions' , [TransactionController::class , "traiterTransfertArgent"]);
Route::get('/transactions' , [TransactionController::class , "afficheTransaction"]);

Route::get('/clients/nomComplet/{numero}' , [TransactionController::class , "afficheNomComplet"]);
Route::get('/clients/fournisseur/{numero}' , [TransactionController::class , "nomFournisseur"]);
Route::get('/clients/compte/{numero}' , [TransactionController::class , "rechercherParCompte"]);



