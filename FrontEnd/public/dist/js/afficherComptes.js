var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { precButton, suivButton } from "./dom.js";
import { getComptes, getBloqueCompte } from "./fetch.js";
import { itemsParPageClient, pageCourant } from "./fonction.js";
export function afficherComptes() {
    return __awaiter(this, void 0, void 0, function* () {
        const comptesDiv = document.querySelector(".list_compte");
        comptesDiv.innerHTML = "";
        const comptes = yield getComptes();
        const totalItems = comptes.length;
        console.log(totalItems);
        const totalPages = Math.ceil(totalItems / itemsParPageClient);
        if (comptes.length === 0) {
            comptesDiv.innerHTML = `<h3 class="text-danger">Aucun Client</h3>`;
            precButton.style.display = "none";
            suivButton.style.display = "none";
            return;
        }
        const startIndex = (pageCourant - 1) * itemsParPageClient;
        const endIndex = Math.min(startIndex + itemsParPageClient, totalItems);
        for (let i = startIndex; i < endIndex; i++) {
            const compte = comptes[i];
            const transactionDiv = document.createElement("tr");
            transactionDiv.innerHTML = `
              <td class="compte-numero">${compte.numero_compte}</td>
              <td>${compte.fournisseur}</td>
              <td>${compte.solde} fcfa</td>
              <td>${compte.numero_client}</td>
              <td>${compte.etat}</td>
              <td>
              <a href="#" class="debloque" data-toggle="modal"><i class="fa-solid fa-lock-open" data-toggle="tooltip" title="débloqué" style="color: #008000;"></i></a>
              <a href="#" class="bloque" data-toggle="modal"><i class="fa-solid fa-lock"  data-toggle="tooltip" title="bloqué" style="color: #0000ff;"></i></a>
                <a href="#deleteCompteModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Fermer Compte">&#xE872;</i></a>
              </td>
              `;
            comptesDiv.appendChild(transactionDiv);
            const bloque = transactionDiv.querySelector(".bloque");
            const debloque = transactionDiv.querySelector(".debloque");
            const numeroCompte = compte.numero_compte;
            bloque.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                console.log("Numéro de compte cliqué :", numeroCompte);
                try {
                    const bloqueCompte = yield getBloqueCompte(numeroCompte);
                    console.log(bloqueCompte);
                }
                catch (error) {
                    console.error("Une erreur s'est produite :", error);
                }
            }));
        }
        precButton.disabled = pageCourant === 1;
        suivButton.disabled = pageCourant === totalPages;
    });
}
