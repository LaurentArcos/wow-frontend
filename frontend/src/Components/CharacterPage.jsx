
import axios from 'axios';
import { useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom';



const CharacterPage = () => {

  

// const [profileName, setProfileName ] =useState([]);
// const [race, setRace ] =useState([]);
// const [characterClass, setCharacterClass ] =useState([]);
// const [profilePicture, setProfilePicture] =useState([]);

const [profileData, setProfileData] = useState(null);
const [mediaData, setMediaData] = useState(null);
const { realm, characterName } = useParams(); 

useEffect(() => {
  axios.get(`http://localhost:8080/api/character/appearance/${realm}/${characterName}`)
    .then(response => setProfileData(response.data))
    .catch(error => console.error(error));

    axios.get(`http://localhost:8080/api/character/media/${realm}/${characterName}`)
    .then(response => setMediaData(response.data))
    .catch(error => console.error(error));
}, [realm, characterName]); 


return (
  <div className='characterPage'>
    <nav>
      <Link to="/">Accueil</Link>
    </nav>
    <div className='title'>World of Warcraft</div>
    {profileData && (
      <div className='character'>
        <div className='name'>{profileData.character.name}</div>
        <div className='raceAndClass'>{profileData.playable_race.name} / {profileData.playable_class.name}</div>
      </div>
    )}
    {mediaData && (
      <div 
          className='profilePicture' 
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