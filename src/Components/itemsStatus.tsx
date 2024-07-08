import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Item {
  Id_Item: number;
  nom: string;
  active: boolean;
}

const ItemsStatus: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [updatedItems, setUpdatedItems] = useState<{ id: number; active: boolean }[]>([]);
  const [modifications, setModifications] = useState<{ nom: string; active: boolean }[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/items`);
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
        toast.error('Error fetching items!');
      }
    };
    fetchItems();
  }, []);

  const handleCheckboxChange = (id: number, active: boolean, nom: string) => {
    setItems(items.map(item => item.Id_Item === id ? { ...item, active } : item));
    const existingIndex = updatedItems.findIndex(item => item.id === id);
    if (existingIndex !== -1) {
      const newUpdatedItems = [...updatedItems];
      newUpdatedItems[existingIndex].active = active;
      setUpdatedItems(newUpdatedItems);
    } else {
      setUpdatedItems([...updatedItems, { id, active }]);
    }
    setModifications(modifications => [
      ...modifications.filter(mod => mod.nom !== nom),
      { nom, active }
    ]);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/update-items-status`, updatedItems);
      toast.success('Status updated successfully!');
      const activatedCount = updatedItems.filter(item => item.active).length;
      const deactivatedCount = updatedItems.filter(item => !item.active).length;
      toast.info(`${activatedCount} item(s) activated, ${deactivatedCount} item(s) deactivated`);
    } catch (error) {
      toast.error('Error updating status!');
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="items-status-page">
      <h1>Items Status Management</h1>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Actif</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.Id_Item}>
              <td>{item.nom}</td>
              <td>
                <input
                  type="checkbox"
                  checked={item.active}
                  onChange={(e) => handleCheckboxChange(item.Id_Item, e.target.checked, item.nom)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit}>Valider</button>
      <div className="modifications-list">
        <ul>
          {modifications.map((mod, index) => (
            <li key={index}>
              {mod.nom}: <span className={mod.active ? 'active' : 'inactive'}>{mod.active ? 'Activé' : 'Desactivé'}</span>
            </li>
          ))}
        </ul>
      </div>
      <ToastContainer theme="colored" />
    </div>
  );
};

export default ItemsStatus;
