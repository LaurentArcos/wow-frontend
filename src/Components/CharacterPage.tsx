import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import TavernBackground from "../assets/backgroundImages/TavernBackground.jpg";
import Chantorage1 from "../assets/backgroundImages/chantorage1.jpg";
import Chantorage2 from "../assets/backgroundImages/chantorage2.jpg";
import Chantorage3 from "../assets/backgroundImages/chantorage3.jpg";
import Chantorage4 from "../assets/backgroundImages/chantorage4.jpg";
import Stormwind from "../assets/backgroundImages/stormwind.jpg";
import NagrandBC from "../assets/backgroundImages/nagrandBC.jpg";

// Define types for the data structures
interface Character {
  name: string;
  level: number;
}

interface PlayableRace {
  name: string;
}

interface PlayableClass {
  name: string;
}

interface ActiveSpec {
  name: string;
}

interface ProfileData {
  character: Character;
  playable_race: PlayableRace;
  playable_class: PlayableClass;
  active_spec: ActiveSpec;
}

interface MediaData {
  assets: { value: string }[];
}

interface AchievementsData {
  // pour plus tard
}

const CharacterPage: React.FC = () => {
  const { realm, characterName } = useParams<{
    realm: string;
    characterName: string;
  }>();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [mediaData, setMediaData] = useState<MediaData | null>(null);
  const [achievementsSummaryData, setAchievementsSummaryData] =
    useState<AchievementsData | null>(null);
  const [achievementsStatisticsData, setAchievementsStatisticsData] =
    useState<AchievementsData | null>(null);
  const [backgroundImage, setBackgroundImage] = useState(TavernBackground);

  console.log("Profile Data:", profileData);
  console.log("Media Data:", mediaData);
  console.log("Achievements Summary Data:", achievementsSummaryData);
  console.log("Achievements Statistics Data:", achievementsStatisticsData);

  useEffect(() => {
    Promise.all([
      axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/character/appearance/${realm}/${characterName}`
      ),
      axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/character/media/${realm}/${characterName}`
      ),
      axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/character/achievements/summary/${realm}/${characterName}`
      ),
      axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/character/achievements/statistics/${realm}/${characterName}`
      ),
    ])
      .then(
        ([
          profileResponse,
          mediaResponse,
          achievementsSummaryResponse,
          achievementsStatisticsResponse,
        ]) => {
          setProfileData(profileResponse.data);
          setMediaData(mediaResponse.data);
          setAchievementsSummaryData(achievementsSummaryResponse.data);
          setAchievementsStatisticsData(achievementsStatisticsResponse.data);
          console.log("Achievements Summary Response:", achievementsSummaryResponse.data);
          console.log("Achievements Statistics Response:", achievementsStatisticsResponse.data);
        }
      )
      .catch((error) => console.error(error));
  }, [realm, characterName]);

  const backgrounds = [
    TavernBackground,
    Chantorage1,
    Chantorage2,
    Chantorage3,
    Chantorage4,
    Stormwind,
    NagrandBC,
  ];

  const changeBackground = () => {
    if (backgroundImage === TavernBackground) {
      const randomIndex = Math.floor(Math.random() * backgrounds.length);
      setBackgroundImage(backgrounds[randomIndex]);
    } else {
      const allBackgrounds = [TavernBackground, ...backgrounds];
      let newBackground;
      do {
        newBackground =
          allBackgrounds[Math.floor(Math.random() * allBackgrounds.length)];
      } while (newBackground === backgroundImage);
      setBackgroundImage(newBackground);
    }
  };

  return (
    <div
      className="characterPage"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <button
        onClick={() => changeBackground()}
        className="change-background-btn"
      >
        Modifier background
      </button>
      {profileData && (
        <div className="character">
          <h2 className="name">{profileData.character.name}</h2>
          <div className="race">{profileData.playable_race.name}</div>
          <div className="class">
            {profileData.playable_class.name}{" "}
            <span className="spec">({profileData.active_spec.name})</span>
          </div>
          {/* <div>level {profileData.character.level}</div> */}
        </div>
      )}
      {mediaData && (
        //* Attention pour afficher les images de spersonnages il faut également modifier le css
        <div
          className={`profilePicture-${profileData?.character.name}`}
          style={{
            backgroundImage: `url(${mediaData.assets[2]?.value})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      )}
    </div>
  );
};

export default CharacterPage;
