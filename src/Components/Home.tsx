import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import loader from "../assets/warcraft.png";

interface CharacterImageMap {
  [key: string]: string | null;
}

interface Character {
  realm: string;
  name: string;
  faction: "alliance" | "horde";
}

interface ItemNames {
  upload: string;
  tableau: string;
  achats: string;
  token: string;
  itemsList: string;
  visitor: string;
  logout: string; 
}

const Home: React.FC = () => {
  const [characterImages, setCharacterImages] = useState<CharacterImageMap>({});
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = Boolean(localStorage.getItem("token")); // Vérifie si l'utilisateur est connecté
  const baseIconUrl = "https://render.worldofwarcraft.com/eu/icons/56";
  const username = localStorage.getItem("username") || "";
  const navigate = useNavigate();

  const itemNames: ItemNames = {
    upload: "inv_ammo_arrow_02",
    tableau: "inv_misc_coin_02",
    achats: "inv_misc_bag_07",
    token: "wow_token01",
    itemsList: "inv_inscription_runescrolloffortitude_yellow",
    visitor: "inv_misc_questionmark",
    logout: "inv_pant_mail_raidshaman_q_01",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleGrayedLinkClick = () => {
    alert("Veuillez vous identifier pour accéder à toutes les fonctionnalités.");
  };

  useEffect(() => {
    const fetchCharacterImage = async (realm: string, characterName: string) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/character/media/${realm}/${characterName}`
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
        { realm: "uldaman", name: "thryndil", faction: "alliance" },
        { realm: "uldaman", name: "olbia", faction: "horde" },
        { realm: "uldaman", name: "lukki", faction: "alliance" },
        { realm: "uldaman", name: "schystor", faction: "alliance" },
        { realm: "uldaman", name: "sharubu", faction: "alliance" },
        { realm: "uldaman", name: "falak", faction: "horde" },
        { realm: "uldaman", name: "hexza", faction: "alliance" },
        { realm: "khaz-modan", name: "morcart", faction: "horde" },
        { realm: "uldaman", name: "yocjan", faction: "horde" },
      ];

      setCharacters(characters);

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
        <img src={loader} alt="Loading..." className="loader" />
      ) : (
        <div>
          <h1 className="title">World of WarCraft</h1>
          {isAuthenticated && (
            <h2 className="welcome-message">
              Bienvenue, {username} !
            </h2>
          )}
          <section className={`carousel ${!isAuthenticated ? "centered" : ""}`}>
            {!isAuthenticated ? (
              <>
                <div className="non-character-icons">
                <Link  to="/auth">
                  <img
                    src={`${baseIconUrl}/${itemNames.visitor}.jpg`}
                    className="logo logo-auth"
                    alt="s'authentifier"
                  />
                </Link>
                </div>
                <div className="non-character-icons small-links">
                  <div onClick={handleGrayedLinkClick}>
                    <img
                      src={`${baseIconUrl}/${itemNames.upload}.jpg`}
                      className="logo logo-upload"
                      alt="Upload"
                    />
                  </div>
                  <div onClick={handleGrayedLinkClick}>
                    <img
                      src={`${baseIconUrl}/${itemNames.tableau}.jpg`}
                      className="logo logo-tableau"
                      alt="Tableau"
                    />
                  </div>
                  <div onClick={handleGrayedLinkClick}>
                    <img
                      src={`${baseIconUrl}/${itemNames.achats}.jpg`}
                      className="logo logo-achats"
                      alt="Achats"
                    />
                  </div>
                  <div onClick={handleGrayedLinkClick}>
                    <img
                      src={`${baseIconUrl}/${itemNames.token}.jpg`}
                      className="logo logo-token"
                      alt="Token"
                    />
                  </div>
                  <div onClick={handleGrayedLinkClick}>
                    <img
                      src={`${baseIconUrl}/${itemNames.itemsList}.jpg`}
                      className="logo logo-itemsList"
                      alt="Items Status"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="logout-container">
                  <img
                    src={`${baseIconUrl}/${itemNames.logout}.jpg`}
                    className="logo logo-logout"
                    alt="Déconnexion"
                    onClick={handleLogout}
                  />
                </div>
                <div className="non-character-icons">
                  <Link to="/upload">
                    <img
                      src={`${baseIconUrl}/${itemNames.upload}.jpg`}
                      className="logo logo-upload"
                      alt="Upload"
                    />
                  </Link>
                  <Link to="/tableau">
                    <img
                      src={`${baseIconUrl}/${itemNames.tableau}.jpg`}
                      className="logo logo-tableau"
                      alt="Tableau"
                    />
                  </Link>
                  <Link to="/achats">
                    <img
                      src={`${baseIconUrl}/${itemNames.achats}.jpg`}
                      className="logo logo-achats"
                      alt="Achats"
                    />
                  </Link>
                  <Link to="/token">
                    <img
                      src={`${baseIconUrl}/${itemNames.token}.jpg`}
                      className="logo logo-token"
                      alt="Token"
                    />
                  </Link>
                  <Link to="/items-status">
                    <img
                      src={`${baseIconUrl}/${itemNames.itemsList}.jpg`}
                      className="logo logo-itemsList"
                      alt="Items Status"
                    />
                  </Link>
                </div>
                <div className="character-icons">
                  {Object.entries(characterImages).map(([name, imageUrl]) => {
                    const character = characters.find((char) => char.name === name);
                    return (
                      <Link key={name} to={`/${character?.realm}/${name}`}>
                        <img
                          src={imageUrl ?? ""}
                          className={`logo logo-character ${character?.faction}`}
                          alt={`${name} character`}
                        />
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default Home;
