import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Upload from './Upload';
import ItemsPrixTableau from './ItemsPrixTableau';
import Achats from './Achats';
import CharacterPage from './CharacterPage';
import Home from './Home';
import Token from './Token';
import Layout from './Layout';
import ItemsStatus from './ItemsStatus';

const App: React.FC = () => {

  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Layout><Upload/></Layout>} />
          <Route path="/tableau" element={<Layout><ItemsPrixTableau/></Layout>} />
          <Route path="/achats" element={<Layout><Achats/></Layout>} />
          <Route path="/token" element={<Layout><Token/></Layout>} />
          <Route path="/items-status" element={<Layout><ItemsStatus/></Layout>} /> 
          <Route path="/:realm/:characterName" element={<Layout><CharacterPage/></Layout>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;