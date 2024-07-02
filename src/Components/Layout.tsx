import React, { ReactNode } from 'react';
import IconBar from './IconBar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <IconBar />
      <div>{children}</div>
    </div>
  );
};

export default Layout;