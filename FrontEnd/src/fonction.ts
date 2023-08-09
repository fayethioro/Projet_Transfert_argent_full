import {
  errorFournisseurElement, formExpedCompte, formExpediteur, transactionDiv, destinataireDiv,formFournisseur,formDestCompte,
  formDestinataire,formMontant,formTransaction,prevButton,nextButton,precButton,suivButton,notif,errorMessageElement,prenomClient,
  nomClient,telephoneClient,emailClient, erreurPrenom,erreurNom,erreurEmail,erreurNumero,modalClient,notifi,fournisseur,numeroClient, 
  erreurFournisseur, erreurNumeroClient, nomCompletErreur,dest, TitreClient, modalTransaction, optionRetraitCode, formCodeRetrait,
} from "./dom.js";

import {
  getNomComplet,getNomCompletViaCompte,getFournisseur,getTransactions,getClients, getComptes, getBloqueCompte, getDeBloqueCompte, getFermerCompte, getTransactionsClient, getTrieClients, getAnnulerTransaction,
} from "./fetch.js";

export const itemsParPage = 10;
export const itemsParPageClient = 6;
export let pageCourant = 1;

export async function gererNomExpediteur(): Promise<void> {
  const numero = formExpedCompte.value;
  console.log(numero);
  let nomComplet: string;
  if (numero.length === 9 || numero.length === 12) {
    // Vérifier si c'est 9 ou 12 caractères
    try {
      if (numero.length === 9) {
        let data= await getNomComplet(numero); 
        nomComplet = data[0];
        nomCompletErreur.innerHTML = data[1]
          
      } else {
        nomComplet = await getNomCompletViaCompte(numero);
      }
      if (nomComplet) {
        formExpediteur.value = nomComplet;

        const fournisseur = await getFournisseur(numero);
        console.log(fournisseur);

        if (transactionDiv && destinataireDiv) {
          transactionDiv.classList.remove("om", "wv", "wr", "cb");
          destinataireDiv.classList.remove("om", "wv", "wr", "cb");

          if (fournisseur) {
            transactionDiv.classList.add(fournisseur.toLowerCase());
            destinataireDiv.classList.add(fournisseur.toLowerCase());
          }
        }
      } else {
        formExpediteur.value = "Le numero invalide";
        formExpediteur.style.color = "red";
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    formExpediteur.value = "";
  }
}

export async function gererNomDestinataire() {
  const numero = formDestCompte.value;
  if (numero.length === 9) {
    try {
      const nomComplet = await getNomComplet(numero);

      if (nomComplet) {
        formDestinataire.value = nomComplet[0];

        const fournisseur = await getFournisseur(numero);
        console.log(fournisseur);
        if (fournisseur == "WR") {
          formFournisseur.value = "WR";
          // formFournisseur.style.pointerEvents = "none"
        }
        
      } else {
        formDestinataire.value = "Le numero invalide";
        formDestinataire.style.color = "red";
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    formDestinataire.value = "";

  }
}
export async function ajouterTransaction(event: Event) {
  event.preventDefault();

  const numeroExpediteur = formExpedCompte.value;
  const montant = +formMontant.value;
  const typeTransfert = +formTransaction.value;
  let numeroDestinataire = formDestCompte.value;
  const codeSaisie  = formCodeRetrait.value;
 
  if (numeroDestinataire.length != 0) {
    numeroDestinataire = formDestCompte.value;
  }
  else{
    numeroDestinataire = numeroExpediteur
  }
  console.log( numeroDestinataire);

  const fournisseurDestinataire = await getFournisseur(numeroDestinataire);
 if (numeroDestinataire) {
   
  const fournisseurSelectionne = formFournisseur.value;

  if (
    fournisseurSelectionne !== fournisseurDestinataire &&
    typeTransfert !== 1
  ) {
    errorFournisseurElement.style.display = "block";
    errorFournisseurElement.textContent =
      "Le fournisseur sélectionné ne correspond pas au fournisseur du destinataire.";
    return;
  }
 }

  try {
    const response = await fetch("http://127.0.0.1:8000/transfert-api/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          type_transaction: typeTransfert,
          montant: montant,
          expediteur: numeroExpediteur,
          destinataire: numeroDestinataire,
          codeSaisie : codeSaisie
        }),
        });
    console.log(response);
    console.log(JSON.stringify({
      type_transaction: typeTransfert,
      montant: montant,
      expediteur: numeroExpediteur,
      destinataire: numeroDestinataire,
      codeSaisie : codeSaisie
    }));
    
    
    if (!response.ok) {
      throw new Error("La requête a échoué.");
    }
    const data = await response.json();


    console.log(data);
    
    if (data.error) {
      errorMessageElement.style.display = "block";
      errorMessageElement.textContent = data.error;
    } else if (data.fournisseurError) {
      errorFournisseurElement.style.display = "block";
      errorFournisseurElement.textContent = data.fournisseurError;
    } else if (data.retraitError) {
      nomCompletErreur.textContent = data.retraitError
    }
    else if (data.message) {
      nomCompletErreur.textContent =data.message
    }
    else {
      errorMessageElement.style.display = "none";
      afficherNotif(data.message);
      afficherTransactions();
    }
  } catch (error: any) {
    console.error("Erreur lors de la transaction :", error);
  }
}

export async function afficherTransactions() {
  const transactionsDiv = document.getElementById("list_transactions") as HTMLElement;
  transactionsDiv.innerHTML = "";

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
    const transactionDiv = document.createElement("tr");
    transactionDiv.classList.add("annuler");

    transactionDiv.innerHTML = `
    <td>${transaction.type_transaction}</td>
    <td >${transaction.numero_expediteur}</td>
    <td>${transaction.numero_destinataire}</td>
    <td>${transaction.montant}</td>
    <td>${transaction.code}</td>
    <td>${transaction.date_transaction}</td>
    <td>${transaction.etat_transaction}</td>
    <td>
    <a href="#" class="annuler" data-toggle="modal">Annuler</a>
  </td>
    `;
    transactionsDiv.appendChild(transactionDiv);

    transactionDiv.addEventListener("click", async() => {
      const numeroExpediteur = transaction.numero_expediteur;
      console.log(numeroExpediteur);
      
      const annuleTrans = await getAnnulerTransaction(numeroExpediteur);
      console.log(annuleTrans.error);

      if (annuleTrans.error) {
        afficherNotif(annuleTrans.error);
        afficherTransactions();
        modalTransaction.style.display = "none"
      }
      if (annuleTrans.message) {
        afficherNotif(annuleTrans.message);
        afficherTransactions();
        modalTransaction.style.display = "none"
      }
      
    });
   
  }
const annulerTranstion = document.querySelectorAll(".annuler") as NodeListOf<HTMLAnchorElement>;
console.log(annulerTranstion);

  const numero= await getTransactions();
  

  prevButton.disabled = pageCourant === 1;
  nextButton.disabled = pageCourant === totalPages;
}

