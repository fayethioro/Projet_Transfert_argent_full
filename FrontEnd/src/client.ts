import {
    afficherClients,
    ajouterClient
}from './fonction.js'

import { 
    precButton,
    suivButton,
    ajouter,
   
  } from './dom.js';
  let pageCourant = 1;

window.addEventListener('load', () =>afficherClients()); 

precButton?.addEventListener('click', () => {
    if (pageCourant > 1) {
      pageCourant--;
      afficherClients();
    }
  });
  
  suivButton?.addEventListener('click', () => {
    if (pageCourant < 100) {
      pageCourant++;
      afficherClients();
    }
  });

ajouter?.addEventListener('click', ajouterClient);



