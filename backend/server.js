const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./database.js');

app.use(express.json());
app.use(cors());

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

    res.send('Les prix ont été ajoutés avec succès.');
});


const PORT = process.env.PORT || 5000;

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Quelque chose a mal tourné !');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});