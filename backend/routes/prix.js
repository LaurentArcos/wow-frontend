// routes/prix.js
const express = require('express');
const db = require('../database');
const router = express.Router();

router.get('/', (req, res) => {
    db.query('SELECT * FROM Prix', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

router.post('/ajouterPrix', (req, res) => {
  const prixData = req.body;

  prixData.forEach(data => {
      const { name, price } = data;

      // Récupérer l'id correspondant au nom de l'item
      db.query('SELECT Id_Item FROM Items WHERE nom = ?', [name], (err, results) => {
          if (err) {
              return res.status(500).json({ error: err.message });
          }

          if (results.length > 0) {
              const itemId = results[0].Id_Item;
              const today = new Date().toISOString().slice(0, 10);

              // Insérer le prix dans la table Prix
              db.query('INSERT INTO Prix (Id_Item, Date, Prix) VALUES (?, ?, ?)', [itemId, today, price], (err, results) => {
                  if (err) {
                      return res.status(500).json({ error: err.message });
                  }
              });
          }
      });
  }); 
  const res_send_prix = "Les prix suivants ont été ajoutés avec succès:\n" +
  prixData.map(data => `Nom: ${data.name}, Prix: ${data.price}`).join('\n');
  res.send(res_send_prix);
});

module.exports = router;
