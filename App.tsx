import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import IncomePage from './pages/IncomePage';
import AdminPage from './pages/AdminPage';
import { PortfolioProvider } from './context/PortfolioContext';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="glass-pane p-8 text-center animate-fade-in-up max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-error mb-4 text-glow">Oops! Something went wrong.</h2>
      <p className="text-on-surface mb-6">We encountered an unexpected issue. This could be due to a network problem or a bug. Please try again.</p>
      <pre className="text-left bg-black/20 p-4 rounded-lg text-error/80 text-sm overflow-auto mb-6 whitespace-pre-wrap">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="bg-primary text-on-primary font-bold py-3 px-6 rounded-full hover:bg-primary/90 transition-transform transform hover:scale-105 duration-300 shadow-xl shadow-primary/30 text-glow"
      >
        Try Again
      </button>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <PortfolioProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error, info) => console.error("ErrorBoundary caught an error:", error, info)}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/portfolio/:projectId" element={<PortfolioPage />} />
              <Route path="/income" element={<IncomePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </PortfolioProvider>
  );
};

export default App;