function viderTransactionsClient() {
  const transactionClientDiv = document.querySelector(".list_transaction_client") as HTMLElement;
  transactionClientDiv.innerHTML = "";
}

export async function afficherClients() {
  const clientsDiv = document.querySelector(".list_client") as HTMLElement;

  clientsDiv.innerHTML = "";

  const clients = await getClients();

  const totalItems = clients.length;
  console.log(totalItems);
  const totalPages = Math.ceil(totalItems / itemsParPageClient);

  if (clients.length === 0) {
    clientsDiv.innerHTML = `<h3 class="text-danger">Aucun Client</h3>`;
    precButton.style.display = "none";
    suivButton.style.display = "none";
    return;
  }

  const startIndex = (pageCourant - 1) * itemsParPageClient;
  const endIndex = Math.min(startIndex + itemsParPageClient, totalItems);
  for (let i = startIndex; i < endIndex; i++) {
    const client = clients[i];
    const transactionDiv = document.createElement("tr");
    transactionDiv.innerHTML = `
    <td>${client.prenom}</td>
    <td>${client.nom}</td>
    <td>${client.numero}</td>
    <td>${client.email}</td>
    <td>
    <a href="#exampleModal" class="detail" data-toggle="modal"><i class="fa-solid fa-circle-info" style="color: #0000ff;" data-toggle="tooltip" title="Detail Transaction"></i></a>
    <a href="#editEmployeeModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Modfier">&#xE254;</i></a>
    <a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Supprimer">&#xE872;</i></a>
    </td>
    `;
    clientsDiv.appendChild(transactionDiv);
    const numero= client.numero;
     const detail = transactionDiv.querySelector(".detail") as HTMLElement;

    detail.addEventListener("click", async () => {

      TitreClient.innerHTML = `${client.prenom} ${client.nom} `
      try {

        viderTransactionsClient();
       const transactionClientDiv = document.querySelector(".list_transaction_client") as HTMLElement;

        const transactionsClients = await getTransactionsClient(numero);
          const startIndex = 0;
         const endIndex =transactionsClients.length ;
         
          for (let i = startIndex; i < endIndex; i++) {

    const transactionClient = transactionsClients[i];
    const transactionDiv = document.createElement("tr");
    transactionDiv.innerHTML = `
              <td>${transactionClient.type_transaction}</td>
              <td>${transactionClient.numero_expediteur}</td>
              <td>${transactionClient.numero_destinataire}</td>
              <td>${transactionClient.montant}</td>
              <td>${transactionClient.code}</td>
              <td>${transactionClient.date_transaction}</td>
              `
    transactionClientDiv.appendChild(transactionDiv); 
    // window.location.reload();
  }  
      } catch (error) {
        console.error("Une erreur s'est produite :", error);
      }
    });
  }

  precButton.disabled = pageCourant === 1;
  suivButton.disabled = pageCourant === totalPages;

}

