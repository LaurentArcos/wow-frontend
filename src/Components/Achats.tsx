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

interface Prix {
  Id_Item: number;
  Date: string;
  Prix: string;
}

const Achats: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [prixUnitaire, setPrixUnitaire] = useState<string>("");
  const [quantite, setQuantite] = useState<string>("");
  const [achats, setAchats] = useState<Achat[]>([]);
  const [lastPrices, setLastPrices] = useState<Record<number, number>>({});

  const totalParProduit = achats
    .filter((achat) => achat.Active === 1)
    .reduce<Record<string, { totalQuantite: number; totalValeur: number }>>(
      (acc, achat) => {
        if (!acc[achat.nom!]) {
          acc[achat.nom!] = { totalQuantite: 0, totalValeur: 0 };
        }
        acc[achat.nom!].totalQuantite += achat.Quantite;
        acc[achat.nom!].totalValeur += achat.Quantite * achat.PrixUnitaire;
        return acc;
      },
      {}
    );

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
    const fetchData = async () => {
      try {
        const [itemsResponse, achatsResponse, prixResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/items`),
          axios.get(`${import.meta.env.VITE_API_URL}/achats`),
          axios.get(`${import.meta.env.VITE_API_URL}/prix`)
        ]);

        setItems(itemsResponse.data);

        const achatsAvecNomEtImage = achatsResponse.data.map(
          (achat: Achat) => {
            const itemCorrespondant = itemsResponse.data.find(
              (item: Item) => item.Id_Item === achat.Id_Item
            );
            return {
              ...achat,
              nom: itemCorrespondant?.nom,
              imageUrl: itemCorrespondant?.image,
            };
          }
        );

        setAchats(achatsAvecNomEtImage);

        // Create a map to store the latest price for each item
        const lastPrices = prixResponse.data.reduce((acc: Record<number, {prix: number, date: string}>, prix: Prix) => {
          if (!acc[prix.Id_Item] || new Date(prix.Date) > new Date(acc[prix.Id_Item].date)) {
            acc[prix.Id_Item] = {prix: parseFloat(prix.Prix), date: prix.Date};
          }
          return acc;
        }, {});

        setLastPrices(Object.fromEntries(Object.entries(lastPrices).map(([key, value]) => [key, (value as { prix: number, date: string }).prix])));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = () => {
    const nomItem = items.find(
      (item) => item.Id_Item === parseInt(selectedItem, 10)
    )?.nom;
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
            imageUrl: items.find(
              (item) => item.Id_Item === parseInt(selectedItem, 10)
            )?.image,
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
      .post(`${import.meta.env.VITE_API_URL}/modifierAchatActive`, {
        id: idAchat,
        active: 0,
      })
      .then(() => {
        setAchats(
          achats.map((achat) => {
            if (achat.Id_Achat === idAchat) {
              return { ...achat, Active: 0 };
            }
            return achat;
          })
        );

        const itemName = items.find(
          (item) => item.Id_Item === achatToDisable.Id_Item
        )?.nom;
        toast.success(
          `achat "${idAchat}" de "${itemName}" marqué comme revendu.`
        );
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour de l'achat:", error);
        toast.error("Erreur lors de la mise à jour de l'achat.");
      });
  };

  const calculateDifference = (totalValeur: number, valeurActuelle: number | "N/A") => {
    if (valeurActuelle === "N/A") return "N/A";
    const difference = valeurActuelle - totalValeur;
    if (difference > 0) return <span style={{ color: "green" }}>+{difference.toLocaleString("fr-FR")}</span>;
    if (difference < 0) return <span style={{ color: "red" }}>-{Math.abs(difference).toLocaleString("fr-FR")}</span>;
    return <span style={{ color: "white" }}>{difference.toLocaleString("fr-FR")}</span>;
  };

  const calculatePercentageDifference = (totalValeur: number, valeurActuelle: number | "N/A") => {
    if (valeurActuelle === "N/A" || totalValeur === 0) return "N/A";
    const percentageDifference = ((valeurActuelle - totalValeur) / totalValeur) * 100;
    if (percentageDifference > 0) return <span style={{ color: "green" }}>+{percentageDifference.toFixed(2)}%</span>;
    if (percentageDifference < 0) return <span style={{ color: "red" }}>-{Math.abs(percentageDifference).toFixed(2)}%</span>;
    return <span style={{ color: "white" }}>{percentageDifference.toFixed(2)}%</span>;
  };

  const totalValeurActuelle = totalParProduitArray.reduce((acc, produit) => {
    const dernierPrix = lastPrices[items.find(item => item.nom === produit.nom)?.Id_Item ?? 0];
    return acc + (dernierPrix ? dernierPrix * produit.totalQuantite : 0);
  }, 0);

  const totalDifference = totalValeurActuelle - totalGlobal;

  return (
    <div className="achats-container">
      <h2>Achats</h2>
      <section className="input-group">
        <select
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
        >
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
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPrixUnitaire(e.target.value)
          }
          placeholder="Prix unitaire"
        />
        <input
          type="number"
          value={quantite}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setQuantite(e.target.value)
          }
          placeholder="Quantité"
        />
        <button onClick={handleSubmit}>Ajouter</button>
      </section>
      <section>
        <table className="achats-table">
          <thead>
            <tr>
              <th>Nom du Produit</th>
              <th>Prix Unitaire</th>
              <th>Quantité</th>
              <th>Prix Total</th>
              <th>Date Achat</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {achats
              .filter((achat) => achat.Active === 1)
              .map((achat, index) => (
                <tr key={index}>
                  <td>
                    {achat.imageUrl && (
                      <img src={achat.imageUrl} alt={achat.nom} />
                    )}
                    {achat.nom}
                  </td>
                  <td>{achat.PrixUnitaire.toLocaleString("fr-FR")}</td>
                  <td>{achat.Quantite.toLocaleString("fr-FR")}</td>
                  <td>
                    {(achat.PrixUnitaire * achat.Quantite).toLocaleString(
                      "fr-FR"
                    )}
                  </td>
                  <td>
                    {new Date(achat.DateAchat).toLocaleDateString("fr-FR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td>
                    <button onClick={() => desactiverAchat(achat.Id_Achat)}>
                      Revendu !
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
      <section>
        <table className="achats-table">
          <thead>
            <tr>
              <th>Nom du Produit</th>
              <th>Total Quantité</th>
              <th>Total Valeur</th>
              <th>Valeur Actuelle</th>
              <th>Différence</th>
              <th>% Différence</th>
              <th>Prix Unitaire Moyen</th>
              <th>Dernier Prix</th>
              <th>% Différence Prix</th>
            </tr>
          </thead>
          <tbody>
            {totalParProduitArray.map((produit, index) => {
              const dernierPrix = lastPrices[items.find(item => item.nom === produit.nom)?.Id_Item ?? 0];
              const valeurActuelle = dernierPrix ? dernierPrix * produit.totalQuantite : "N/A";

              return (
                <tr key={index}>
                  <td>{produit.nom}</td>
                  <td>{produit.totalQuantite.toLocaleString("fr-FR")}</td>
                  <td>{produit.totalValeur.toLocaleString("fr-FR")}</td>
                  <td>{valeurActuelle !== "N/A" ? valeurActuelle.toLocaleString("fr-FR") : valeurActuelle}</td>
                  <td>{calculateDifference(produit.totalValeur, valeurActuelle)}</td>
                  <td>{calculatePercentageDifference(produit.totalValeur, valeurActuelle)}</td>
                  <td>
                    {(produit.totalValeur / produit.totalQuantite).toFixed(2)}
                  </td>
                  <td>{dernierPrix?.toLocaleString("fr-FR") ?? "N/A"}</td>
                  <td>{calculatePercentageDifference(produit.totalValeur / produit.totalQuantite, dernierPrix)}</td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={2}>Total Global</td>
              <td>{totalGlobal.toLocaleString("fr-FR")}</td>
              <td>{totalValeurActuelle.toLocaleString("fr-FR")}</td>
              <td>{calculateDifference(totalGlobal, totalValeurActuelle)}</td>
              <td>{calculatePercentageDifference(totalGlobal, totalValeurActuelle)}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <ToastContainer theme="colored" />
    </div>
  );
};

export default Achats;
