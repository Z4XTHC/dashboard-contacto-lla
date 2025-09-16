import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Home from '../pages/Home';
import Contact from '../pages/Contact';
import Admin from '../pages/Admin';
import About from '../pages/About';
import Accessibility from '../pages/Accessibility';
import ProtectedRoute from '../common/ProtectedRoute';
import { useTheme } from '../../contexts/ThemeContext';

export default function Dashboard() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : theme === 'high-contrast' ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <main className="p-6">
            <Routes>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route path="/about" element={<About />} />
              <Route path="/accessibility" element={<Accessibility />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}