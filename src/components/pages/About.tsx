import React from "react";
import { useAccessibility } from "../../contexts/AccessibilityContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Info, Code, Shield, Zap, Users, Globe, Mail } from "lucide-react";

export default function About() {
  const { speak } = useAccessibility();
  const { theme } = useTheme();

  React.useEffect(() => {
    speak("Información del sistema cargada");
  }, [speak]);

  const getThemeClasses = () => {
    switch (theme) {
      case "dark":
        return {
          card: "bg-gray-800 text-white border-gray-700",
          text: "text-gray-300",
        };
      case "high-contrast":
        return {
          card: "bg-white text-black border-black border-2",
          text: "text-black",
        };
      default:
        return {
          card: "bg-white text-gray-900 border-gray-200",
          text: "text-gray-600",
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm text-center`}
      >
        <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
          <img
            src="/favicon.jpg"
            alt="Logo"
            className="h-32 w-32 rounded-full"
          />
        </div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Contactos</h1>
        <p className="text-xl text-[#371959] font-semibold mb-2">
          Versión 2.0b
        </p>
        <p className={`${themeClasses.text} max-w-2xl mx-auto`}>
          Plataforma de gestión de contactos para La Libertad Avanza - Chaco.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm text-center`}
        >
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Gestión de Contactos</h3>
          <p className={`text-sm ${themeClasses.text}`}>
            Administración completa de contactos con sincronización desde Google
            Sheets.
          </p>
        </div>

        <div
          className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm text-center`}
        >
          <Zap className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Tiempo Real</h3>
          <p className={`text-sm ${themeClasses.text}`}>
            Actualizaciones en tiempo real con Firebase Firestore para
            seguimiento instantáneo.
          </p>
        </div>

        <div
          className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm text-center`}
        >
          <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Seguridad</h3>
          <p className={`text-sm ${themeClasses.text}`}>
            Autenticación segura y control de roles para proteger la
            información.
          </p>
        </div>

        <div
          className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm text-center`}
        >
          <Code className="w-12 h-12 text-orange-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Accesibilidad</h3>
          <p className={`text-sm ${themeClasses.text}`}>
            Suite completa de herramientas de accesibilidad y usabilidad.
          </p>
        </div>
      </div>

      {/* Technical Information */}
      <div className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm`}>
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Info className="w-6 h-6 mr-3 text-[#371959]" />
          Información Técnica
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Tecnologías Frontend</h3>
            <ul className={`space-y-2 ${themeClasses.text}`}>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                React.js 18
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                TypeScript
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Tailwind CSS
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                React Router DOM
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Lucide React Icons
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Tecnologías Backend</h3>
            <ul className={`space-y-2 ${themeClasses.text}`}>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Firebase Authentication
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Firebase Firestore
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Google Sheets API
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                Web Speech API
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm`}>
        <h2 className="text-xl font-bold mb-4">Funcionalidades Principales</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Gestión</h3>
            <ul className={`space-y-2 ${themeClasses.text}`}>
              <li>• Autenticación segura con roles de usuario</li>
              <li>• Dashboard intuitivo y responsive</li>
              <li>• Gestión completa de contactos</li>
              <li>• Sincronización con Google Sheets</li>
              <li>• Panel de administración avanzado</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Comunicación</h3>
            <ul className={`space-y-2 ${themeClasses.text}`}>
              <li>• Mensajes personalizados por horario</li>
              <li>• Seguimiento de estados en tiempo real</li>
              <li>• Plantillas de mensajes inteligentes</li>
              <li>• Historial de comunicaciones</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Version History */}
      <div className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm`}>
        <h2 className="text-xl font-bold mb-4">Historial de Versiones</h2>

        <div className="space-y-4">
          <div className="border-l-4 border-[#371959] pl-4">
            <h3 className="font-semibold text-lg">Versión 1.0b (Beta)</h3>
            <p className={`text-sm ${themeClasses.text} mb-2`}>
              Lanzamiento inicial - Enero 2025
            </p>
            <ul className={`text-sm ${themeClasses.text} space-y-1`}>
              <li>• Sistema de autenticación y roles</li>
              <li>• Gestión de contactos con Google Sheets</li>
              <li>• Integración con WhatsApp</li>
              <li>• Panel de administración</li>
              <li>• Suite de accesibilidad completa</li>
              <li>• Diseño responsive y moderno</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div
        className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm text-center`}
      >
        <h2 className="text-xl font-bold mb-4">Soporte Técnico</h2>
        <p className={themeClasses.text}>
          Para soporte técnico o consultas sobre el sistema, contacta al equipo
          de desarrollo.
        </p>
        <div className="mt-6 flex justify-center items-center space-x-4">
          <a
            href="https://mangosofts.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Globe className="w-5 h-5 mr-2" />
            Sitio Web
          </a>
          <a
            href="mailto:msoft.info.soporte@gmail.com"
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Mail className="w-5 h-5 mr-2" />
            Email
          </a>
        </div>
        <div className="mt-6 text-sm">
          {/* Logo Mangosoft */}
          <img
            src="/MangoSoft.png"
            alt="Mango Soft Logo"
            className="h-10 w-auto mx-auto mb-2"
          />
          <p className="font-medium">Mango Soft Development Team</p>
          <p className={themeClasses.text}>
            Sistema desarrollado para La Libertad Avanza de Chaco
          </p>
        </div>
      </div>
    </div>
  );
}
