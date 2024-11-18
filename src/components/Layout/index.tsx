import React from 'react';
import NavBar from './NavBar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
            <NavBar />
            <main>
                {children}
            </main>
        </div>
    )
}

export default Layout;