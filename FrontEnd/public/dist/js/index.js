import { info, modalTransaction, modalFerme, formExpedCompte, formFournisseur, formDestCompte, formTransaction, prevButton, nextButton, dest, transactionForm, annuler, validerForm, } from './dom.js';
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
if (formFournisseur.value === "") {
    formTransaction.disabled = true;
    validerForm.disabled = true;
}
formFournisseur === null || formFournisseur === void 0 ? void 0 : formFournisseur.addEventListener('change', (event) => {
    formTransaction.disabled = false;
    validerForm.disabled = false;
    const selectedFournisseur = event.target.value;
    updateTransactionOptions(selectedFournisseur);
});
const transactionsMap = {
    'OM': ['1', '2', '3', '4', '7'],
    'WV': ['1', '2', '3'],
    'WR': ['1', '7'],
    'CB': ['1', '2', '3', '5']
};
function updateTransactionOptions(selectedFournisseur) {
    const transactionOptions = transactionsMap[selectedFournisseur] || [];
    for (let i = 0; i < formTransaction.options.length; i++) {
        const option = formTransaction.options[i];
        option.hidden = true;
    }
    transactionOptions.forEach(optionValue => {
        const option = formTransaction.querySelector(`option[value="${optionValue}"]`);
        if (option) {
            option.hidden = false;
        }
    });
    formTransaction.value = '';
}
