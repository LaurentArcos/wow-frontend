import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const IconBar = () => {
const [characterImages, setCharacterImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const baseIconUrl = "https://render.worldofwarcraft.com/eu/icons/56";

  const itemNames = {
    upload: 'inv_ammo_arrow_02',
    tableau: 'inv_misc_coin_02',
    achats: 'inv_misc_bag_07',
    token: 'wow_token01',
    home: 'inv_misc_tournaments_banner_human'
  };

  useEffect(() => {
    const fetchCharacterImage = async (realm, characterName) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/character/media/${realm}/${characterName}`);
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
        { realm: 'uldaman', name: 'sharubu' },
        { realm: 'uldaman', name: 'falak' },
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
        <p></p>
        ) : (
    <div className="icon-bar">
      <Link to="/">
        <img src={`${baseIconUrl}/${itemNames.home}.jpg`} className="iconbar-icon" alt="Home" />
      </Link>
      <Link to="/upload">
        <img src={`${baseIconUrl}/${itemNames.upload}.jpg`} className="iconbar-icon" alt="Upload" />
      </Link>
      <Link to="/tableau">
        <img src={`${baseIconUrl}/${itemNames.tableau}.jpg`} className="iconbar-icon" alt="Tableau" />
      </Link>
      <Link to="/achats">
        <img src={`${baseIconUrl}/${itemNames.achats}.jpg`} className="iconbar-icon" alt="Achats" />
      </Link>
      <Link to="/token">
        <img src={`${baseIconUrl}/${itemNames.token}.jpg`} className="iconbar-icon" alt="Token" />
      </Link>
      {Object.entries(characterImages).map(([name, imageUrl]) => (
        <Link key={name} to={`/uldaman/${name}`}>
          <img src={imageUrl} className="iconbar-icon" alt={`${name} character`} />
        </Link>
      ))}
        </div>
      )}
    </div>
  );
}

export default IconBar;