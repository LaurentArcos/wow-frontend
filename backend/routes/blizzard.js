const express = require('express');
const blizzardAPI = require('../blizzardAPI');
const router = express.Router();

router.get('/character/appearance/:realm/:characterName', async (req, res) => {

  try {
    const { realm, characterName } = req.params;
    const data = await blizzardAPI.getCharacterAppearance(realm, characterName);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/character/media/:realm/:characterName', async (req, res) => {

  try {
    const { realm, characterName } = req.params;
    const data = await blizzardAPI.getCharacterMedia(realm, characterName);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.get('/tokeninfo', async (req, res) => {
  try {
    const data = await blizzardAPI.getTokenInfo();
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
