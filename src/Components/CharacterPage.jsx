import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import TavernBackground from '../assets/backgroundImages/TavernBackground.jpg';
import Chantorage1 from '../assets/backgroundImages/chantorage1.jpg';
import Chantorage2 from '../assets/backgroundImages/chantorage2.jpg';
import Chantorage3 from '../assets/backgroundImages/chantorage3.jpg';
import Chantorage4 from '../assets/backgroundImages/chantorage4.jpg';
import Stormwind from '../assets/backgroundImages/stormwind.jpg';
import NagrandBC from '../assets/backgroundImages/nagrandBC.jpg';

const CharacterPage = () => {
  const { realm, characterName } = useParams(); 
  const [profileData, setProfileData] = useState(null);
  const [mediaData, setMediaData] = useState(null);
  const [achievementsSummaryData, setAchievementsSummaryData] = useState(null);
  const [achievementsStatisticsData, setAchievementsStatisticsData] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(TavernBackground);

  console.log(profileData);
  console.log(mediaData);
  console.log(achievementsSummaryData);
  console.log(achievementsStatisticsData);

  useEffect(() => {
    
    Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/character/appearance/${realm}/${characterName}`),
      axios.get(`${import.meta.env.VITE_API_URL}/character/media/${realm}/${characterName}`),
      axios.get(`${import.meta.env.VITE_API_URL}/character/achievements/summary/${realm}/${characterName}`),
      axios.get(`${import.meta.env.VITE_API_URL}/character/achievements/statistics/${realm}/${characterName}`)
    ]).then(([profileResponse, mediaResponse, achievementsSummaryResponse, achievementsStatisticsResponse ]) => {
      setProfileData(profileResponse.data);
      setMediaData(mediaResponse.data);
      setAchievementsSummaryData(achievementsSummaryResponse.data);
      setAchievementsStatisticsData(achievementsStatisticsResponse.data);
      console.log(achievementsSummaryResponse.data);
      console.log(achievementsStatisticsResponse.data);
    }).catch(error => console.error(error));
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
        newBackground = allBackgrounds[Math.floor(Math.random() * allBackgrounds.length)];
      } while (newBackground === backgroundImage); 
      setBackgroundImage(newBackground);
    }
  };

return (

  <div className='characterPage' style={{ backgroundImage: `url(${backgroundImage})` }}>
    <button onClick={() => changeBackground()} className="change-background-btn">
        Modifier background
      </button>
    {profileData && (
      <div className='character'>
        <div className='name'>{profileData.character.name}</div>
        <div className='raceAndClass'>{profileData.playable_race.name} / {profileData.playable_class.name}</div>
        <div>level {profileData.character.level}</div>
      </div>
    )}
    {mediaData && (
      <div 
          className={`profilePicture-${profileData.character.name}`} 
          style={{ 
            backgroundImage: `url(${mediaData.assets[2].value})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}>
        </div>
    )}
  </div>
);
};

export default CharacterPage;