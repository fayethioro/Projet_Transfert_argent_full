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
    annuler,
    validerForm,
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

  formTransaction?.addEventListener('change' ,()=>{
    if(+formTransaction.value === 7)
    {
       annuler.style.display = "block";
       dest.style.display = "none";

    }
 });
 if (formFournisseur.value === "") {
  formTransaction.disabled = true;
  validerForm.disabled = true;
 }
  formFournisseur?.addEventListener('change', (event)  => {
       formTransaction.disabled = false;
       validerForm.disabled = false;
      const selectedFournisseur = (event.target as HTMLSelectElement).value;
      updateTransactionOptions(selectedFournisseur);
       
      
  });

const transactionsMap: Record<string, string[]> = {
  'OM': ['1', '2', '3', '4', '7'],
  'WV': ['1', '2', '3'],
  'WR': ['1', '7'],
  'CB': ['1', '2', '3', '5']
};

function updateTransactionOptions(selectedFournisseur: string) {
  const transactionOptions = transactionsMap[selectedFournisseur] || [];

  for (let i = 0; i < formTransaction.options.length; i++) {
    const option = formTransaction.options[i] ;
    option.hidden = true;
  }
  transactionOptions.forEach(optionValue => {
    const option = formTransaction.querySelector(`option[value="${optionValue}"]`) as HTMLOptionElement;
    if (option) {
      option.hidden = false;
    }
  });
  formTransaction.value = '';
}




 


  
    

  
  





  


