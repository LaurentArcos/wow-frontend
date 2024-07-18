import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Item {
  Id_Item: number;
  nom: string;
  active: boolean;
  modified?: boolean;
}

const ItemsStatus: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [updatedItems, setUpdatedItems] = useState<
    { id: number; active: boolean }[]
  >([]);
  const [modifications, setModifications] = useState<
    { nom: string; active: boolean }[]
  >([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/items`
        );
        const sortedItems = response.data.sort((a: Item, b: Item) =>
          a.nom.localeCompare(b.nom)
        );
        setItems(sortedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("Error fetching items!");
      }
    };
    fetchItems();
  }, []);

  const handleCheckboxChange = (id: number, active: boolean, nom: string) => {
    setItems(
      items.map((item) =>
        item.Id_Item === id ? { ...item, active, modified: true } : item
      )
    );
    const existingIndex = updatedItems.findIndex((item) => item.id === id);
    if (existingIndex !== -1) {
      const newUpdatedItems = [...updatedItems];
      newUpdatedItems[existingIndex].active = active;
      setUpdatedItems(newUpdatedItems);
    } else {
      setUpdatedItems([...updatedItems, { id, active }]);
    }
    setModifications((modifications) => [
      ...modifications.filter((mod) => mod.nom !== nom),
      { nom, active },
    ]);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/update-items-status`,
        updatedItems
      );
      toast.success("Status updated successfully!");
      const activatedCount = updatedItems.filter((item) => item.active).length;
      const deactivatedCount = updatedItems.filter(
        (item) => !item.active
      ).length;
      toast.info(
        `${activatedCount} item(s) activated, ${deactivatedCount} item(s) deactivated`
      );

      setItems(items.map((item) => ({ ...item, modified: false })));
      setUpdatedItems([]);
    } catch (error) {
      toast.error("Error updating status!");
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="items-status-page">
      <h2>Items Status Management</h2>
      <section className="items-status-grid">
        {items.map((item) => (
          <div
            key={item.Id_Item}
            className={`items-status-item ${
              item.modified ? "modified" : item.active ? "active" : "inactive"
            }`}
          >
            <span>{item.nom}</span>
            <input
              type="checkbox"
              className="items-status-checkbox"
              checked={item.active}
              onChange={(e) =>
                handleCheckboxChange(item.Id_Item, e.target.checked, item.nom)
              }
            />
          </div>
        ))}
      </section>
      <button className="items-status-button" onClick={handleSubmit}>
        Valider
      </button>
      <section className="modifications-list">
        <ul className="modifications-list-ul">
          {modifications.map((mod, index) => (
            <li key={index} className="modifications-list-li">
              {mod.nom}:{" "}
              <span
                className={
                  mod.active ? "modification-active" : "modification-inactive"
                }
              >
                {mod.active ? "Activé" : "Desactivé"}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <ToastContainer theme="colored" />
    </div>
  );
};

export default ItemsStatus;
