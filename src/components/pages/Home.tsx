import React from "react";
import { useAccessibility } from "../../contexts/AccessibilityContext";
import { useTheme } from "../../contexts/ThemeContext";
import { BarChart3, Users, MessageSquare, Shield } from "lucide-react";

export default function Home() {
  const { speak } = useAccessibility();
  const { theme } = useTheme();

  React.useEffect(() => {
    speak("Página de inicio cargada");
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

  const stats = [
    {
      title: "Contactos Totales",
      value: "1,234",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Mensajes Enviados",
      value: "856",
      icon: MessageSquare,
      color: "text-green-600",
    },
    {
      title: "Usuarios Activos",
      value: "12",
      icon: Shield,
      color: "text-purple-600",
    },
    {
      title: "Tasa de Respuesta",
      value: "78%",
      icon: BarChart3,
      color: "text-orange-600",
    },
  ];

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
