const express = require('express');
const db = require('../database');
const router = express.Router();

router.get('/items', (req, res) => {
    db.query('SELECT * FROM Items', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

router.post('/ajouterItem', (req, res) => {
    const { nom, image } = req.body;
    db.query('INSERT INTO Items (nom, image) VALUES (?, ?)', [nom, image], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: `Nouvel item ajouté avec succès: ${nom}` });
    });
});

module.exports = router;
