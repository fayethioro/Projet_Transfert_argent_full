var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function getNomComplet(numero) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://127.0.0.1:8000/transfert-api/clients/nomComplet/${numero}`);
        const data = yield response.json();
        return [data.NomComplet, data.message];
    });
}
export function getNomCompletViaCompte(numero) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://127.0.0.1:8000/transfert-api/clients/compte/${numero}`);
        const data = yield response.json();
        return data.NomComplet;
    });
}
export function getFournisseur(numero) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://127.0.0.1:8000/transfert-api/clients/fournisseur/${numero}`);
        const data = yield response.json();
        return data.fournisseur;
    });
}
export function getTransactions() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://127.0.0.1:8000/transfert-api/transactions`);
            const data = yield response.json();
            return data.transaction;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    });
}
export function getClients() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://127.0.0.1:8000/transfert-api/clients`);
            const data = yield response.json();
            return data.clients;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    });
}
export function getTransactionsClient(numero) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://127.0.0.1:8000/transfert-api/transactions/client/${numero}`);
            console.log(response);
            const data = yield response.json();
            console.log("data", data);
            return data.transactionsclients;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    });
}
export function getComptes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://127.0.0.1:8000/transfert-api/comptes`);
            const data = yield response.json();
            return data.comptes;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    });
}
export function getBloqueCompte(numero) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://127.0.0.1:8000/transfert-api/comptes/bloque/${numero}`);
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error("Erreur lors de la requête fetch :", error);
            throw error;
        }
    });
}
export function getDeBloqueCompte(numero) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://127.0.0.1:8000/transfert-api/comptes/debloque/${numero}`);
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error("Erreur lors de la requête fetch :", error);
            throw error;
        }
    });
}
export function getFermerCompte(numero) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://127.0.0.1:8000/transfert-api/comptes/fermer/${numero}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error("Erreur lors de la requête fetch :", error);
            throw error;
        }
    });
}
