import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, PortfolioIcon, IncomeIcon, MenuIcon, CloseIcon, AdminIcon } from './icons';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { to: '/', text: 'Home', icon: <HomeIcon className="w-5 h-5 mr-2" /> },
        { to: '/portfolio', text: 'Portfolio', icon: <PortfolioIcon className="w-5 h-5 mr-2" /> },
        { to: '/income', text: 'Income Tracker', icon: <IncomeIcon className="w-5 h-5 mr-2" /> },
        { to: '/admin', text: 'Admin Panel', icon: <AdminIcon className="w-5 h-5 mr-2" /> },
    ];

    const linkClasses = "flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300";
    const inactiveClasses = "text-slate-300 hover:bg-white/10 hover:text-white";
    const activeClasses = "bg-primary text-on-primary text-glow shadow-lg shadow-primary/30";

    return (
        <header className="sticky top-4 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="glass-pane flex items-center justify-between h-16 !rounded-full px-6">
                    <div className="flex items-center">
                        <NavLink to="/" className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-white tracking-wider text-glow">
                                Visio<span className="text-secondary">Flow</span>
                            </h1>
                        </NavLink>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-2">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    end
                                    className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}
                                >
                                    {link.icon}
                                    {link.text}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? <CloseIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden mt-2" id="mobile-menu">
                    <div className="glass-pane mx-4 !rounded-2xl px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) => `block !rounded-lg ${linkClasses} ${isActive ? activeClasses : inactiveClasses}`}
                            >
                                {link.icon}
                                {link.text}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;