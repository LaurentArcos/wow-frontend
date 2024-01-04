import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DataFormatter from './DataFormatter';
import ItemsPrixTableau from './ItemsPrixTableau';
import Achats from './Achats';
import CharacterPage from './CharacterPage';
import Home from './Home'; // Nouveau composant Home
import Token from './Token';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<DataFormatter />} />
        <Route path="/tableau" element={<ItemsPrixTableau />} />
        <Route path="/achats" element={<Achats />} />
        <Route path="/token" element={<Token />} />
        <Route path="/:realm/:characterName" element={<CharacterPage />} />
      </Routes>
    </Router>
  );
}

export default App;