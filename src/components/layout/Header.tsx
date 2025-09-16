import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

export default function Header() {
  const location = useLocation();
  const { theme } = useTheme();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Panel de Control';
      case '/contact':
        return 'Gestión de Contactos';
      case '/admin':
        return 'Administración de Usuarios';
      case '/about':
        return 'Acerca del Sistema';
      case '/accessibility':
        return 'Configuración de Accesibilidad';
      default:
        return 'Dashboard';
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-800 border-gray-700 text-white';
      case 'high-contrast':
        return 'bg-white border-black text-black';
      default:
        return 'bg-white border-gray-200 text-gray-900';
    }
  };

  return (
    <header className={`sticky top-0 z-20 px-6 py-4 border-b ${getThemeClasses()} shadow-sm`}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
        <div className="text-sm opacity-75">
          {new Date().toLocaleDateString('es-AR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>
    </header>
  );
}