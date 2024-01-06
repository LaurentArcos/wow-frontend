import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import loader from "../assets/warcraft.png"

const Home = () => {
  const [characterImages, setCharacterImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const baseIconUrl = "https://render.worldofwarcraft.com/eu/icons/56";

  const itemNames = {
    upload: 'inv_ammo_arrow_02',
    tableau: 'inv_misc_coin_02',
    achats: 'inv_misc_bag_07',
    token: 'wow_token01'
  };

  useEffect(() => {
    const fetchCharacterImage = async (realm, characterName) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/character/media/${realm}/${characterName}`);
        return response.data.assets[0].value;
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    const loadCharacterImages = async () => {
      setIsLoading(true); 
      const characters = [
        { realm: 'uldaman', name: 'thryndil' },
        { realm: 'uldaman', name: 'olbia' },
        { realm: 'uldaman', name: 'lukki' },
      ];

      const images = {};
      for (const character of characters) {
        images[character.name] = await fetchCharacterImage(character.realm, character.name);
      }
      setCharacterImages(images);
      setIsLoading(false);
    };

    loadCharacterImages();
  }, []);

  return (
    <div>
      {isLoading ? (
        <img src={loader} alt="Loading..." className="loader" />
        ) : (
        <div>  
        <h1 className='title'>World of Warcraft</h1>
        <div className="carousel">
          <Link to="/upload">
            <img src={`${baseIconUrl}/${itemNames.upload}.jpg`} className="logo" alt="Upload" />
          </Link>
          <Link to="/tableau">
            <img src={`${baseIconUrl}/${itemNames.tableau}.jpg`} className="logo" alt="Tableau" />
          </Link>
          <Link to="/achats">
            <img src={`${baseIconUrl}/${itemNames.achats}.jpg`} className="logo" alt="Achats" />
          </Link>
          <Link to="/token">
            <img src={`${baseIconUrl}/${itemNames.token}.jpg`} className="logo" alt="Token" />
          </Link>
        {Object.entries(characterImages).map(([name, imageUrl]) => (
          <Link key={name} to={`/uldaman/${name}`}>
            <img src={imageUrl} className="logo" alt={`${name} character`} />
          </Link>
        ))}
        </div></div>
      )}
    </div>
  );
}

export default Home;