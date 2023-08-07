<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
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
              "numero" => "required|unique:clients|regex:/^(7[76508]{1})(\\d{7})$/",
              "nom" => "required|string",
              "prenom" => "required|string",
              "email" => "required|email|regex:/^[a-z][a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/|unique:clients",


        ];
    }
    public function messages():array
    {
        return [
            "numero.required" => "Le numéro de téléphone est obligatoire !",
            "numero.regex" => "Le format du  numéro doit etre 7(7/8/0/5/6)xxxxx !",
            "numero.unique" => "Le numéro de téléphone doit être unique !",
           "prenom.required" =>  "Le nom est obligatoire",
           "prenom.string" =>  "Le nom doit etre un chaine de caractere",
           "nom.required" =>  "Le nom est obligatoire",
           "nom.string" =>  "Le nom doit etre un chaine de caractere",
           "email.required" => "l'email est obligatoire",
           "email.email" => "L'email doit etre valide",
           "email.unique" => "Ce email existe dejas",
           "email.regex"=> "L'email doit etre sous le format exemple@aaa.fg",
        ];
    }
}
