import { useState, useEffect } from 'react';
import axios from 'axios';


const Achats = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [prixUnitaire, setPrixUnitaire] = useState('');
  const [quantite, setQuantite] = useState('');
  const [achats, setAchats] = useState([]);

  const totalParProduit = achats
  .filter(achat => achat.Active === 1)
  .reduce((acc, achat) => {
    if (!acc[achat.nom]) {
      acc[achat.nom] = { totalQuantite: 0, totalValeur: 0 };
    }
    acc[achat.nom].totalQuantite += achat.Quantite;
    acc[achat.nom].totalValeur += achat.Quantite * achat.PrixUnitaire;
    return acc;
  }, {});

  const totalParProduitArray = Object.keys(totalParProduit).map(nom => ({
    nom,
    totalQuantite: totalParProduit[nom].totalQuantite,
    totalValeur: totalParProduit[nom].totalValeur
  }));

  useEffect(() => {
    // Récupérer les items
    axios.get('/api/items')
      .then(response => {
        setItems(response.data);
  
        // Récupérer les achats existants après avoir récupéré les items
        axios.get('/api/achats')
          .then(achatsResponse => {
            const achatsAvecNom = achatsResponse.data.map(achat => {
              const nomItem = response.data.find(item => item.Id_Item === achat.Id_Item)?.nom;
              return { ...achat, nom: nomItem };
            });
            setAchats(achatsAvecNom);
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  }, []);

  const handleSubmit = () => {
    const nomItem = items.find(item => item.Id_Item === selectedItem)?.nom;
    const achatData = {
      Id_Item: selectedItem,
      PrixUnitaire: prixUnitaire,
      Quantite: quantite,
      DateAchat: new Date().toISOString().slice(0, 10), // Date du jour
      nom: nomItem // Ajout du nom du produit
    };

    axios.post('/api/ajouterAchat', achatData)
      .then(() => {
        setAchats([...achats, {...achatData, nom: items.find(item => item.Id_Item === selectedItem)?.nom}]);
        setSelectedItem('');
        setPrixUnitaire('');
        setQuantite('');
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="achats-container">
      <div className="input-group">
        <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)}>
          <option value="">Sélectionnez un produit</option>
          {items.map(item => (
            <option key={item.Id_Item} value={item.Id_Item}>{item.nom}</option>
          ))}
        </select>
        <input type="number" value={prixUnitaire} onChange={e => setPrixUnitaire(e.target.value)} placeholder="Prix unitaire" />
        <input type="number" value={quantite} onChange={e => setQuantite(e.target.value)} placeholder="Quantité" />
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
          {achats.map((achat, index) => (
            <tr key={index}>
              <td>{achat.nom}</td>
              <td>{achat.PrixUnitaire.toLocaleString('fr-FR')}</td>
              <td>{achat.Quantite.toLocaleString('fr-FR')}</td>
              <td>{(achat.PrixUnitaire * achat.Quantite).toLocaleString('fr-FR')}</td>
              <td>{new Date(achat.DateAchat).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}</td>
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
        </tr>
      </thead>
      <tbody>
        {totalParProduitArray.map((produit, index) => (
          <tr key={index}>
            <td>{produit.nom}</td>
            <td>{produit.totalQuantite.toLocaleString('fr-FR')}</td>
            <td>{produit.totalValeur.toLocaleString('fr-FR')}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

export default Achats;