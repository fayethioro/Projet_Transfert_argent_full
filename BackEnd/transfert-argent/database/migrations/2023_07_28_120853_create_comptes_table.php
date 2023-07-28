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
        Schema::create('comptes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string("numero_compte")->unique();
            $table->enum("fournisseur" , ["OM", "WV" , "WR" , "CB"]);
            $table->integer("solde")->default(0);
            $table->foreignIdFor(Client::class)->constrained();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comptes');
    }
};
