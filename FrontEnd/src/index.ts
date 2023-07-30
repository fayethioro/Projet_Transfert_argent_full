
const formExpedCompte = document.getElementById('form_exped_compte');
const formDestCompte = document.getElementById('form_dest_compte');
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

// Modifier la fonction handleInputEvent()
async function handleInputEvent() {
    const formExpedCompte = document.getElementById('form_exped_compte') as HTMLInputElement;
    const formExpediteur = document.getElementById('form_expediteur') as HTMLInputElement;
    const transactionDiv = document.querySelector('.transaction-div');
    const destinataireDiv = document.querySelector('.destinataire-div');
    

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

// Ajouter l'écouteur d'événement "input" sur le champ "form_exped_compte"
// const formExpedCompte = document.getElementById('form_exped_compte');
if (formExpedCompte) {
    formExpedCompte.addEventListener('input', handleInputEvent);
}
/**
 * Ajouter l'écouteur d'événement "input" sur le champ "form_exped_compte"
 */

if (formDestCompte ) {
    formDestCompte .addEventListener('input', afficherNomComplet);
}







  