export function afficherNotif(message: string) {
  notif.innerHTML = message;
  notif.style.display = "block";
  formExpedCompte.innerHTML = "";
  formMontant.innerHTML = "";
  formDestCompte.innerHTML = "";
  formTransaction.innerHTML = "";
  setTimeout(() => {
    notif.style.display = "none";
  }, 5000);
}

export async function ajouterClient(event: Event) {
  event.preventDefault();

  // Récupérer les valeurs du formulaire
  const prenom = prenomClient.value;
  const nom = nomClient.value;
  const email = emailClient.value;
  const telephone = telephoneClient.value;

  try {
      const response = await fetch("http://127.0.0.1:8000/transfert-api/clients", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
          },
          body: JSON.stringify({
              numero: telephone,
              prenom: prenom,
              nom: nom,
              email: email,
          }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          if (errorData.errors) {

              for (const champ in errorData.errors) {
                  const errorMessage = errorData.errors[champ][0];      
                  console.log(`Erreur dans le champ "${champ}": ${errorMessage}`);

                  if (champ === "prenom") {
                    erreurPrenom.innerHTML =  errorMessage
                  }
                  if (champ === "nom") {
                    erreurNom.innerHTML =  errorMessage
                  }
                  if (champ === "email") {
                    erreurEmail.innerHTML =  errorMessage
                  }
                  if (champ === "numero") {
                    erreurNumero.innerHTML =  errorMessage
                  }
              }
          } else {
              throw new Error("La requête a échoué.");
          }
          return;
      }

      const data = await response.json();
      console.log(data);
      
      modalClient.style.display = "none"
      afficherNotifi("succes");
      afficherClients();

  } catch (error: any) {
      console.error("Erreur lors de la transaction :", error);
  }
}

export function afficherNotifi(message: string) {
  notifi.innerHTML = message;
  notifi.style.display = "block";
  formExpedCompte.innerHTML = "";
  formMontant.innerHTML = "";
  formDestCompte.innerHTML = "";
  formTransaction.innerHTML = "";
  setTimeout(() => {
    notifi.style.display = "none";
  }, 5000);
}

