import { useState } from 'react';
import axios from 'axios';

const ItemsPrixTableau = () => {
  const [organizedData, setOrganizedData] = useState([]);
  const [maxPriceCount, setMaxPriceCount] = useState(0);

  const organizeDataForTable = (items, prix) => {
    const dataMap = new Map();
    let maxCount = 0;
  
    items.forEach(item => {
      dataMap.set(item.Id_Item, {
        nom: item.nom,
        image: item.image, // Ajoutez cette ligne pour inclure l'URL de l'image
        prix: []
      });
    });
    prix.forEach(prixEntry => {
      const itemData = dataMap.get(prixEntry.Id_Item);
      if (itemData) {
        const dateObj = new Date(prixEntry.Date);
        const localDate = dateObj.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }).replace(/\s/g, ' '); // Format "23 déc"
      itemData.prix.push({
        valeur: prixEntry.Prix,
        date: localDate
      });
        maxCount = Math.max(maxCount, itemData.prix.length);
      }
    });
  
    setMaxPriceCount(maxCount);
    return Array.from(dataMap.values());
  };

  const fetchData = async () => {
    try {
      const resItems = await axios.get('/api/items');
      const resPrix = await axios.get('/api/prix');
      setOrganizedData(organizeDataForTable(resItems.data, resPrix.data));
    } catch (error) {
      console.error("Erreur lors de la récupération des données", error);
    }
  };

  const findExtremePrices = (prix) => {
    let min = Infinity;
    let max = -Infinity;
    prix.forEach(p => {
      if (p.valeur < min) min = p.valeur;
      if (p.valeur > max) max = p.valeur;
    });
    return { min, max };
  };


  return (
    <div className='tableau'>
      <button onClick={fetchData}>Récupérer tableau</button>

      <table>
      <tbody>
          {organizedData.map((item, index) => {
            const { min, max } = findExtremePrices(item.prix);
            return (
              <tr key={index}>
                <td>
                  <img src={item.image} alt={item.nom} />
                  {item.nom}
                </td>
                {[...Array(maxPriceCount)].map((_, pIndex) => {
                  const prixInfo = item.prix[pIndex];
                  let className = '';
                  if (prixInfo) {
                    if (prixInfo.valeur === max) {
                      className = 'prix-maximum';
                    } else if (prixInfo.valeur === min) {
                      className = 'prix-minimum';
                    }
                  }
                  return (
                    <td key={pIndex} className={className}>
                    {prixInfo ? (
                      <span>
                        <p className='prix'>{prixInfo.valeur}</p> <i>({prixInfo.date})</i>
                      </span>
                    ) : (
                      '-'
                    )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ItemsPrixTableau;