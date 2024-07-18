import { useEffect, useState } from "react";
import axios from "axios";

interface TokenData {
  price: string;
  lastUpdated: string;
}

const Token: React.FC = () => {
  const [tokenData, setTokenData] = useState<TokenData>({
    price: "0.00",
    lastUpdated: "",
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/tokeninfo`)
      .then((response) => {
        const priceFormatted = (response.data.price / 10000000).toLocaleString(
          "fr-FR",
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        );
        const dateUpdated = new Date(
          response.data.last_updated_timestamp
        ).toLocaleString("fr-FR", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        setTokenData({ price: priceFormatted, lastUpdated: dateUpdated });
      })
      .catch((error) => {
        console.error("Error fetching token data:", error);
      });
  }, []);

  return (
    <div>
      <h2>TOKEN</h2>
      <section>
        <p className="token-price">{tokenData.price}</p>
        <p className="token-date">
          Dernière mise à jour : {tokenData.lastUpdated}
        </p>
      </section>
    </div>
  );
};

export default Token;
