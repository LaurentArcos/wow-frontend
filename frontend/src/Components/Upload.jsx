import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Upload = () => {
  const [inputData, setInputData] = useState('');
  const [formattedData, setFormattedData] = useState([]);
  const [isTransferEnabled, setIsTransferEnabled] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemImagePart, setNewItemImagePart] = useState('');

  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  const formatData = () => {
    const lines = inputData.split('\n').slice(1);
    const formatted = lines.map(line => {
      const parts = line.split(',');
      const price = parseFloat(parts[0]) / 10000;
      return { price: parseFloat(price.toFixed(2)), name: parts[1].replace(/"/g, '') };
    });
    setFormattedData(formatted);
    setIsTransferEnabled(true);
  };

  const transferData = async () => {
    try {
      const response = await axios.post('/api/ajouterPrix', formattedData);
      toast.success(`Upload réussi: ${formattedData.length} prix ajoutés.`);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Échec de l'upload.");
    }
  };

  const handleAddNewItem = async () => {
    try {
      const fullImageUrl = `https://render.worldofwarcraft.com/eu/icons/56/${newItemImagePart}.jpg`;
      const response = await axios.post('/api/ajouterItem', {
        nom: newItemName,
        image: fullImageUrl
      });
      
      toast.success(`Nouvel item "${newItemName}" ajouté avec succès !`);
      setNewItemName('');
      setNewItemImagePart('');
      console.log(response);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'ajout du nouvel item.");
    }
  };

  const deleteFormattedData = (index) => {
    const newData = [...formattedData];
    newData.splice(index, 1);
    setFormattedData(newData);
  };

  return (
    <div className='Upload'>
      
      <div className="upload-wrapper">
  
        
        <div className="upload-prices">
          <textarea value={inputData} onChange={handleInputChange} />
          <button onClick={formatData}>Formatter les données</button>
          <button onClick={transferData} disabled={!isTransferEnabled}>Transférer dans la base de données</button>
          {formattedData.map((item, index) => (
            <div key={index}>
              {item.name} : {item.price}
              <button className='delete-button' onClick={() => deleteFormattedData(index)}>Supprimer</button>
            </div>
          ))}
        </div>
  
        
        <div className="separator"></div>
  
        
        <div className="upload-new-item">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Nom du nouvel item"
          />
          <input
            type="text"
            value={newItemImagePart}
            onChange={(e) => setNewItemImagePart(e.target.value)}
            placeholder="Partie de l'URL de l'image"
          />
          <button onClick={handleAddNewItem}>Ajouter un nouvel item</button>
        </div>
  
      </div>
  
      <ToastContainer theme="colored" />
    </div>
  );
};

export default Upload;