const express = require('express');
const db = require('../database'); 
const router = express.Router();

router.get('/achats', async (req, res) => {
  db.query('SELECT * FROM achats', (err, results) => {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    res.json(results);
});
});

router.post('/ajouterAchat', async (req, res) => {
  const { Id_Item, Quantite, PrixUnitaire, DateAchat } = req.body;

  db.query('INSERT INTO achats (Id_Item, Quantite, PrixUnitaire, DateAchat) VALUES (?, ?, ?, ?)', 
  [Id_Item, Quantite, PrixUnitaire, DateAchat], (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      const res_send_achat = `Achat ajouté avec succès:\nId Item: ${Id_Item}, Quantité: ${Quantite}, Prix Unit.: ${PrixUnitaire}, Date Achat: ${DateAchat}`;
      res.send(res_send_achat);
  });
});

router.post('/modifierAchatActive', async (req, res) => {
  const { id, active } = req.body;
  if (id == null) { 
    return res.status(400).json({ error: "L'ID de l'achat est manquant." });
  }

  db.query('UPDATE achats SET Active = ? WHERE Id_Achat = ?', [active, id], (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.send(`Achat avec ID_Achat: ${id} a été modifié avec succès.`);
  });
});

module.exports = router;