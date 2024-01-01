
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reactLogo from '../../src/assets/react.svg';
import viteLogo from '../../public/vite.svg';
import DataFormatter from './DataFormatter';
import ItemsPrixTableau from './ItemsPrixTableau';
import Achats from './Achats';
import CharacterPage from './CharacterPage';

function App() {

  return (
    <Router>
      <div>
        <img src={viteLogo} className="logo" alt="Vite logo" />
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
      <Routes>
  
        <Route path="/upload" element={<DataFormatter />} />
        <Route path="/tableau" element={<ItemsPrixTableau />} />
        <Route path="/achats" element={<Achats />} />
        <Route path="/:realm/:characterName" element={<CharacterPage />} />
      </Routes>
    </Router>
  );
}

export default App;