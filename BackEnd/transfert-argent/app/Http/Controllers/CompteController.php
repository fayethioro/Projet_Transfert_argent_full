<?php

namespace App\Http\Controllers;

use App\Models\Compte;
use Illuminate\Http\Request;

class CompteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Compte::all();
    }

    public function recupereLesFournisseurs()
    {
        $compte = Compte::all();

        // $fourni = $compte->fournisseur;

        return $compte;
    }


}
