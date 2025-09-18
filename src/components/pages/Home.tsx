import React, { useState, useEffect } from "react";
import { useAccessibility } from "../../contexts/AccessibilityContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  BarChart3,
  Users,
  MessageSquare,
  Shield,
  RefreshCw,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function Home() {
  const { speak } = useAccessibility();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      title: "Contactos Totales",
      value: "...",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Mensajes Enviados",
      value: "...",
      icon: MessageSquare,
      color: "text-green-600",
    },
    {
      title: "Usuarios Activos",
      value: "...",
      icon: Shield,
      color: "text-purple-600",
    },
    {
      title: "Tasa de Respuesta",
      value: "...",
      icon: BarChart3,
      color: "text-orange-600",
    },
  ]);

  useEffect(() => {
    speak("Página de inicio cargada");
    loadStats();
  }, [speak]);

  const contactsFromSheets = async () => {
    const appsScriptUrl =
      "https://script.google.com/macros/s/AKfycbw62hvYFbONYig2qw8kclilRdvK3HKah0sg9-ACcWHRNh42FKxS-ZSFeGoo69gUy8r1ug/exec";
    try {
      const response = await fetch(appsScriptUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching data from Google Apps Script:", error);
      return [];
    }
  };

  const loadStats = async () => {
    setLoading(true);
    try {
      // Set up promises for all data fetching
      const usersPromise = getDocs(collection(db, "users"));
      const sheetsPromise = contactsFromSheets();
      const statusesPromise = getDocs(collection(db, "contact_status"));

      // Fetch all data in parallel
      const [usersSnapshot, sheetsData, statusesSnapshot] = await Promise.all([
        usersPromise,
        sheetsPromise,
        statusesPromise,
      ]);

      // --- Process Data ---

      // 1. Active Users
      const activeUsers = usersSnapshot.size;

      // 2. Total Contacts
      if (!Array.isArray(sheetsData)) {
        console.error("Data from Google Sheets is not an array:", sheetsData);
        throw new Error("Sheet data is not an array.");
      }
      const totalContacts = sheetsData.length;

      // 3. Sent Messages
      const statusData: { [key: string]: any } = {};
      statusesSnapshot.forEach((doc) => {
        statusData[doc.id] = doc.data();
      });

      const combinedContacts = sheetsData.map((contact: any) => ({
        ...contact,
        estado: statusData[contact.id]?.estado || "Incomunicado",
      }));

      const sentMessages = combinedContacts.filter(
        (c: { estado: string }) => c.estado === "Comunicado"
      ).length;

      // 4. Response Rate
      const responseRate =
        totalContacts > 0
          ? ((sentMessages / totalContacts) * 100).toFixed(0)
          : 0;

      // --- Update State ---
      setStats([
        {
          title: "Contactos Totales",
          value: totalContacts.toString(),
          icon: Users,
          color: "text-blue-600",
        },
        {
          title: "Mensajes Enviados",
          value: sentMessages.toString(),
          icon: MessageSquare,
          color: "text-green-600",
        },
        {
          title: "Usuarios Activos",
          value: activeUsers.toString(),
          icon: Shield,
          color: "text-purple-600",
        },
        {
          title: "Tasa de Respuesta",
          value: `${responseRate}%`,
          icon: BarChart3,
          color: "text-orange-600",
        },
      ]);
    } catch (error) {
      console.error("Error loading stats:", error);
      // You might want to set an error state here to show in the UI
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-[#371959]" />
        <span className="ml-3 text-lg">Cargando estadísticas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm`}>
        <h2 className="text-2xl font-bold mb-4">
          Bienvenido al Dashboard de Contactos para la LLA Chaco
        </h2>
        <p className={`text-lg ${themeClasses.text} leading-relaxed`}>
          Sistema integral de gestión de contactos para La Libertad Avanza
          Chaco. Esta plataforma te permite administrar contactos, enviar
          mensajes por WhatsApp y mantener un seguimiento eficiente de las

          comunicaciones.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${themeClasses.text}`}>
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm`}>
          <h3 className="text-xl font-bold mb-4">
            Funcionalidades Principales
          </h3>
          <ul className={`space-y-3 ${themeClasses.text}`}>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-[#371959] rounded-full mr-3"></span>
              Gestión completa de contactos
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-[#371959] rounded-full mr-3"></span>
              Integración con Google Sheets
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-[#371959] rounded-full mr-3"></span>
              Mensajería automatizada por WhatsApp
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-[#371959] rounded-full mr-3"></span>
              Seguimiento de estados en tiempo real
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-[#371959] rounded-full mr-3"></span>
              Panel de administración completo
            </li>
          </ul>
        </div>

        <div className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm`}>
          <h3 className="text-xl font-bold mb-4">Accesibilidad</h3>
          <p className={`${themeClasses.text} mb-4`}>
            El sistema incluye funciones de accesibilidad avanzadas:
          </p>
          <ul className={`space-y-3 ${themeClasses.text}`}>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Lector de pantalla por voz
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Ajuste de tamaño de fuente
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Modo oscuro y alto contraste
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Navegación por teclado
            </li>
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm`}>
        <h3 className="text-xl font-bold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => (window.location.href = "/contact")}
            className="flex items-center justify-center p-4 bg-[#371959] text-white rounded-lg hover:bg-[#2d1247] transition-colors"
          >
            <Users className="w-5 h-5 mr-2" />
            Ver Contactos
          </button>
          <button
            onClick={() => (window.location.href = "/admin")}
            className="flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Shield className="w-5 h-5 mr-2" />
            Administrar Usuarios
          </button>
          <button
            onClick={() => (window.location.href = "/accessibility")}
            className="flex items-center justify-center p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Users className="w-5 h-5 mr-2" />
            Configurar Accesibilidad
          </button>
        </div>
      </div>
    </div>
  );
}