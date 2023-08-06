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
            "numero.required" => "le numéro de téléphone est requis !",
            "numero.regex" => "le format du  numéro doit etre 7(7/8/0/5/6)xxxxx !",
            "numero.unique" => "le numéro de téléphone doit être unique !",
           "prenom.required" =>  "le nom est requis",
           "prenom.string" =>  "le nom doit etre un chaine de caractere",
           "nom.required" =>  "le nom est requis",
           "nom.string" =>  "le nom doit etre un chaine de caractere",
           "email.required" => "l'email est requis",
           "email.email" => "le email doit etre valide",
           "email.unique" => "ce email existe dejas",
           "email.regex"=> "le mail doit etre sous le format exemple@aaa.fg",
        ];
    }
}
