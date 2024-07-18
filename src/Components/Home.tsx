import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import loader from "../assets/warcraft.png";

// Define types for character images and item names
interface CharacterImageMap {
  [key: string]: string | null;
}

interface Character {
  realm: string;
  name: string;
}

interface ItemNames {
  upload: string;
  tableau: string;
  achats: string;
  token: string;
  itemsList: string;
}

const Home: React.FC = () => {
  const [characterImages, setCharacterImages] = useState<CharacterImageMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const baseIconUrl = "https://render.worldofwarcraft.com/eu/icons/56";

  const itemNames: ItemNames = {
    upload: 'inv_ammo_arrow_02',
    tableau: 'inv_misc_coin_02',
    achats: 'inv_misc_bag_07',
    token: 'wow_token01',
    itemsList: 'inv_inscription_runescrolloffortitude_yellow'
  }; 

  useEffect(() => {
    const fetchCharacterImage = async (realm: string, characterName: string) => {
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
      const characters: Character[] = [
        { realm: 'uldaman', name: 'thryndil' },
        { realm: 'uldaman', name: 'olbia' },
        { realm: 'uldaman', name: 'lukki' },
        { realm: 'uldaman', name: 'sharubu' },
        { realm: 'uldaman', name: 'falak' },
      ];

      const images: CharacterImageMap = {};
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
        <h1 className='title'>World of WarCraft</h1>
        <section className="carousel">
          <Link to="/upload">
            <img src={`${baseIconUrl}/${itemNames.upload}.jpg`} className="logo logo-upload" alt="Upload" />
          </Link>
          <Link to="/tableau">
            <img src={`${baseIconUrl}/${itemNames.tableau}.jpg`} className="logo logo-tableau" alt="Tableau" />
          </Link>
          <Link to="/achats">
            <img src={`${baseIconUrl}/${itemNames.achats}.jpg`} className="logo logo-achats" alt="Achats" />
          </Link>
          <Link to="/token">
            <img src={`${baseIconUrl}/${itemNames.token}.jpg`} className="logo logo-token" alt="Token" />
          </Link>
          <Link to="/items-status">
            <img src={`${baseIconUrl}/${itemNames.itemsList}.jpg`} className="logo logo-itemsList" alt="Items Status" />
          </Link>
          {Object.entries(characterImages).map(([name, imageUrl]) => (
            <Link key={name} to={`/uldaman/${name}`}>
              <img src={imageUrl ?? ''} className={`logo logo-${name}`} alt={`${name} character`} />
            </Link>
          ))}
        </section>
        </div>
      )}
    </div>
  );
}

export default Home;
