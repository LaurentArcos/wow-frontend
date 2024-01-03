import { Link } from 'react-router-dom';
import reactLogo from '../../src/assets/react.svg';
import viteLogo from '../../public/vite.svg';

const Home = () => {
  return (
    <div className="carousel">
        <Link to="/upload"><img src={viteLogo} className="logo" alt="Vite logo" /></Link>
        <Link to="/tableau"><img src={reactLogo} className="logo react" alt="React logo" /></Link>
        <Link to="/achats"><img src={viteLogo} className="logo" alt="Vite logo" /></Link>
        <Link to="/characterSample/realmName"><img src={reactLogo} className="logo react" alt="React logo" /></Link>
        <Link to="/characterSample/realmName"><img src={viteLogo} className="logo" alt="Vite logo" /></Link>
    </div>
  );
}

export default Home;