export async function getNomComplet(numero: string): Promise<string[]> {
    const response = await fetch(`http://127.0.0.1:8000/transfert-api/clients/nomComplet/${numero}`);
    const data = await response.json();
    return [data.NomComplet , data.message];
}
export async function getNomCompletViaCompte(numero: string): Promise<string> {
    const response = await fetch(`http://127.0.0.1:8000/transfert-api/clients/compte/${numero}`);
    const data = await response.json();
    return data.NomComplet;
}

export async function getFournisseur(numero: string): Promise<string> {
    const response = await fetch(`http://127.0.0.1:8000/transfert-api/clients/fournisseur/${numero}`);
    const data = await response.json();
    return data.fournisseur;
}

export async function getTransactions(): Promise<any[]> {
    try {
      const response = await fetch(`http://127.0.0.1:8000/transfert-api/transactions`);      
      const data = await response.json();
      return data.transaction;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  export async function getClients(): Promise<any[]> {
    try {
      const response = await fetch(`http://127.0.0.1:8000/transfert-api/clients`);
      const data = await response.json();
      return data.clients;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  export async function getTransactionsClient(numero: string): Promise<any[]> {
    try {
      const response = await fetch(`http://127.0.0.1:8000/transfert-api/transactions/client/${numero}`);
      console.log(response);
      
      const data = await response.json();
      console.log("data" , data);
      
      return data.transactionsclients;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  export async function getComptes(): Promise<any[]> {
    try {
      const response = await fetch(`http://127.0.0.1:8000/transfert-api/comptes`);
      const data = await response.json();
      return data.comptes;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  export async function getBloqueCompte(numero: string): Promise<string> {
    try {
      const response = await fetch(`http://127.0.0.1:8000/transfert-api/comptes/bloque/${numero}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de la requête fetch :", error);
      throw error; // Renvoyer l'erreur pour qu'elle puisse être traitée ailleurs si nécessaire
    }
  }

  export async function getDeBloqueCompte(numero: string): Promise<string> {
    try {
      const response = await fetch(`http://127.0.0.1:8000/transfert-api/comptes/debloque/${numero}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de la requête fetch :", error);
      throw error; // Renvoyer l'erreur pour qu'elle puisse être traitée ailleurs si nécessaire
    }
  }

  export async function getFermerCompte(numero: string): Promise<string> {
    try {
      const response = await fetch(`http://127.0.0.1:8000/transfert-api/comptes/fermer/${numero}`,{
        method: "DELETE",
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
          }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de la requête fetch :", error);
      throw error; 
    }
  }


 export async function getTrieClients(numero: string, critere: string): Promise<any[]> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/transfert-api/transactions/client/${numero}/trie/${critere}`);
    console.log(response);
    
    const data = await response.json();
    return data.transactions;
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des clients :", error);
    return [];
  }
}

export async function getAnnulerTransaction(numero: string): Promise<{ error: string , message?:string }> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/transfert-api/transactions/annuler/${numero}`);
    console.log(response);
    
    const data = await response.json();
    console.log(data);
    
    return data;
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    return { error: "Une erreur s'est produite lors de la récupération des transactions annulables." };
  }
}

 


  
  
  
  
  

  