import { useState } from 'react';
import axios from 'axios';

const ItemsPrixTableau = () => {
  const [organizedData, setOrganizedData] = useState([]);

  const organizeDataForTable = (items, prix, achats) => {
    const dataMap = new Map();
    
    items.forEach(item => {
      const prixItem = prix
        .filter(p => p.Id_Item === item.Id_Item)
        .sort((a, b) => new Date(a.Date) - new Date(b.Date)); 
  
      let min = Infinity, max = -Infinity, minDate = '', maxDate = '';
  
      prixItem.forEach(p => {
        const value = parseFloat(p.Prix);
        if (value < min) {
          min = value;
          minDate = new Date(p.Date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
        }
        if (value > max) {
          max = value;
          maxDate = new Date(p.Date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
        }
      });
  
      const moyenne = prixItem.length ? prixItem.reduce((acc, val) => acc + parseFloat(val.Prix), 0) / prixItem.length : 0;
      const median = prixItem.length ? calculateMedian(prixItem.map(p => parseFloat(p.Prix))) : 0;
      const dixDerniers = prixItem.slice(-10).map(p => ({ prix: p.Prix, date: new Date(p.Date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }) }));
      const estActif = achats.some(achat => achat.Id_Item === item.Id_Item && achat.Active === 1);
      
      const prixTries = prix
          .filter(p => p.Id_Item === item.Id_Item)
          .map(p => parseFloat(p.Prix))
          .sort((a, b) => b - a);
    
      const cinqPlusElevés = new Set(prixTries.slice(0, 5));
      const cinqPlusBas = new Set(prixTries.slice(-5));

      dataMap.set(item.Id_Item, {
        nom: item.nom,
        image: item.image,
        min,
        max,
        minDate,
        maxDate,
        moyenne,
        median,
        dixDerniers,
        estActif,
        cinqPlusElevés,
        cinqPlusBas
      });
    });
  
    return Array.from(dataMap.values());
  };

  const calculateMedian = (numbers) => {
    if (numbers.length === 0) return 0;
    const sorted = numbers.sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };

  const fetchData = async () => {
    try {
      const resItems = await axios.get('/api/items');
      const resPrix = await axios.get('/api/prix');
      const resAchats = await axios.get('/api/achats');
      setOrganizedData(organizeDataForTable(resItems.data, resPrix.data, resAchats.data));
    } catch (error) {
      console.error("Erreur lors de la récupération des données", error);
    }
  };


  return (

    <div className='tableau'>
      <button onClick={fetchData}>Récupérer tableau</button>

      <table>
      <thead>
    <tr>
      <th>Item</th>
      <th>Prix Min</th>
      <th>Prix Max</th>
      <th>Prix Moyen</th>
      <th>Prix Médian</th>
      <th colSpan="10">10 Derniers Prix</th>
    </tr>
  </thead>
  <tbody>
  {organizedData.map((item, index) => (
    <tr key={index}>
      <td className={item.estActif ? "nom-produit-actif" : ''}>
        <img className='icone' src={item.image} alt={item.nom} />
        {item.nom}
      </td>
      <td>
        {item.min}
        <br/>
        <i style={{ fontSize: "smaller" }}>({item.minDate})</i>
      </td>
      <td>
        {item.max}
        <br/>
        <i style={{ fontSize: "smaller" }}>({item.maxDate})</i>
      </td>
      <td>{item.moyenne.toFixed(2)}</td>
      <td>{item.median.toFixed(2)}</td>
      {item.dixDerniers.map((dernier, pIndex) => {
  let className = '';
  const prix = parseFloat(dernier.prix);
  if (prix === item.min) {
    className = 'prix-minimum';
  } else if (prix === item.max) {
    className = 'prix-maximum';
  } else if (item.cinqPlusElevés.has(prix)) {
    className = 'prix-eleve';
  } else if (item.cinqPlusBas.has(prix)) {
    className = 'prix-bas';
  }
  return (
    <td key={pIndex} className={className}>
      {dernier.prix}
      <br/>
      <i style={{ fontSize: "smaller" }}>({dernier.date})</i>
    </td>
  );
})}
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
};

export default ItemsPrixTableau;