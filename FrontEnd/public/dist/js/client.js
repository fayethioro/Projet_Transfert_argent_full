import { afficherClients, ajouterClient } from './fonction.js';
import { precButton, suivButton, ajouter, } from './dom.js';
let pageCourant = 1;
window.addEventListener('load', () => afficherClients());
precButton === null || precButton === void 0 ? void 0 : precButton.addEventListener('click', () => {
    if (pageCourant > 1) {
        pageCourant--;
        afficherClients();
    }
});
suivButton === null || suivButton === void 0 ? void 0 : suivButton.addEventListener('click', () => {
    if (pageCourant < 100) {
        pageCourant++;
        afficherClients();
    }
});
ajouter === null || ajouter === void 0 ? void 0 : ajouter.addEventListener('click', ajouterClient);
