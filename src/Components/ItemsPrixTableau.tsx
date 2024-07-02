import { useState } from "react";
import axios from "axios";

interface Item {
  Id_Item: number;
  nom: string;
  image: string;
}

interface Prix {
  Id_Item: number;
  Date: string;
  Prix: string;
}

interface Achat {
  Id_Item: number;
  Active: number;
}

interface OrganizedData {
  nom: string;
  image: string;
  min: number;
  max: number;
  minDate: string;
  maxDate: string;
  moyenne: number;
  median: number;
  dixDerniers: { prix: string; date: string }[];
  estActif: boolean;
  cinqPlusEleves: Set<number>;
  cinqPlusBas: Set<number>;
  sixAuDixPlusEleves: Set<number>;
  sixAuDixPlusFaibles: Set<number>;
  onzeAuVingtPlusEleves: Set<number>;
  onzeAuVingtPlusFaibles: Set<number>;
}

const ItemsPrixTableau: React.FC = () => {
  const [organizedData, setOrganizedData] = useState<OrganizedData[]>([]);

  const organizeDataForTable = (items: Item[], prix: Prix[], achats: Achat[]): OrganizedData[] => {
    const dataMap = new Map<number, OrganizedData>();

    items.forEach((item) => {
      const prixItem = prix
        .filter((p) => p.Id_Item === item.Id_Item)
        .sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());

      let min = Infinity,
        max = -Infinity,
        minDate = "",
        maxDate = "";

      prixItem.forEach((p) => {
        const value = parseFloat(p.Prix);
        if (value < min) {
          min = value;
          minDate = new Date(p.Date).toLocaleDateString("fr-FR", {
            month: "short",
            day: "numeric",
          });
        }
        if (value > max) {
          max = value;
          maxDate = new Date(p.Date).toLocaleDateString("fr-FR", {
            month: "short",
            day: "numeric",
          });
        }
      });

      const moyenne = prixItem.length
        ? prixItem.reduce((acc, val) => acc + parseFloat(val.Prix), 0) /
          prixItem.length
        : 0;
      const median = prixItem.length
        ? calculateMedian(prixItem.map((p) => parseFloat(p.Prix)))
        : 0;
      const dixDerniers = prixItem
        .slice(-10)
        .map((p) => ({
          prix: p.Prix,
          date: new Date(p.Date).toLocaleDateString("fr-FR", {
            month: "short",
            day: "numeric",
          }),
        }));
      const estActif = achats.some(
        (achat) => achat.Id_Item === item.Id_Item && achat.Active === 1
      );

      const prixTries = prix
        .filter((p) => p.Id_Item === item.Id_Item)
        .map((p) => parseFloat(p.Prix))
        .sort((a, b) => b - a);

      const cinqPlusEleves = new Set(prixTries.slice(0, 5));
      const cinqPlusBas = new Set(prixTries.slice(-5));
      const sixAuDixPlusEleves = new Set(prixTries.slice(5, 10));
      const sixAuDixPlusFaibles = new Set(prixTries.slice(-10, -5));
      const onzeAuVingtPlusEleves = new Set(prixTries.slice(20, 10));
      const onzeAuVingtPlusFaibles = new Set(prixTries.slice(-20, -10));

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
        cinqPlusEleves,
        cinqPlusBas,
        sixAuDixPlusEleves,
        sixAuDixPlusFaibles,
        onzeAuVingtPlusEleves,
        onzeAuVingtPlusFaibles,
      });
    });

    return Array.from(dataMap.values());
  };

  const calculateMedian = (numbers: number[]): number => {
    if (numbers.length === 0) return 0;
    const sorted = numbers.sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  };

  const fetchData = async () => {
    try {
      const resItems = await axios.get(`${import.meta.env.VITE_API_URL}/items`);
      const resPrix = await axios.get(`${import.meta.env.VITE_API_URL}/prix`);
      const resAchats = await axios.get(`${import.meta.env.VITE_API_URL}/achats`);
      setOrganizedData(
        organizeDataForTable(resItems.data, resPrix.data, resAchats.data)
      );
    } catch (error) {
      console.error("Erreur lors de la récupération des données", error);
    }
  };

  return (
    <div className="tableau">
      <button onClick={fetchData}>Récupérer tableau</button>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Prix Min</th>
            <th>Prix Max</th>
            <th>Prix Moyen</th>
            <th>Prix Médian</th>
            <th colSpan={10}>10 Derniers Prix</th>
          </tr>
        </thead>
        <tbody>
          {organizedData.map((item, index) => (
            <tr key={index}>
              <td className={item.estActif ? "nom-produit-actif" : ""}>
                <img className="icone" src={item.image} alt={item.nom} />
                {item.nom}
              </td>
              <td className="prix-min">
                {item.min}
                <br />
                <i style={{ fontSize: "smaller" }}>({item.minDate})</i>
              </td>
              <td className="prix-max">
                {item.max}
                <br />
                <i style={{ fontSize: "smaller" }}>({item.maxDate})</i>
              </td>
              <td className="moyenne">{item.moyenne.toFixed(2)}</td>
              <td className="median">{item.median.toFixed(2)}</td>
              {item.dixDerniers.map((dernier, pIndex) => {
                let className = "";
                const prix = parseFloat(dernier.prix);
                if (prix === item.min) {
                  className = "prix-minimum";
                } else if (prix === item.max) {
                  className = "prix-maximum";
                } else if (item.cinqPlusEleves.has(prix)) {
                  className = "prix-eleve";
                } else if (item.cinqPlusBas.has(prix)) {
                  className = "prix-bas";
                } else if (item.sixAuDixPlusEleves.has(prix)) {
                  className = "prix-six-au-dix-eleve";
                } else if (item.sixAuDixPlusFaibles.has(prix)) {
                  className = "prix-six-au-dix-faible";
                } else if (item.onzeAuVingtPlusEleves.has(prix)) {
                  className = "prix-onze-au-vingt-eleve";
                } else if (item.onzeAuVingtPlusFaibles.has(prix)) {
                  className = "prix-onze-au-vingt-faible";
                } 
                return (
                  <td key={pIndex} className={className}>
                    {dernier.prix}
                    <br />
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
