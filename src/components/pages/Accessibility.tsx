import React from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Eye, 
  Type, 
  Plus, 
  Minus,
  RotateCcw,
  Accessibility as AccessibilityIcon
} from 'lucide-react';
import Button from '../common/Button';

export default function Accessibility() {
  const { isScreenReaderEnabled, toggleScreenReader, speak } = useAccessibility();
  const { theme, setTheme, fontSize, increaseFontSize, decreaseFontSize, resetFontSize } = useTheme();

  React.useEffect(() => {
    speak('Configuración de accesibilidad cargada');
  }, [speak]);

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          card: 'bg-gray-800 text-white border-gray-700',
          text: 'text-gray-300',
          button: 'bg-gray-700 hover:bg-gray-600 border-gray-600'
        };
      case 'high-contrast':
        return {
          card: 'bg-white text-black border-black border-2',
          text: 'text-black',
          button: 'bg-black text-white hover:bg-gray-800 border-black'
        };
      default:
        return {
          card: 'bg-white text-gray-900 border-gray-200',
          text: 'text-gray-600',
          button: 'bg-gray-100 hover:bg-gray-200 border-gray-300'
        };
    }
  };

  const themeClasses = getThemeClasses();

  const testSpeech = () => {
    speak('Esta es una prueba del lector de pantalla. El sistema puede leer en voz alta cualquier texto de la interfaz.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm`}>
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <AccessibilityIcon className="w-8 h-8 mr-3 text-[#371959]" />
          Configuración de Accesibilidad
        </h2>
        <p className={`text-lg ${themeClasses.text}`}>
          Personaliza la experiencia de usuario para adaptarse a tus necesidades de accesibilidad.
          Todas las configuraciones se aplican inmediatamente y se mantienen durante tu sesión.
        </p>
      </div>

      {/* Screen Reader */}
      <div className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm`}>
        <h3 className="text-xl font-bold mb-4 flex items-center">
          {isScreenReaderEnabled ? <Volume2 className="w-6 h-6 mr-3 text-green-600" /> : <VolumeX className="w-6 h-6 mr-3 text-gray-400" />}
          Lector de Pantalla
        </h3>
        
        <p className={`mb-6 ${themeClasses.text}`}>
          El lector de pantalla convierte el texto en voz para usuarios con discapacidades visuales.
          Cuando está activado, el sistema leerá automáticamente los elementos de la interfaz.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            onClick={toggleScreenReader}
            className={isScreenReaderEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}
          >
            {isScreenReaderEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
            {isScreenReaderEnabled ? 'Desactivar Lector' : 'Activar Lector'}
          </Button>
          
          {isScreenReaderEnabled && (
            <Button onClick={testSpeech} variant="secondary">
              Probar Lector de Pantalla
            </Button>
          )}
        </div>

        <div className={`mt-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : theme === 'high-contrast' ? 'bg-gray-100' : 'bg-blue-50'}`}>
          <p className="text-sm">
            <strong>Estado:</strong> {isScreenReaderEnabled ? 'Activado' : 'Desactivado'}
          </p>
          {isScreenReaderEnabled && (
            <p className="text-sm mt-2">
              El lector de pantalla está activo. Navega por la interfaz para escuchar las descripciones.
            </p>
          )}
        </div>
      </div>

      {/* Font Size */}
      <div className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm`}>
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Type className="w-6 h-6 mr-3 text-blue-600" />
          Tamaño de Fuente
        </h3>
        
        <p className={`mb-6 ${themeClasses.text}`}>
          Ajusta el tamaño del texto para mejorar la legibilidad. El cambio se aplica a toda la interfaz.
        </p>

        <div className="flex items-center space-x-4">
          <Button
            onClick={decreaseFontSize}
            variant="secondary"
            disabled={fontSize <= 80}
            className="flex items-center"
          >
            <Minus className="w-4 h-4 mr-2" />
            Reducir
          </Button>
          
          <div className="flex items-center space-x-4">
            <span className="text-lg font-medium">Tamaño actual: {fontSize}%</span>
            <div className={`px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
              <span style={{ fontSize: `${fontSize}%` }}>Texto de ejemplo</span>
            </div>
          </div>
          
          <Button
            onClick={increaseFontSize}
            variant="secondary"
            disabled={fontSize >= 150}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Aumentar
          </Button>
          
          <Button
            onClick={resetFontSize}
            variant="secondary"
            className="flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restablecer
          </Button>
        </div>
      </div>

      {/* Theme Selection */}
      <div className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm`}>
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Sun className="w-6 h-6 mr-3 text-yellow-600" />
          Tema Visual
        </h3>
        
        <p className={`mb-6 ${themeClasses.text}`}>
          Selecciona el tema que mejor se adapte a tus necesidades visuales y condiciones de iluminación.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Light Theme */}
          <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            theme === 'light' ? 'border-[#371959] bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`} onClick={() => setTheme('light')}>
            <div className="flex items-center mb-3">
              <Sun className="w-6 h-6 mr-3 text-yellow-600" />
              <h4 className="font-bold">Tema Claro</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Fondo blanco con texto oscuro. Ideal para buena iluminación.
            </p>
            <div className="h-8 bg-white border rounded flex items-center px-3 text-sm">
              Ejemplo de texto
            </div>
          </div>

          {/* Dark Theme */}
          <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            theme === 'dark' ? 'border-[#371959] bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`} onClick={() => setTheme('dark')}>
            <div className="flex items-center mb-3">
              <Moon className="w-6 h-6 mr-3 text-blue-600" />
              <h4 className="font-bold">Tema Oscuro</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Fondo oscuro con texto claro. Reduce la fatiga visual.
            </p>
            <div className="h-8 bg-gray-800 border rounded flex items-center px-3 text-sm text-white">
              Ejemplo de texto
            </div>
          </div>

          {/* High Contrast Theme */}
          <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            theme === 'high-contrast' ? 'border-[#371959] bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`} onClick={() => setTheme('high-contrast')}>
            <div className="flex items-center mb-3">
              <Eye className="w-6 h-6 mr-3 text-purple-600" />
              <h4 className="font-bold">Alto Contraste</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Máximo contraste para usuarios con baja visión.
            </p>
            <div className="h-8 bg-white border-2 border-black rounded flex items-center px-3 text-sm">
              Ejemplo de texto
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Navigation Help */}
      <div className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm`}>
        <h3 className="text-xl font-bold mb-4">Navegación por Teclado</h3>
        
        <p className={`mb-6 ${themeClasses.text}`}>
          El sistema es completamente navegable usando solo el teclado. Utiliza estas combinaciones:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Navegación General</h4>
            <ul className={`space-y-2 ${themeClasses.text}`}>
              <li><kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Tab</kbd> - Siguiente elemento</li>
              <li><kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Shift + Tab</kbd> - Elemento anterior</li>
              <li><kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Enter</kbd> - Activar elemento</li>
              <li><kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Espacio</kbd> - Seleccionar checkbox/botón</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Accesos Rápidos</h4>
            <ul className={`space-y-2 ${themeClasses.text}`}>
              <li><kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Esc</kbd> - Cerrar modal</li>
              <li><kbd className="bg-gray-200 px-2 py-1 rounded text-xs">←↑↓→</kbd> - Navegar en tablas</li>
              <li><kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Ctrl + /</kbd> - Ayuda</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Accessibility Status */}
      <div className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm`}>
        <h3 className="text-xl font-bold mb-4">Estado de Configuración</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h4 className="font-medium mb-2">Lector de Pantalla</h4>
            <p className={`text-sm ${isScreenReaderEnabled ? 'text-green-600' : 'text-gray-500'}`}>
              {isScreenReaderEnabled ? 'Activado' : 'Desactivado'}
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h4 className="font-medium mb-2">Tamaño de Fuente</h4>
            <p className="text-sm text-blue-600">{fontSize}%</p>
          </div>
          
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h4 className="font-medium mb-2">Tema Actual</h4>
            <p className="text-sm text-purple-600 capitalize">
              {theme === 'high-contrast' ? 'Alto Contraste' : 
               theme === 'dark' ? 'Oscuro' : 'Claro'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}