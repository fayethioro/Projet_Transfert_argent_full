<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->enum('type_transaction',[ "DEPOT" , "RETRAIT" , "TRANSFERT"]);
            $table->integer('montant');
            $table->string('code', 30)->nullable();
            $table->dateTime('date_transaction');
            $table->foreignId('compte_expediteur_id')->constrained('comptes');
            $table->foreignId('compte_destinataire_id')->constrained('comptes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
