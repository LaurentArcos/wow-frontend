require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./database.js');
const blizzardAPI = require('./blizzardAPI.js');

app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:5173', // or your specific vite dev server URL
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));

app.get('/items', (req, res) => {
    db.query('SELECT * FROM Items', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/prix', (req, res) => {
  db.query('SELECT * FROM Prix', (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(results);
  });
});

app.post('/ajouterPrix', (req, res) => {
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


app.get('/achats', (req, res) => {
  db.query('SELECT * FROM achats', (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(results);
  });
});

app.post('/ajouterAchat', (req, res) => {
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


app.get('/api/character/appearance/:realm/:characterName', async (req, res) => {

  try {
    const { realm, characterName } = req.params;
    const data = await blizzardAPI.getCharacterAppearance(realm, characterName);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.get('/api/character/media/:realm/:characterName', async (req, res) => {

    try {
      const { realm, characterName } = req.params;
      const data = await blizzardAPI.getCharacterMedia(realm, characterName);
      res.json(data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });


const PORT = process.env.PORT || 8080;

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Quelque chose a mal tourné !');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});