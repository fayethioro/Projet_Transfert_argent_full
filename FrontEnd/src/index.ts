
const erreurExpediteur = document.querySelector('.erreur_expediteur') as HTMLElement;

// Fonction pour effectuer la requête AJAX et récupérer le nom complet
async function getNomComplet(numero: string): Promise<string> {
    const response = await fetch(`http://127.0.0.1:8000/transfert-api/clients/nomComplet?numero=${numero}`);
    const data = await response.json();
    return data.NomComplet;
}


async function afficherNomComplet() {
    const formExpedCompte = document.getElementById('form_exped_compte') as HTMLInputElement;
    const formExpediteur = document.getElementById('form_expediteur') as HTMLInputElement; // Assurez-vous d'avoir un élément avec l'ID 'erreur_expediteur'

    const numero = formExpedCompte.value;

    if (numero.length === 9) {
        try {
            const nomComplet = await getNomComplet(numero);
            if (nomComplet) {
                formExpediteur.value = nomComplet;
            } else {
                formExpediteur.value = "Le numero n'est pas valide";
                formExpediteur.style.color = 'red';
                
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        formExpediteur.value = '';
    }
}


  

/**
 * Ajouter l'écouteur d'événement "input" sur le champ "form_exped_compte"
 */
const formExpedCompte = document.getElementById('form_exped_compte');
if (formExpedCompte) {
    formExpedCompte.addEventListener('input', afficherNomComplet);
}






  