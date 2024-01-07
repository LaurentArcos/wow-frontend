import PropTypes from 'prop-types';
import IconBar from './IconBar';

const Layout = ({ children }) => {
  return (
    <div>
      <IconBar />
      <div>{children}</div>
    </div>
  );
};

// Définition des propTypes pour Layout
Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;