export async function creerCompte(event: Event) {
  event.preventDefault();
   
   const fournisseurCompte = fournisseur.value;
   const numeroClientCompte = numeroClient.value;

   console.log(fournisseurCompte , numeroClientCompte);
  
  try {
      const response = await fetch("http://127.0.0.1:8000/transfert-api/comptes", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
          },
          body: JSON.stringify({
              fournisseur: fournisseurCompte,
              numero_client: numeroClientCompte,
          })
      });
      if (!response.ok) {
          const errorData = await response.json();
          if (errorData.errors) {
              for (const champ in errorData.errors) {
                  const errorMessage = errorData.errors[champ][0];      
                  console.log(`Erreur dans le champ "${champ}": ${errorMessage}`);

                  if(champ === "fournisseur"){
                    erreurFournisseur.innerHTML = errorMessage
                  }
                  if(champ === "numero_client"){
                    erreurNumeroClient.innerHTML= errorMessage
                  }
              }
          } 
          return;
      }
      const data = await response.json();
      if (data.message) {
        erreurNumeroClient.innerHTML= data.message
      }
      else{
        erreurFournisseur.innerHTML = "";
        erreurNumeroClient.innerHTML= "";
        alert ("succes");
        window.location.reload();

      }
      
  } catch (error: any) {
      console.error("Erreur lors de la transaction :", error);
  }
}

export async function afficherComptes() {
  const comptesDiv = document.querySelector(".list_compte") as HTMLElement;

  comptesDiv.innerHTML = "";

  const comptes = await getComptes();

  const totalItems = comptes.length;
  console.log(totalItems);
  const totalPages = Math.ceil(totalItems / itemsParPageClient);

  if (comptes.length === 0) {
    comptesDiv.innerHTML = `<h3 class="text-danger">Aucun Client</h3>`;
    precButton.style.display = "none";
    suivButton.style.display = "none";
    return;
  }

  const startIndex = (pageCourant - 1) * itemsParPageClient;
  const endIndex = Math.min(startIndex + itemsParPageClient, totalItems);

  for (let i = startIndex; i < endIndex; i++) {
    const compte = comptes[i];
    const transactionDiv = document.createElement("tr");
    transactionDiv.innerHTML = `
              <td class="compte-numero">${compte.numero_compte}</td>
              <td>${compte.fournisseur}</td>
              <td>${compte.solde} fcfa</td>
              <td>${compte.numero_client}</td>
              <td>${compte.etat}</td>
              <td>
              <a href="#" class="debloque" data-toggle="modal"><i class="fa-solid fa-lock-open" data-toggle="tooltip" title="débloqué" style="color: #008000;"></i></a>
              <a href="#" class="bloque" data-toggle="modal"><i class="fa-solid fa-lock"  data-toggle="tooltip" title="bloqué" style="color: #0000ff;"></i></a>
                <a href="#" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Fermer Compte">&#xE872;</i></a>
              </td>
              `;
    comptesDiv.appendChild(transactionDiv);

  const bloque = transactionDiv.querySelector(".bloque") as HTMLElement;
  const debloque = transactionDiv.querySelector(".debloque") as HTMLElement;
  const fermerCompte = transactionDiv.querySelector(".delete") as HTMLElement;

    const numeroCompte = compte.numero_compte;

    bloque.addEventListener("click", async () => {
  // event.preventDefault();

      try {
         await getBloqueCompte(numeroCompte);
        window.location.reload();
      } catch (error) {
        console.error("Une erreur s'est produite :", error);
      }
    });

    debloque.addEventListener("click", async () => {
      try {
         await getDeBloqueCompte(numeroCompte);
        window.location.reload();
      } catch (error) {
        console.error("Une erreur s'est produite :", error);
      }
    });

    fermerCompte.addEventListener("click", async () => {
      try {
       await getFermerCompte(numeroCompte);
        window.location.reload();
      } catch (error) {
        console.error("Une erreur s'est produite :", error);
      }
    });
  }
  precButton.disabled = pageCourant === 1;
  suivButton.disabled = pageCourant === totalPages;
}

