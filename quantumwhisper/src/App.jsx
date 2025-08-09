import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QuantumProvider } from '@/context/QuantumContext';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import HomePage from '@/pages/HomePage';
import KeyExchangePage from '@/pages/KeyExchangePage';
import MessagingPage from '@/pages/MessagingPage';

function App() {
  return (
    <QuantumProvider>
      <Router>
        <div className="quantum-bg min-h-screen flex flex-col">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/key-exchange" element={<KeyExchangePage />} />
              <Route path="/messaging" element={<MessagingPage />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </QuantumProvider>
  );
}

export default App;
