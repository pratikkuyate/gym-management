import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

const NavBar: React.FC = () => {

    return (
        <nav className="navbar navbar-expand-lg bg-light">
            <div className="container-fluid">
                <Link href="/dashboard" className="navbar-brand">
                    Golds Gym
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className='nav-item'>
                            <Link href="/dashboard" className="nav-link">
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/members" className="nav-link">
                                Members
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/settings" className="nav-link">
                                Settings
                            </Link>
                        </li>
                    </ul>
                    <button
                        className="btn btn-outline-secondary ms-auto"
                        onClick={() => signOut({ callbackUrl: '/login' })}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;