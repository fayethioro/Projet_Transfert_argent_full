import {
  errorFournisseurElement,
  formExpedCompte,
  formExpediteur,
  transactionDiv,
  destinataireDiv,
  formFournisseur,
  formDestCompte,
  formDestinataire,
  formMontant,
  formTransaction,
  prevButton,
  nextButton,
  precButton,
  suivButton,
  notif,
  errorMessageElement,
  prenomClient,
  nomClient,
  telephoneClient,
  emailClient,
  erreurPrenom,
  erreurNom,
  erreurEmail,
  erreurNumero,
 modalClient,
 notifi
} from "./dom.js";

import {
  getNomComplet,
  getNomCompletViaCompte,
  getFournisseur,
  getTransactions,
  getClients,
} from "./fetch.js";

export const itemsParPage = 2;
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
        nomComplet = await getNomComplet(numero);
      } else {
        nomComplet = await getNomCompletViaCompte(numero);
      }
      if (nomComplet) {
        formExpediteur.value = nomComplet;

        const fournisseur = await getFournisseur(numero);

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
        formDestinataire.value = nomComplet;
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
  const numeroDestinataire = formDestCompte.value;

  const fournisseurDestinataire = await getFournisseur(numeroDestinataire);
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

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/transfert-api/transactions",
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
        }),
      }
    );
    if (!response.ok) {
      throw new Error("La requête a échoué.");
    }
    const data = await response.json();

    if (data.error) {
      errorMessageElement.style.display = "block";
      errorMessageElement.textContent = data.error;
    } else if (data.fournisseurError) {
      errorFournisseurElement.style.display = "block";
      errorFournisseurElement.textContent = data.fournisseurError;
    } else {
      errorMessageElement.style.display = "none";
      afficherNotif(data.message);
      afficherTransactions();
    }
  } catch (error: any) {
    console.error("Erreur lors de la transaction :", error);
  }
}

export async function afficherTransactions() {
  const transactionsDiv = document.getElementById(
    "list_transactions"
  ) as HTMLElement;
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
    const transactionDiv = document.createElement("div");
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
                <a href="#editEmployeeModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                <a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
              </td>
              `;
    clientsDiv.appendChild(transactionDiv);
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
      }

      const data = await response.json();
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
  // setTimeout(() => {
  //   notifi.style.display = "none";
  // }, 5000);
}

