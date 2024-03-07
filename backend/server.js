require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');
const blizzardAPIRoutes = require('./routes/blizzard');
const itemsRoutes = require('./routes/items');
const prixRoutes = require('./routes/prix');
const achatsRoutes = require('./routes/achats');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', optionsSuccessStatus: 200 }));

app.use('/api', blizzardAPIRoutes);
app.use('/api', itemsRoutes);
app.use('/api', prixRoutes);
app.use('/api', achatsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Quelque chose a mal tourné !');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));