<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Models\Client;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return [
            "statutCode" => Response::HTTP_OK,
            "message" => "Listes des clients",
            "clients" => Client::all()
        ];
    }

    public function store(StoreClientRequest $request){

    $validator = Validator::make($request->all(), $request->rules(), $request->messages());

    if ($validator->fails()) {
        return [
            'statusCode' => Response::HTTP_UNPROCESSABLE_ENTITY,
            'errors' => $validator->errors(),
        ];
    }

    $client = Client::create($request->validated());

    return [
        "statusCode" => Response::HTTP_CREATED,
        "message" => "Client ajouté avec succès",
        "client" => $client,
    ];
    }



}
