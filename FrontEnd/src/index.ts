
const formExpedCompte = document.getElementById('form_exped_compte');
const formDestCompte = document.getElementById('form_dest_compte');
const transactionForm = document.getElementById('transactionForm');
const errorMessageElement = document.getElementById('error-message') as HTMLElement;
const errorFournisseurElement = document.getElementById('error-fournisseur') as HTMLElement;
const info = document.querySelector('.info') as HTMLElement;
const modalTransaction = document.querySelector('.modal_transaction') as HTMLElement;
const modalFerme = document.querySelector('.ferme') as HTMLElement;



// Fonction pour effectuer la requête AJAX et récupérer le nom complet
async function getNomComplet(numero: string): Promise<string> {
    const response = await fetch(`http://127.0.0.1:8000/transfert-api/clients/nomComplet?numero=${numero}`);
    const data = await response.json();
    return data.NomComplet;
}
// Ajouter une fonction pour récupérer le fournisseur en utilisant l'API
async function getFournisseur(numero: string): Promise<string> {
    const response = await fetch(`http://127.0.0.1:8000/transfert-api/clients/fournisseur?numero=${numero}`);
    const data = await response.json();
    return data.fournisseur;
}

async function getTransactions(): Promise<any[]> {
    try {
      const response = await fetch('http://127.0.0.1:8000/transfert-api/transactions');
      const data = await response.json();
      return data.transaction;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  

async function handleInputEvent() {
    const formExpedCompte = document.getElementById('form_exped_compte') as HTMLInputElement;
    const formExpediteur = document.getElementById('form_expediteur') as HTMLInputElement;
    const transactionDiv = document.querySelector('.transaction-div');
    const destinataireDiv = document.querySelector('.destinataire-div');
    const formFournisseur = document.getElementById('form_fournisseur') as HTMLSelectElement;

    

    const numero = formExpedCompte.value;

    if (numero.length === 9) {
        try {
            const nomComplet = await getNomComplet(numero);
            if (nomComplet) {
                formExpediteur.value = nomComplet;

                const fournisseur = await getFournisseur(numero);

                if (transactionDiv  && destinataireDiv ) {
                    transactionDiv.classList.remove('om', 'wv', 'wr', 'cb'); 
                    destinataireDiv.classList.remove('om', 'wv', 'wr', 'cb'); 

                    if (fournisseur) {
                        transactionDiv.classList.add(fournisseur.toLowerCase()); 
                        destinataireDiv.classList.add(fournisseur.toLowerCase()); 

                        const optionValue = fournisseur.toUpperCase();

                        for (let i = 0; i < formFournisseur.options.length; i++) {
                            if (formFournisseur.options[i].value === optionValue) {
                                formFournisseur.selectedIndex = i;
                                formFournisseur.style.pointerEvents = "none";
                                break;
                            }
                        }
                    }
                }
            } else {
                formExpediteur.value = "Le numero invalide";
                formExpediteur.style.color = 'red'; 
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        // Réinitialiser le champ "form_expediteur" si le numéro n'a pas 9 chiffres
        formExpediteur.value = '';
    }
}

async function afficherNomComplet() {
    const formDestCompte = document.getElementById('form_dest_compte') as HTMLInputElement;
    const formDestinataire = document.getElementById('form_destinataire') as HTMLInputElement; // Assurez-vous d'avoir un élément avec l'ID 'erreur_expediteur'

    const numero = formDestCompte.value;

    if (numero.length === 9) {
        try {
            const nomComplet = await getNomComplet(numero);
            if (nomComplet) {
                formDestinataire.value = nomComplet;
            } else {
                formDestinataire.value = "Le numero invalide";
                formDestinataire.style.color = 'red'; 
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        formDestinataire.value = '';
    }
}


// La fonction pour gérer la soumission du formulaire
async function handleSubmitEvent(event: Event) {
    event.preventDefault(); 

    // Récupérer les valeurs des champs de formulaire
    const formExpedCompte = document.getElementById('form_exped_compte') as HTMLInputElement;
    const formMontant = document.getElementById('form_montant') as HTMLInputElement;
    const formTransaction = document.getElementById('form_transaction') as HTMLSelectElement;
    const formDestCompte = document.getElementById('form_dest_compte') as HTMLInputElement;

    const numeroExpediteur = formExpedCompte.value;
    const montant = +formMontant.value;
    const typeTransfert = +formTransaction.value;
    const numeroDestinataire = formDestCompte.value;

    console.log(numeroExpediteur);
    console.log(montant);
    console.log(typeTransfert);
    console.log(numeroDestinataire);
    try {
        const response = await fetch('http://127.0.0.1:8000/transfert-api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            body: JSON.stringify({
                type_transaction: typeTransfert,
                montant: montant,
                expediteur: numeroExpediteur,
                destinataire: numeroDestinataire
            })
        });
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
    
          const data = await response.json();
         if (data.error) {
            errorMessageElement.style.display = "block"
            errorMessageElement.textContent = data.error;
         }
         else if (data.fournisseurError) {
            errorFournisseurElement.style.display = "block"
            errorFournisseurElement.textContent = data.fournisseurError;
         } 
         else{
            errorMessageElement.style.display = "none"
            alert("succes");
            
         }
    } catch (error :any) {
        
       
        console.error('Erreur lors de la transaction :', error);
        
    }
}
async function afficherTransactions() {
    const transactionsDiv = document.getElementById('list_transactions') as HTMLElement;
    transactionsDiv.innerHTML = ''; 
  
    const transactions = await getTransactions();
    console.log(transactions);
    if (transactions.length == 0) {
        transactionsDiv.innerHTML = `<h3 class="text-danger" >Aucun transaction</h3>`
    }
     else{
        transactions.forEach((transaction) => {
            const transactionDiv = document.createElement('div');
            transactionDiv.innerHTML = `
              <hr>
              <h3 class:"tittle">${transaction.type_transaction}</h3>
              <div class="transaction_expediteur">numero expediteur:<span class="mon_tran">${transaction.numero_expediteur}</span></div>
              <div class="transaction_destinataire">numero destinataire:<span class="mon_tran">${transaction.numero_destinataire}</span></div>
              <div class="date">Date :<span class="mon_tran">${transaction.date_transaction}</span></div>
              <div class="montant_tr">montant :<span class="mon_tran">${transaction.date_transaction}</span></div>
            `;
            transactionsDiv.appendChild(transactionDiv);
          });
     }
  }
 
  

if (formExpedCompte) {
    formExpedCompte.addEventListener('input', handleInputEvent);
}
if (formDestCompte ) {
    formDestCompte .addEventListener('input', afficherNomComplet);
}
if (transactionForm) {
    transactionForm.addEventListener('submit', handleSubmitEvent);
}

info.addEventListener('click' , ()=>{
    modalTransaction.style.display = "block";
    afficherTransactions();
});

modalFerme.addEventListener('click' , ()=>{
    modalTransaction.style.display = "none";
});






  


