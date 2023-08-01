var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var formExpedCompte = document.getElementById('form_exped_compte');
var formDestCompte = document.getElementById('form_dest_compte');
var transactionForm = document.getElementById('transactionForm');
var errorMessageElement = document.getElementById('error-message');
var errorFournisseurElement = document.getElementById('error-fournisseur');
var info = document.querySelector('.info');
var modalTransaction = document.querySelector('.modal_transaction');
var modalFerme = document.querySelector('.ferme');
// Fonction pour effectuer la requête AJAX et récupérer le nom complet
function getNomComplet(numero) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("http://127.0.0.1:8000/transfert-api/clients/nomComplet?numero=".concat(numero))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.NomComplet];
            }
        });
    });
}
// Ajouter une fonction pour récupérer le fournisseur en utilisant l'API
function getFournisseur(numero) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("http://127.0.0.1:8000/transfert-api/clients/fournisseur?numero=".concat(numero))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.fournisseur];
            }
        });
    });
}
function getTransactions() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('http://127.0.0.1:8000/transfert-api/transactions')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.transaction];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function handleInputEvent() {
    return __awaiter(this, void 0, void 0, function () {
        var formExpedCompte, formExpediteur, transactionDiv, destinataireDiv, formFournisseur, numero, nomComplet, fournisseur, optionValue, i, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    formExpedCompte = document.getElementById('form_exped_compte');
                    formExpediteur = document.getElementById('form_expediteur');
                    transactionDiv = document.querySelector('.transaction-div');
                    destinataireDiv = document.querySelector('.destinataire-div');
                    formFournisseur = document.getElementById('form_fournisseur');
                    numero = formExpedCompte.value;
                    if (!(numero.length === 9)) return [3 /*break*/, 8];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, getNomComplet(numero)];
                case 2:
                    nomComplet = _a.sent();
                    if (!nomComplet) return [3 /*break*/, 4];
                    formExpediteur.value = nomComplet;
                    return [4 /*yield*/, getFournisseur(numero)];
                case 3:
                    fournisseur = _a.sent();
                    if (transactionDiv && destinataireDiv) {
                        transactionDiv.classList.remove('om', 'wv', 'wr', 'cb');
                        destinataireDiv.classList.remove('om', 'wv', 'wr', 'cb');
                        if (fournisseur) {
                            transactionDiv.classList.add(fournisseur.toLowerCase());
                            destinataireDiv.classList.add(fournisseur.toLowerCase());
                            optionValue = fournisseur.toUpperCase();
                            for (i = 0; i < formFournisseur.options.length; i++) {
                                if (formFournisseur.options[i].value === optionValue) {
                                    formFournisseur.selectedIndex = i;
                                    formFournisseur.style.pointerEvents = "none";
                                    break;
                                }
                            }
                        }
                    }
                    return [3 /*break*/, 5];
                case 4:
                    formExpediteur.value = "Le numero invalide";
                    formExpediteur.style.color = 'red';
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error(error_2);
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 9];
                case 8:
                    // Réinitialiser le champ "form_expediteur" si le numéro n'a pas 9 chiffres
                    formExpediteur.value = '';
                    _a.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
}
function afficherNomComplet() {
    return __awaiter(this, void 0, void 0, function () {
        var formDestCompte, formDestinataire, numero, nomComplet, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    formDestCompte = document.getElementById('form_dest_compte');
                    formDestinataire = document.getElementById('form_destinataire');
                    numero = formDestCompte.value;
                    if (!(numero.length === 9)) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getNomComplet(numero)];
                case 2:
                    nomComplet = _a.sent();
                    if (nomComplet) {
                        formDestinataire.value = nomComplet;
                    }
                    else {
                        formDestinataire.value = "Le numero invalide";
                        formDestinataire.style.color = 'red';
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error(error_3);
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    formDestinataire.value = '';
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
// La fonction pour gérer la soumission du formulaire
function handleSubmitEvent(event) {
    return __awaiter(this, void 0, void 0, function () {
        var formExpedCompte, formMontant, formTransaction, formDestCompte, numeroExpediteur, montant, typeTransfert, numeroDestinataire, response, data, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    formExpedCompte = document.getElementById('form_exped_compte');
                    formMontant = document.getElementById('form_montant');
                    formTransaction = document.getElementById('form_transaction');
                    formDestCompte = document.getElementById('form_dest_compte');
                    numeroExpediteur = formExpedCompte.value;
                    montant = +formMontant.value;
                    typeTransfert = +formTransaction.value;
                    numeroDestinataire = formDestCompte.value;
                    console.log(numeroExpediteur);
                    console.log(montant);
                    console.log(typeTransfert);
                    console.log(numeroDestinataire);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('http://127.0.0.1:8000/transfert-api/transactions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({
                                type_transaction: typeTransfert,
                                montant: montant,
                                expediteur: numeroExpediteur,
                                destinataire: numeroDestinataire
                            })
                        })];
                case 2:
                    response = _a.sent();
                    // console.log(JSON.stringify({
                    //     type_transaction: typeTransfert,
                    //     montant: montant,
                    //     expediteur: numeroExpediteur,
                    //     destinataire: numeroDestinataire
                    // }));
                    // console.log(response);
                    if (!response.ok) {
                        throw new Error('La requête a échoué.');
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (data.error) {
                        errorMessageElement.style.display = "block";
                        errorMessageElement.textContent = data.error;
                    }
                    else if (data.fournisseurError) {
                        errorFournisseurElement.style.display = "block";
                        errorFournisseurElement.textContent = data.fournisseurError;
                    }
                    else {
                        errorMessageElement.style.display = "none";
                        alert("succes");
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    console.error('Erreur lors de la transaction :', error_4);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function afficherTransactions() {
    return __awaiter(this, void 0, void 0, function () {
        var transactionsDiv, transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transactionsDiv = document.getElementById('list_transactions');
                    transactionsDiv.innerHTML = '';
                    return [4 /*yield*/, getTransactions()];
                case 1:
                    transactions = _a.sent();
                    console.log(transactions);
                    if (transactions.length == 0) {
                        transactionsDiv.innerHTML = "<h3 class=\"text-danger\" >Aucun transaction</h3>";
                    }
                    else {
                        transactions.forEach(function (transaction) {
                            var transactionDiv = document.createElement('div');
                            transactionDiv.innerHTML = "\n              <hr>\n              <h3 class:\"tittle\">".concat(transaction.type_transaction, "</h3>\n              <div class=\"transaction_expediteur\">numero expediteur:<span class=\"mon_tran\">").concat(transaction.numero_expediteur, "</span></div>\n              <div class=\"transaction_destinataire\">numero destinataire:<span class=\"mon_tran\">").concat(transaction.numero_destinataire, "</span></div>\n              <div class=\"date\">Date :<span class=\"mon_tran\">").concat(transaction.date_transaction, "</span></div>\n              <div class=\"montant_tr\">montant :<span class=\"mon_tran\">").concat(transaction.date_transaction, "</span></div>\n            ");
                            transactionsDiv.appendChild(transactionDiv);
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
if (formExpedCompte) {
    formExpedCompte.addEventListener('input', handleInputEvent);
}
if (formDestCompte) {
    formDestCompte.addEventListener('input', afficherNomComplet);
}
if (transactionForm) {
    transactionForm.addEventListener('submit', handleSubmitEvent);
}
info.addEventListener('click', function () {
    modalTransaction.style.display = "block";
    afficherTransactions();
});
modalFerme.addEventListener('click', function () {
    modalTransaction.style.display = "none";
});
