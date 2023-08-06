export async function getNomComplet(numero: string): Promise<string> {
    const response = await fetch(`http://127.0.0.1:8000/transfert-api/clients/nomComplet/${numero}`);
    const data = await response.json();
    return data.NomComplet;
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