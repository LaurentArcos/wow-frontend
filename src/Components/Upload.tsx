import { useState, ChangeEvent } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormattedData {
  price: number;
  name: string;
}

const Upload: React.FC = () => {
  const [inputData, setInputData] = useState<string>("");
  const [formattedData, setFormattedData] = useState<FormattedData[]>([]);
  const [isTransferEnabled, setIsTransferEnabled] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>("");
  const [newItemImagePart, setNewItemImagePart] = useState<string>("");
  const [newItemExtension, setNewItemExtension] = useState<string>("");
  const [newItemType, setNewItemType] = useState<string>("");
  const [showNewItemSection, setShowNewItemSection] = useState<boolean>(false);
  const [showUploadPricesSection, setShowUploadPricesSection] =
    useState<boolean>(false);
  const [pageTitle, setPageTitle] = useState<string>("Uploads");

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputData(e.target.value);
  };

  const formatData = () => {
    const lines = inputData.split("\n").slice(1);
    const formatted = lines.map((line) => {
      const parts = line.split(",");
      const price = parseFloat(parts[0]) / 10000;
      return {
        price: parseFloat(price.toFixed(2)),
        name: parts[1].replace(/"/g, ""),
      };
    });
    setFormattedData(formatted);
    setIsTransferEnabled(true);
  };

  const transferData = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ajouterPrix`,
        formattedData
      );
      toast.success(`Upload réussi: ${formattedData.length} prix ajoutés.`);
      console.log(response);
    } catch (error) {
      console.error(error);
      toast.error("Échec de l'upload.");
    }
  };

  const handleAddNewItem = async () => {
    if (!newItemExtension || !newItemType) {
      toast.error("Veuillez sélectionner une extension et un type.");
      return;
    }

    try {
      const fullImageUrl = `https://render.worldofwarcraft.com/eu/icons/56/${newItemImagePart}.jpg`;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ajouterItem`,
        {
          nom: newItemName,
          image: fullImageUrl,
          extension: newItemExtension,
          type: newItemType,
        }
      );

      toast.success(
        `Nouvel item "${newItemName}" ajouté avec succès ! Extension: ${newItemExtension}, Type: ${newItemType}`
      );
      setNewItemName("");
      setNewItemImagePart("");
      setNewItemExtension("");
      setNewItemType("");
      console.log(response);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'ajout du nouvel item.");
    }
  };

  const deleteFormattedData = (index: number) => {
    const newData = [...formattedData];
    newData.splice(index, 1);
    setFormattedData(newData);
  };

  const handleShowNewItemSection = () => {
    setPageTitle("Ajouter un item");
    setShowNewItemSection(true);
    setShowUploadPricesSection(false);
  };

  const handleShowUploadPricesSection = () => {
    setPageTitle("Ajouter des prix");
    setShowNewItemSection(false);
    setShowUploadPricesSection(true);
  };

  const handleBackToChoices = () => {
    setPageTitle("Uploads");
    setShowNewItemSection(false);
    setShowUploadPricesSection(false);
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">{pageTitle}</h2>
      {!showNewItemSection && !showUploadPricesSection && (
        <div className="choice-container">
          <button
            className="choice-button"
            onClick={handleShowNewItemSection}
          >
            Items
          </button>
          <button
            className="choice-button"
            onClick={handleShowUploadPricesSection}
          >
            Prix
          </button>
        </div>
      )}

      {showNewItemSection && (
        <section className="upload-new-item">
          <div className="input-group">
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
            <select
              value={newItemExtension}
              onChange={(e) => setNewItemExtension(e.target.value)}
            >
              <option value="" disabled>
                Veuillez sélectionner une extension
              </option>
              <option value="Dragonflight">Dragonflight</option>
              <option value="The War Within">The War Within</option>
            </select>
            <select
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value)}
            >
              <option value="" disabled>
                Veuillez sélectionner un type
              </option>
              <option value="Minage">Minage</option>
              <option value="Pêche">Pêche</option>
              <option value="Herboristerie">Herboristerie</option>
              <option value="Dépeçage">Dépeçage</option>
              <option value="Cuisine">Cuisine</option>
              <option value="Artisanat">Artisanat</option>
            </select>
            <button onClick={handleAddNewItem}>Ajouter un nouvel item</button>
            <button
              className="back-button"
              onClick={handleBackToChoices}
            >
              Retour
            </button>
          </div>
        </section>
      )}

      {showUploadPricesSection && (
        <section className="upload-prices">
          <textarea
            value={inputData}
            onChange={handleInputChange}
            placeholder="Import depuis Auctionator"
          />
          <div className="upload-prices-buttons">
            <button onClick={formatData}>Formatter les données</button>
            <button onClick={transferData} disabled={!isTransferEnabled}>
              Transférer dans la base de données
            </button>
            {formattedData.map((item, index) => (
              <div key={index}>
                {item.name} : {item.price}
                <button
                  className="delete-button"
                  onClick={() => deleteFormattedData(index)}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
          <button
            className="back-button"
            onClick={handleBackToChoices}
          >
            Retour
          </button>
        </section>
      )}

      <ToastContainer theme="colored" />
    </div>
  );
};

export default Upload;
