import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CharacterPage = () => {
  const [profileData, setProfileData] = useState(null);
  const [mediaData, setMediaData] = useState(null);
  const { realm, characterName } = useParams(); 
  const [backgroundImage, setBackgroundImage] = useState('TavernBackground.jpg');

  useEffect(() => {
    changeBackground('TavernBackground.jpg');

    Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/character/appearance/${realm}/${characterName}`),
      axios.get(`${import.meta.env.VITE_API_URL}/character/media/${realm}/${characterName}`)
    ]).then(([profileResponse, mediaResponse]) => {
      setProfileData(profileResponse.data);
      setMediaData(mediaResponse.data);
    }).catch(error => console.error(error));
  }, [realm, characterName]);

  const backgrounds = [
    'TavernBackground.jpg',
    'chantorage1.jpg',
    'chantorage2.jpg',
    'chantorage3.jpg',
    'chantorage4.jpg',
  ];

  const changeBackground = (initialBackground) => {
    const randomBackground = initialBackground || backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackgroundImage(`../../public/backgroundImages/${randomBackground}`);
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