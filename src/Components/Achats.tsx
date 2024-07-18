import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define types for the data structures
interface Item {
  Id_Item: number;
  nom: string;
  image: string;
}

interface Achat {
  Id_Achat: number;
  Id_Item: number;
  PrixUnitaire: number;
  Quantite: number;
  DateAchat: string;
  Active: number;
  nom?: string;
  imageUrl?: string;
}

const Achats: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [prixUnitaire, setPrixUnitaire] = useState<string>("");
  const [quantite, setQuantite] = useState<string>("");
  const [achats, setAchats] = useState<Achat[]>([]);

  const totalParProduit = achats
    .filter((achat) => achat.Active === 1)
    .reduce<Record<string, { totalQuantite: number; totalValeur: number }>>((acc, achat) => {
      if (!acc[achat.nom!]) {
        acc[achat.nom!] = { totalQuantite: 0, totalValeur: 0 };
      }
      acc[achat.nom!].totalQuantite += achat.Quantite;
      acc[achat.nom!].totalValeur += achat.Quantite * achat.PrixUnitaire;
      return acc;
    }, {});

  const totalParProduitArray = Object.keys(totalParProduit).map((nom) => ({
    nom,
    totalQuantite: totalParProduit[nom].totalQuantite,
    totalValeur: totalParProduit[nom].totalValeur,
  }));

  const totalGlobal = totalParProduitArray.reduce(
    (acc, produit) => acc + produit.totalValeur,
    0
  );

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/items`)
      .then((response) => {
        setItems(response.data);

        axios
          .get(`${import.meta.env.VITE_API_URL}/achats`)
          .then((achatsResponse) => {
            const achatsAvecNomEtImage = achatsResponse.data.map((achat: Achat) => {
              const itemCorrespondant = response.data.find(
                (item: Item) => item.Id_Item === achat.Id_Item
              );
              return {
                ...achat,
                nom: itemCorrespondant?.nom,
                imageUrl: itemCorrespondant?.image,
              };
            });
            setAchats(achatsAvecNomEtImage);
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  }, []);

  const handleSubmit = () => {
    const nomItem = items.find((item) => item.Id_Item === parseInt(selectedItem, 10))?.nom;
    const achatData = {
      Id_Item: parseInt(selectedItem, 10),
      PrixUnitaire: parseFloat(prixUnitaire),
      Quantite: parseInt(quantite, 10),
      DateAchat: new Date().toISOString().slice(0, 10),
      nom: nomItem,
    };

    axios
      .post(`${import.meta.env.VITE_API_URL}/ajouterAchat`, achatData)
      .then(() => {
        setAchats([
          ...achats,
          {
            ...achatData,
            Id_Achat: achats.length + 1, // Assuming new Id_Achat is incremental
            Active: 1,
            imageUrl: items.find((item) => item.Id_Item === parseInt(selectedItem, 10))?.image,
          },
        ]);
        setSelectedItem("");
        setPrixUnitaire("");
        setQuantite("");
        toast.success(`Achat de ${nomItem} ajouté avec succès !`);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Erreur lors de l'ajout de l'achat.");
      });
  };

  const desactiverAchat = (idAchat: number) => {
    const achatToDisable = achats.find((achat) => achat.Id_Achat === idAchat);
    if (!achatToDisable) {
      toast.error("Erreur : Achat non trouvé.");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_API_URL}/modifierAchatActive`, { id: idAchat, active: 0 })
      .then(() => {
        setAchats(
          achats.map((achat) => {
            if (achat.Id_Achat === idAchat) {
              return { ...achat, Active: 0 };
            }
            return achat;
          })
        );

        const itemName = items.find((item) => item.Id_Item === achatToDisable.Id_Item)?.nom;
        toast.success(`achat "${idAchat}" de "${itemName}" marqué comme revendu.`);
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour de l'achat:", error);
        toast.error("Erreur lors de la mise à jour de l'achat.");
      });
  };

  return (
    <div className="achats-container">
      <div className="input-group">
        <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
          <option value="">Sélectionnez un produit</option>
          {items.map((item) => (
            <option key={item.Id_Item} value={item.Id_Item}>
              {item.nom}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={prixUnitaire}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPrixUnitaire(e.target.value)}
          placeholder="Prix unitaire"
        />
        <input
          type="number"
          value={quantite}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQuantite(e.target.value)}
          placeholder="Quantité"
        />
        <button onClick={handleSubmit}>Ajouter</button>
      </div>
      <table className="achats-table">
        <thead>
          <tr>
            <th>Nom du Produit</th>
            <th>Prix Unitaire</th>
            <th>Quantité</th>
            <th>Prix Total</th>
            <th>Date Achat</th>
          </tr>
        </thead>
        <tbody>
          {achats
            .filter((achat) => achat.Active === 1)
            .map((achat, index) => (
              <tr key={index}>
                <td>
                  {achat.imageUrl && <img src={achat.imageUrl} alt={achat.nom} />}
                  {achat.nom}
                </td>
                <td>{achat.PrixUnitaire.toLocaleString("fr-FR")}</td>
                <td>{achat.Quantite.toLocaleString("fr-FR")}</td>
                <td>{(achat.PrixUnitaire * achat.Quantite).toLocaleString("fr-FR")}</td>
                <td>
                  {new Date(achat.DateAchat).toLocaleDateString("fr-FR", {
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td>
                  <button onClick={() => desactiverAchat(achat.Id_Achat)}>Revendu !</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <table className="achats-table">
        <thead>
          <tr>
            <th>Nom du Produit</th>
            <th>Total Quantité</th>
            <th>Total Valeur</th>
            <th>Prix Unitaire Moyen</th>
          </tr>
        </thead>
        <tbody>
          {totalParProduitArray.map((produit, index) => (
            <tr key={index}>
              <td>{produit.nom}</td>
              <td>{produit.totalQuantite.toLocaleString("fr-FR")}</td>
              <td>{produit.totalValeur.toLocaleString("fr-FR")}</td>
              <td>{(produit.totalValeur / produit.totalQuantite).toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={2}>Total Global</td>
            <td>{totalGlobal.toLocaleString("fr-FR")}</td>
          </tr>
        </tbody>
      </table>
      <ToastContainer theme="colored" />
    </div>
  );
};

export default Achats;
