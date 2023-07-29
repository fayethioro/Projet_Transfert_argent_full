<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * DEPOT == 1
     * RETRAIT = 2
     * TRANSFERT = 3
     * TRANSFERT AVEC CODE = 4
     * TRANSFERT IMMEDIAT = 5
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->enum('type_transaction',[ 1 , 2 , 3 , 4 , 5]);
            $table->integer('montant');
            $table->string('code', 35)->nullable();
            $table->dateTime('date_transaction');
            $table->string('numero_expediteur')->nullable()->index();
            $table->foreign('numero_expediteur')->references('numero')->on('clients');
            $table->string('numero_destinataire')->nullable()->index();
            $table->foreign('numero_destinataire')->references('numero')->on('clients');
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
