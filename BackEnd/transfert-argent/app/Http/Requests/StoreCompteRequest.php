<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            "compte_unique" => 'unique:comptes,numero_compte',
            "fournisseur" =>'required|string|in:OM,WV,WR,CB',
            "numero_client" =>'required|exists:clients,numero',
        ];
    }
    public function messages(){
        return[
             "fournisseur.required" => "Le fournisseur est obligatoire",
             "fourniseur.in" => "Le fournisseur doit être l'une des valeurs autorisées : OM, WV, WR, CB.",
             "numero_client.required" => "Le numero du client est obligatoire",
             "numero_client.exists" => "Le numero du client n'est pas valide"
        ];
    }
}
