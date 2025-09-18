import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useAccessibility } from "../../contexts/AccessibilityContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Home,
  Users,
  UserCog,
  Info,
  Accessibility as AccessibilityIcon,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const { userData, logout } = useAuth();
  const { speak } = useAccessibility();
  const { theme } = useTheme();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    {
      path: "/dashboard",
      icon: Home,
      label: "Inicio",
      allowedFor: ["Administrador", "Usuario"],
    },
    {
      path: "/contact",
      icon: Users,
      label: "Contacto",
      allowedFor: ["Administrador", "Usuario"],
    },
    {
      path: "/admin",
      icon: UserCog,
      label: "Administrador",
      allowedFor: ["Administrador"],
    },
    {
      path: "/about",
      icon: Info,
      label: "Acerca De",
      allowedFor: ["Administrador", "Usuario"],
    },
    {
      path: "/accessibility",
      icon: AccessibilityIcon,
      label: "Accesibilidad",
      allowedFor: ["Administrador", "Usuario"],
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => userData && item.allowedFor.includes(userData.role)
  );

  const getThemeClasses = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-800 border-gray-700";
      case "high-contrast":
        return "bg-black border-white";
      default:
        return "bg-[#371959] border-[#371959]";
    }
  };

  const getTextClasses = () => {
    switch (theme) {
      case "high-contrast":
        return "text-white";
      default:
        return "text-white";
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full w-64 ${getThemeClasses()} ${getTextClasses()} shadow-lg z-30`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-purple-400">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center">
            {/* <span className="text-[#371959] text-lg font-bold">LLA</span> */}
            <img
              src="/favicon.jpg"
              alt="Logo"
              className="h-20 object-cover rounded-full"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold">La Libertad Avanza</h1>
            <p className="text-sm opacity-75">Dashboard - v2.0b</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => speak(item.label)}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-white bg-opacity-20 text-white"
                        : "text-white hover:bg-white hover:bg-opacity-10"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-400">
        <div className="mb-3">
          <p className="text-sm font-medium">{userData?.email}</p>
          <p className="text-xs opacity-75">{userData?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
