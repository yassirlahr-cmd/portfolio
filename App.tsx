import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import IncomePage from './pages/IncomePage';
import AdminPage from './pages/AdminPage';
import { PortfolioProvider } from './context/PortfolioContext';

const App: React.FC = () => {
  return (
    <PortfolioProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/:projectId" element={<PortfolioPage />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </PortfolioProvider>
  );
};

export default App;
