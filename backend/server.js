const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./database.js'); // Assurez-vous que ce chemin est correct

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

const PORT = process.env.PORT || 3000;

// Exemple de route (à développer selon vos besoins)
app.get('/items', (req, res) => {
    // Ici, vous intégreriez une requête à votre base de données
    res.json({ message: "Liste des items" });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Quelque chose a mal tourné !');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});