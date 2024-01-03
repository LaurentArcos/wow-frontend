import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DataFormatter from './DataFormatter';
import ItemsPrixTableau from './ItemsPrixTableau';
import Achats from './Achats';
import CharacterPage from './CharacterPage';
import Home from './Home'; // Nouveau composant Home

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<DataFormatter />} />
        <Route path="/tableau" element={<ItemsPrixTableau />} />
        <Route path="/achats" element={<Achats />} />
        <Route path="/:realm/:characterName" element={<CharacterPage />} />
      </Routes>
    </Router>
  );
}

export default App;