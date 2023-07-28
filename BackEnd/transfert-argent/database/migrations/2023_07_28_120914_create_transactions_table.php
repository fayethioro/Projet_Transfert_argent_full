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
            $table->string('code', 35)->nullable();
            $table->dateTime('date_transaction');
            $table->foreignId('compte_expediteur_id')->nullable()->constrained('comptes');
            $table->foreignId('compte_destinataire_id')->nullable()->constrained('comptes');
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