export async function getCritereTrie(numero: string): Promise<string[]> {
  try {
    const transactionsClients = await getTransactionsClient(numero);
    const critereSet = new Set<string>();

    for (const transactionClient of transactionsClients) {
      critereSet.add("date_transaction");
      critereSet.add("montant");
      critereSet.add("numero_expediteur");
    }

    return Array.from(critereSet);
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    return [];
  }
}
/**
 * 
Fonction pour afficher les transactions clients triées en fonction du critère sélectionné
 */
export async function afficherTransactionsClientTrie(numero: string, critere: string) {
  try {
    viderTransactionsClient();
    const transactionClientDiv = document.querySelector(".list_transaction_client") as HTMLElement;

    const transactionsClients = await getTrieClients(numero, critere);
    const startIndex = 0;
    const endIndex = transactionsClients.length;

    for (let i = startIndex; i < endIndex; i++) {
      const transactionClient = transactionsClients[i];
      const transactionDiv = document.createElement("tr");
      transactionDiv.innerHTML = `
        <td>${transactionClient.type_transaction}</td>
        <td>${transactionClient.numero_expediteur}</td>
        <td>${transactionClient.numero_destinataire}</td>
        <td>${transactionClient.montant}</td>
        <td>${transactionClient.code}</td>
        <td>${transactionClient.date_transaction}</td>
      `;
      transactionClientDiv.appendChild(transactionDiv);
    }
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
  }
}

export async function afficherClientsParTrie() {
  const clientsDiv = document.querySelector(".list_client") as HTMLElement;
  clientsDiv.innerHTML = "";

  const clients = await getClients();
  const totalItems = clients.length;
  const totalPages = Math.ceil(totalItems / itemsParPageClient);

  if (clients.length === 0) {
    clientsDiv.innerHTML = `<h3 class="text-danger">Aucun Client</h3>`;
    precButton.style.display = "none";
    suivButton.style.display = "none";
    return;
  }

  const startIndex = (pageCourant - 1) * itemsParPageClient;
  const endIndex = Math.min(startIndex + itemsParPageClient, totalItems);

  for (let i = startIndex; i < endIndex; i++) {
    const client = clients[i];
    const transactionDiv = document.createElement("tr");
    transactionDiv.innerHTML = `
      <td>${client.prenom}</td>
      <td>${client.nom}</td>
      <td>${client.numero}</td>
      <td>${client.email}</td>
      <td>
        <a href="#exampleModal" class="detail" data-toggle="modal"><i class="fa-solid fa-circle-info" style="color: #0000ff;" data-toggle="tooltip" title="Detail Transaction"></i></a>
        <a href="#editEmployeeModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Modfier">&#xE254;</i></a>
        <a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Supprimer">&#xE872;</i></a>
      </td>
    `;
    clientsDiv.appendChild(transactionDiv);

    const numero = client.numero;

    const detail = transactionDiv.querySelector(".detail") as HTMLElement;
    detail.addEventListener("click", async () => {
      TitreClient.innerHTML = `${client.prenom} ${client.nom}`;
      try {
        const selectCritere = document.getElementById("selectCritere") as HTMLSelectElement;
        const critereOptions = await getCritereTrie(numero);
        selectCritere.innerHTML = critereOptions.map((critere) => {
          return `<option value="${critere}">${critere}</option>`;
        }).join("");

        selectCritere.addEventListener("change", async () => {
          const critere = selectCritere.value;
          await afficherTransactionsClientTrie(numero, critere);
        });
        viderTransactionsClient()
        await afficherTransactionsClientTrie(numero, critereOptions[0]); // Afficher les transactions triées par défaut
      } catch (error) {
        console.error("Une erreur s'est produite :", error);
      }
    });
  }

  precButton.disabled = pageCourant === 1;
  suivButton.disabled = pageCourant === totalPages;
}







