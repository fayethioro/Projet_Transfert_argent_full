
const transactionForm = document.getElementById('transactionForm');
const errorMessageElement = document.getElementById('error-message') as HTMLElement;
const errorFournisseurElement = document.getElementById('error-fournisseur') as HTMLElement;
const info = document.querySelector('.info') as HTMLElement;
const modalTransaction = document.querySelector('.modal_transaction') as HTMLElement;
const modalFerme = document.querySelector('.ferme') as HTMLElement;

const formExpedCompte = document.getElementById('form_exped_compte') as HTMLInputElement;
const formExpediteur = document.getElementById('form_expediteur') as HTMLInputElement;
const transactionDiv = document.querySelector('.transaction-div');
const destinataireDiv = document.querySelector('.destinataire-div');
const formFournisseur = document.getElementById('form_fournisseur') as HTMLSelectElement;

const formDestCompte = document.getElementById('form_dest_compte') as HTMLInputElement;
const formDestinataire = document.getElementById('form_destinataire') as HTMLInputElement; 

const formMontant = document.getElementById('form_montant') as HTMLInputElement;
const formTransaction = document.getElementById('form_transaction') as HTMLSelectElement;

 const prevButton = document.getElementById('prevButton') as HTMLButtonElement;
 const nextButton = document.getElementById('nextButton') as HTMLButtonElement;

const notif = document.querySelector('.notif') as HTMLElement;




async function getNomComplet(numero: string): Promise<string> {
    const response = await fetch(`http://127.0.0.1:8000/transfert-api/clients/nomComplet/${numero}`);
    const data = await response.json();
    return data.NomComplet;
}
async function getNomCompletViaCompte(numero: string): Promise<string> {
    console.log(numero);
    const response = await fetch(`http://127.0.0.1:8000/transfert-api/clients/compte/${numero}`);
    const data = await response.json();
    return data.NomComplet;
}

async function getFournisseur(numero: string): Promise<string> {
    const response = await fetch(`http://127.0.0.1:8000/transfert-api/clients/fournisseur/${numero}`);
    const data = await response.json();
    return data.fournisseur;
}

async function getTransactions(): Promise<any[]> {
    try {
      const response = await fetch(`http://127.0.0.1:8000/transfert-api/transactions`);
      const data = await response.json();
      return data.transaction;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

async function gererNomExpediteur(): Promise<void> {
    const numero = formExpedCompte.value;
    let nomComplet: string;
    if (numero.length === 9 || numero.length === 12) { // Vérifier si c'est 9 ou 12 caractères
        try {
            if (numero.length === 9) {
                nomComplet = await getNomComplet(numero);
            } else {
                nomComplet = await getNomCompletViaCompte(numero);
            }
            if (nomComplet) {
                formExpediteur.value = nomComplet;

                const fournisseur = await getFournisseur(numero);

                if (transactionDiv && destinataireDiv) {
                    transactionDiv.classList.remove('om', 'wv', 'wr', 'cb');
                    destinataireDiv.classList.remove('om', 'wv', 'wr', 'cb');

                    if (fournisseur) {
                        transactionDiv.classList.add(fournisseur.toLowerCase());
                        destinataireDiv.classList.add(fournisseur.toLowerCase());

                        // const optionValue = fournisseur.toUpperCase();

                        // for (let i = 0; i < formFournisseur.options.length; i++) {
                        //     if (formFournisseur.options[i].value === optionValue) {
                        //         formFournisseur.selectedIndex = i;
                        //         formFournisseur.style.pointerEvents = "none";
                        //         break;
                        //     }
                        // }
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
        formExpediteur.value = '';
    }
}

async function gererNomDestinataire() {
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
async function ajouterTransaction(event: Event) {
    event.preventDefault(); 

    const numeroExpediteur = formExpedCompte.value;
    const montant = +formMontant.value;
    const typeTransfert = +formTransaction.value;
    const numeroDestinataire = formDestCompte.value;

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
        if (!response.ok) {
            throw new Error('La requête a échoué.');
          }
          const data = await response.json();

          console.log(data.destinataire.fournisseur);
          
          console.log(formFournisseur.value);
          if (data.destinataire.fournisseur !== formFournisseur.value ) {
            errorFournisseurElement.style.display = "block"
            errorFournisseurElement.textContent = `Vous devez selectionner le meme fournisseur ${data.destinataire.fournisseur}`;
            return
          }
         else if (data.error) {
            errorMessageElement.style.display = "block"
            errorMessageElement.textContent = data.error;
         }
         else if (data.fournisseurError) {
            errorFournisseurElement.style.display = "block"
            errorFournisseurElement.textContent = data.fournisseurError;
         } 
         else{
            errorMessageElement.style.display = "none"
            afficherNotif(data.message);
            afficherTransactions();   
         }
        
    } catch (error :any) {
        console.error('Erreur lors de la transaction :', error);
    }
}
 
const itemsParPage = 2; 
let pageCourant = 1;

async function afficherTransactions() {
  const transactionsDiv = document.getElementById('list_transactions') as HTMLElement;
  transactionsDiv.innerHTML = ''; 

  const transactions = await getTransactions();
  const totalItems = transactions.length;
  const totalPages = Math.ceil(totalItems / itemsParPage);

  if (transactions.length === 0) {
    transactionsDiv.innerHTML = `<h3 class="text-danger">Aucune transaction</h3>`;
    prevButton.style.display = "none";
    nextButton.style.display = "none";
    return;
  }

  const startIndex = (pageCourant - 1) * itemsParPage;
  const endIndex = Math.min(startIndex + itemsParPage, totalItems);

  for (let i = startIndex; i < endIndex; i++) {
    const transaction = transactions[i];
    const transactionDiv = document.createElement('div');
            transactionDiv.innerHTML = `
              <hr>
              <h3 class:"tittle">${transaction.type_transaction}</h3>
              <div class="transaction_expediteur">numero expediteur:<span class="mon_tran">${transaction.numero_expediteur}</span></div>
              <div class="transaction_destinataire">numero destinataire:<span class="mon_tran">${transaction.numero_destinataire}</span></div>
              <div class="date">Date :<span class="mon_tran">${transaction.date_transaction}</span></div>
              <div class="montant_tr">montant :<span class="mon_tran">${transaction.montant}</span></div>
              <div class="montant_tr">code :<span class="mon_tran">${transaction.code}</span></div>
            `;
    transactionsDiv.appendChild(transactionDiv);
  }

  prevButton.disabled = pageCourant === 1;
  nextButton.disabled = pageCourant === totalPages;
}


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


  function afficherNotif(message:string)
{
    notif.innerHTML = message;
    notif.style.display = 'block';
    formExpedCompte.innerHTML = "";
    formMontant.innerHTML = "";
    formDestCompte.innerHTML = "";
    formTransaction.innerHTML = "";
    setTimeout(() => {
        notif.style.display = 'none';
    }, 5000);
}





  


