import { 
    info,
    modalTransaction,
    modalFerme,
    formExpedCompte,
    formFournisseur,
    formDestCompte,
    formTransaction,
    prevButton,
    nextButton,
    dest,
    optionTransfertImmediat,
    transactionForm,
  } from './dom.js';

import {
    gererNomExpediteur,
    gererNomDestinataire,
    ajouterTransaction,
    afficherTransactions,
}from './fonction.js'

let pageCourant = 1;

formExpedCompte?.addEventListener('input', gererNomExpediteur);
formDestCompte?.addEventListener('input', gererNomDestinataire);
transactionForm?.addEventListener('submit', ajouterTransaction);
info.addEventListener('click' , ()=>modalTransaction.style.display = "block");
window.addEventListener('load', () =>afficherTransactions()); 
modalFerme.addEventListener('click' , ()=>modalTransaction.style.display = "none");

prevButton?.addEventListener('click', () => {
    if (pageCourant > 1) {
      pageCourant--;
      afficherTransactions();
    }
  });
  
  nextButton?.addEventListener('click', () => {
    if (pageCourant < 100) {
      pageCourant++;
      afficherTransactions();
    }
  });

  formTransaction?.addEventListener('change' ,()=>{
     if(+formTransaction.value !== 2)
     {
        dest.style.display = "block";
     }
  });

  formFournisseur?.addEventListener('change', () => {

    const selectedFournisseur = formFournisseur.value;

    if (selectedFournisseur === 'CB') {
      optionTransfertImmediat.style.display = 'block';
    }
     else {
      optionTransfertImmediat.style.display = 'none'; 
    }
  });



 


  
    

  
  





  


