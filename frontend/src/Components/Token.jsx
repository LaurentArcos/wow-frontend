import { useEffect, useState } from 'react';
import axios from 'axios';

const Token = () => {
    const [tokenData, setTokenData] = useState({price: 0, lastUpdated: ''});

    useEffect(() => {
        axios.get('http://localhost:8080/api/tokeninfo')
            .then(response => {
                const priceFormatted = (response.data.price / 10000000).toLocaleString('fr-FR');
                const dateUpdated = new Date(response.data.last_updated_timestamp).toLocaleString('fr-FR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                setTokenData({price: priceFormatted, lastUpdated: dateUpdated});
            })
            .catch(error => {
                console.error("Error fetching token data:", error);
            });
    }, []);

    return (

        <div>
            <p>Prix du Token : {tokenData.price}</p>
            <p>Dernière mise à jour : {tokenData.lastUpdated}</p>
        </div>
    );
}

export default Token;