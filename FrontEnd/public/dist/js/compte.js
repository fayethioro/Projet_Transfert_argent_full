import { afficherComptes, creerCompte } from './fonction.js';
import { creeCompte } from './dom.js';
creeCompte === null || creeCompte === void 0 ? void 0 : creeCompte.addEventListener('click', creerCompte);
window.addEventListener('load', () => afficherComptes());
