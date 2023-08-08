import { afficherClientsParTrie, ajouterClient } from './fonction.js';
import { ajouter, } from './dom.js';
let pageCourant = 1;
window.addEventListener('load', () => afficherClientsParTrie());
ajouter === null || ajouter === void 0 ? void 0 : ajouter.addEventListener('click', ajouterClient);
