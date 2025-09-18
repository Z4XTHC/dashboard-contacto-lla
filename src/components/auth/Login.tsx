import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (error: any) {
      setError("Error en las credenciales. Verifica tu email y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#371959] to-[#2d1247] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#371959] rounded-full flex items-center justify-center mx-auto mb-4">
            {/* <span className="text-white text-2xl font-bold">LLA</span> */}
            <img
              src="./public/favicon.jpg"
              alt="Logo"
              className="h-20 object-cover rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            La Libertad Avanza - Chaco
          </h1>
          <p className="text-gray-600 mt-2">Dashboard - v2.0b</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#371959] hover:bg-[#2d1247]"
          >
            <LogIn className="w-5 h-5 mr-2" />
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Los usuarios se crean desde el panel de administración. Por favor,
          contacta al administrador.
        </div>
      </div>
    </div>
  );
}
