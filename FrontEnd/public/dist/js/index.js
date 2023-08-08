import { info, modalTransaction, modalFerme, formExpedCompte, formFournisseur, formDestCompte, formTransaction, prevButton, nextButton, dest, optionTransfertImmediat, transactionForm, annuler, } from './dom.js';
import { gererNomExpediteur, gererNomDestinataire, ajouterTransaction, afficherTransactions, } from './fonction.js';
let pageCourant = 1;
formExpedCompte === null || formExpedCompte === void 0 ? void 0 : formExpedCompte.addEventListener('input', gererNomExpediteur);
formDestCompte === null || formDestCompte === void 0 ? void 0 : formDestCompte.addEventListener('input', gererNomDestinataire);
transactionForm === null || transactionForm === void 0 ? void 0 : transactionForm.addEventListener('submit', ajouterTransaction);
info.addEventListener('click', () => modalTransaction.style.display = "block");
window.addEventListener('load', () => afficherTransactions());
modalFerme.addEventListener('click', () => modalTransaction.style.display = "none");
prevButton === null || prevButton === void 0 ? void 0 : prevButton.addEventListener('click', () => {
    if (pageCourant > 1) {
        pageCourant--;
        afficherTransactions();
    }
});
nextButton === null || nextButton === void 0 ? void 0 : nextButton.addEventListener('click', () => {
    if (pageCourant < 100) {
        pageCourant++;
        afficherTransactions();
    }
});
formTransaction === null || formTransaction === void 0 ? void 0 : formTransaction.addEventListener('change', () => {
    if (+formTransaction.value !== 2) {
        dest.style.display = "block";
    }
});
formTransaction === null || formTransaction === void 0 ? void 0 : formTransaction.addEventListener('change', () => {
    if (+formTransaction.value === 7) {
        annuler.style.display = "block";
        dest.style.display = "none";
    }
});
formFournisseur === null || formFournisseur === void 0 ? void 0 : formFournisseur.addEventListener('change', () => {
    const selectedFournisseur = formFournisseur.value;
    if (selectedFournisseur === 'CB') {
        optionTransfertImmediat.style.display = 'block';
    }
    else {
        optionTransfertImmediat.style.display = 'none';
    }
});
