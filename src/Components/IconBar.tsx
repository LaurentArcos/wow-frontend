import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

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
  home: string;
  itemsList: string;
}

const IconBar: React.FC = () => {
  const [characterImages, setCharacterImages] = useState<CharacterImageMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const baseIconUrl = "https://render.worldofwarcraft.com/eu/icons/56";

  const itemNames: ItemNames = {
    upload: "inv_ammo_arrow_02",
    tableau: "inv_misc_coin_02",
    achats: "inv_misc_bag_07",
    token: "wow_token01",
    home: "inv_misc_tournaments_banner_human",
    itemsList: "inv_inscription_runescrolloffortitude_yellow",
  };

  useEffect(() => {
    const fetchCharacterImage = async (
      realm: string,
      characterName: string
    ) => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/character/media/${realm}/${characterName}`
        );
        return response.data.assets[0].value;
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    const loadCharacterImages = async () => {
      setIsLoading(true);
      const characters: Character[] = [
        { realm: "uldaman", name: "thryndil" },
        { realm: "uldaman", name: "olbia" },
        { realm: "uldaman", name: "lukki" },
        { realm: "uldaman", name: "sharubu" },
        { realm: "uldaman", name: "falak" },
        { realm: "uldaman", name: "hexza" },
        { realm: "khaz-modan", name: "thenerol" },
      ];

      const images: CharacterImageMap = {};
      for (const character of characters) {
        images[character.name] = await fetchCharacterImage(
          character.realm,
          character.name
        );
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
            <img
              src={`${baseIconUrl}/${itemNames.home}.jpg`}
              className="iconbar-icon"
              alt="Home"
            />
          </Link>
          <Link to="/upload">
            <img
              src={`${baseIconUrl}/${itemNames.upload}.jpg`}
              className="iconbar-icon"
              alt="Upload"
            />
          </Link>
          <Link to="/tableau">
            <img
              src={`${baseIconUrl}/${itemNames.tableau}.jpg`}
              className="iconbar-icon"
              alt="Tableau"
            />
          </Link>
          <Link to="/achats">
            <img
              src={`${baseIconUrl}/${itemNames.achats}.jpg`}
              className="iconbar-icon"
              alt="Achats"
            />
          </Link>
          <Link to="/token">
            <img
              src={`${baseIconUrl}/${itemNames.token}.jpg`}
              className="iconbar-icon"
              alt="Token"
            />
          </Link>
          <Link to="/items-status">
            <img
              src={`${baseIconUrl}/${itemNames.itemsList}.jpg`}
              className="iconbar-icon"
              alt="Items Status"
            />
          </Link>
          {Object.entries(characterImages).map(([name, imageUrl]) => (
            <Link key={name} to={`/uldaman/${name}`}>
              <img
                src={imageUrl ?? ""}
                className="iconbar-icon"
                alt={`${name} character`}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default IconBar;
