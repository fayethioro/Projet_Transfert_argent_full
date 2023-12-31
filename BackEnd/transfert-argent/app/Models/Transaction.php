<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $guarded =
    [
        'id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'created_at',
        'updated_at',
    ];

    public function compteExpediteur()
    {
        return $this->belongsTo(Compte::class, 'compte_expediteur_id');
    }
    public function compteDestinataire()
    {
        return $this->belongsTo(Compte::class, 'compte_destinataire_id');
    }
   
}
