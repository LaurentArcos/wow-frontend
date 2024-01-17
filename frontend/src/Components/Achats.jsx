import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Achats = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [prixUnitaire, setPrixUnitaire] = useState("");
  const [quantite, setQuantite] = useState("");
  const [achats, setAchats] = useState([]);
  

  const totalParProduit = achats
    .filter((achat) => achat.Active === 1)
    .reduce((acc, achat) => {
      if (!acc[achat.nom]) {
        acc[achat.nom] = { totalQuantite: 0, totalValeur: 0 };
      }
      acc[achat.nom].totalQuantite += achat.Quantite;
      acc[achat.nom].totalValeur += achat.Quantite * achat.PrixUnitaire;
      return acc;
    }, {});

  const totalParProduitArray = Object.keys(totalParProduit).map((nom) => ({
    nom,
    totalQuantite: totalParProduit[nom].totalQuantite,
    totalValeur: totalParProduit[nom].totalValeur,
  }));
  const totalGlobal = totalParProduitArray.reduce((acc, produit) => acc + produit.totalValeur, 0);
  useEffect(() => {
    axios
      .get("/api/items")
      .then((response) => {
        setItems(response.data);

        axios
          .get("/api/achats")
          .then((achatsResponse) => {
            const achatsAvecNomEtImage = achatsResponse.data.map((achat) => {
              const itemCorrespondant = response.data.find(
                (item) => item.Id_Item === achat.Id_Item
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
    const nomItem = items.find((item) => item.Id_Item === selectedItem)?.nom;
    const achatData = {
      Id_Item: selectedItem,
      PrixUnitaire: prixUnitaire,
      Quantite: quantite,
      DateAchat: new Date().toISOString().slice(0, 10), 
      nom: nomItem,
    };

    axios
      .post("/api/ajouterAchat", achatData)
      .then(() => {
        setAchats([
          ...achats,
          {
            ...achatData,
            nom: items.find((item) => item.Id_Item === selectedItem)?.nom,
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

  const desactiverAchat = (id) => {
    axios
      .post("/api/modifierAchatActive", { id })
      .then(() => {
        setAchats(
          achats.map((achat) => {
            if (achat.Id === id) {
              return { ...achat, Active: 0 };
            }
            return achat;
          })
        );
        toast.success("Achat marqué comme revendu.");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Erreur lors de la mise à jour de l'achat.");
      });
  };

  return (
    <div className="achats-container">
      <div className="input-group">
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
          onChange={(e) => setPrixUnitaire(e.target.value)}
          placeholder="Prix unitaire"
        />
        <input
          type="number"
          value={quantite}
          onChange={(e) => setQuantite(e.target.value)}
          placeholder="Quantité"
        />
        <button onClick={handleSubmit}>Ajouter</button>
      </div>
      <table>
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
                  <button onClick={() => desactiverAchat(achat.Id)}>
                    Revendu !
                  </button >
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <table>
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
            <td>{(produit.totalValeur/produit.totalQuantite).toFixed(2)}</td>
          </tr>
        ))}
        <tr>
          <td colSpan="2">Total Global</td>
          <td>{totalGlobal.toLocaleString("fr-FR")}</td>
        </tr>
      </tbody>
    </table>
    <ToastContainer theme="colored" />
  </div>
);
};

export default Achats;
