const axios = require('axios');

let accessToken = null;
let tokenExpiration = null;
const BLIZZARD_API_BASE_URL = "https://eu.api.blizzard.com";

const getClientCredentials = async () => {
  const clientId = process.env.BLIZZARD_CLIENT_ID;
  const clientSecret = process.env.BLIZZARD_CLIENT_SECRET;
  const response = await axios.post('https://eu.battle.net/oauth/token', null, {
    params: {
      grant_type: 'client_credentials'
    },
    auth: {
      username: clientId,
      password: clientSecret
    }
  });

  accessToken = response.data.access_token;
  const expiresIn = response.data.expires_in;
  tokenExpiration = Date.now() + expiresIn * 1000; // Convertir en millisecondes
};

const getAccessToken = async () => {
  if (!accessToken || Date.now() > tokenExpiration) {
    await getClientCredentials();
  }
  return accessToken;
};

const getCharacterAppearance = async (realm, characterName) => {
  try {
    const accessToken = await getAccessToken();
    const url = `${BLIZZARD_API_BASE_URL}/profile/wow/character/${realm}/${characterName}/appearance?namespace=profile-eu&locale=fr_FR&access_token=${accessToken}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching character appearance:", error.response || error);
    throw error;
  } 
};

const getCharacterMedia = async (realm, characterName) => {
  const accessToken = await getAccessToken();
  const url = `${BLIZZARD_API_BASE_URL}/profile/wow/character/${realm}/${characterName}/character-media?namespace=profile-eu&locale=fr_FR&access_token=${accessToken}`;
  const response = await axios.get(url);
  return response.data;
};

const getTokenInfo = async () => {
  try {
    const accessToken = await getAccessToken();
    const url = `${BLIZZARD_API_BASE_URL}/data/wow/token/index?namespace=dynamic-eu&locale=fr_FR&access_token=${accessToken}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching token information:", error.response || error);
    throw error;
  }
};

module.exports = {
  getAccessToken,
  getCharacterAppearance,
  getCharacterMedia,
  getTokenInfo,
};