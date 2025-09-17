import React, { useState } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { MessageCircle, Clock, Send, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Contact {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  estado: 'Comunicado' | 'Incomunicado';
}

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
  onMessageSent: (contact: Contact) => void;
}

export default function WhatsAppModal({ isOpen, onClose, contact, onMessageSent }: WhatsAppModalProps) {
  const { speak } = useAccessibility();
  const [messageType, setMessageType] = useState<string>('saludo');
  const [customMessage, setCustomMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const messageTemplates = {
    saludo: `${getGreeting()} ${contact.nombre}, soy del equipo de La Libertad Avanza. ¿Cómo está usted?`,
    recordatorio: `${getGreeting()} ${contact.nombre}, le escribo desde La Libertad Avanza para recordarle sobre nuestras próximas actividades.`,
    invitacion: `${getGreeting()} ${contact.nombre}, lo invitamos cordialmente a participar en nuestras actividades de La Libertad Avanza.`,
    consulta: `${getGreeting()} ${contact.nombre}, desde La Libertad Avanza queremos conocer su opinión sobre los temas que nos ocupan.`,
    seguimiento: `${getGreeting()} ${contact.nombre}, nos comunicamos desde La Libertad Avanza para hacer un seguimiento de nuestras conversaciones anteriores.`,
    personalizado: customMessage
  };

  const getCurrentMessage = () => {
    return messageTemplates[messageType as keyof typeof messageTemplates] || customMessage;
  };

  const handleSend = () => {
    const message = getCurrentMessage();
    const phoneNumber = contact.telefono.replace(/\D/g, ''); // Remove non-numeric characters
    const whatsappUrl = `https://wa.me/549${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Call the callback to update the contact status
    onMessageSent(contact);
    
    speak(`Abriendo WhatsApp para enviar mensaje a ${contact.nombre}`);
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
    if (!showPreview) {
      speak(`Vista previa del mensaje: ${getCurrentMessage()}`);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enviar Mensaje por WhatsApp" size="lg">
      <div className="space-y-6">
        {/* Contact Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-lg mb-2">{contact.nombre}</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>📱 {contact.telefono}</p>
            <p>📧 {contact.email}</p>
            <p className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
            </p>
          </div>
        </div>

        {/* Message Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de mensaje
          </label>
          <div className="space-y-2">
            {[
              { value: 'saludo', label: 'Saludo inicial', desc: 'Mensaje de presentación y saludo' },
              { value: 'recordatorio', label: 'Recordatorio', desc: 'Recordatorio de actividades' },
              { value: 'invitacion', label: 'Invitación', desc: 'Invitación a eventos o actividades' },
              { value: 'consulta', label: 'Consulta', desc: 'Consulta de opinión o feedback' },
              { value: 'seguimiento', label: 'Seguimiento', desc: 'Seguimiento de conversaciones previas' },
              { value: 'personalizado', label: 'Personalizado', desc: 'Mensaje personalizado' }
            ].map((type) => (
              <label key={type.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="messageType"
                  value={type.value}
                  checked={messageType === type.value}
                  onChange={(e) => setMessageType(e.target.value)}
                  className="h-4 w-4 text-[#371959] focus:ring-[#371959]"
                />
                <div className="flex-1">
                  <span className="font-medium">{type.label}</span>
                  <p className="text-sm text-gray-500">{type.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Message Input */}
        {messageType === 'personalizado' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje personalizado
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={`${getGreeting()} ${contact.nombre}, `}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#371959] focus:border-[#371959]"
            />
          </div>
        )}

        {/* Message Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Vista previa del mensaje
            </label>
            <Button
              onClick={handlePreview}
              variant="secondary"
              size="sm"
              className="flex items-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Ocultar' : 'Mostrar'} vista previa
            </Button>
          </div>
          
          {showPreview && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <MessageCircle className="w-5 h-5 text-green-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800 mb-1">Mensaje que se enviará:</p>
                  <p className="text-green-700 whitespace-pre-wrap">{getCurrentMessage()}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4 border-t">
          <Button
            onClick={handleSend}
            disabled={messageType === 'personalizado' && !customMessage.trim()}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar por WhatsApp
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>

        {/* Help text */}
        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
          <strong>Nota:</strong> Al hacer clic en "Enviar por WhatsApp", se abrirá la aplicación de WhatsApp 
          con el mensaje prellenado. Podrás revisar y modificar el mensaje antes de enviarlo definitivamente.
          El estado del contacto se actualizará automáticamente a "Comunicado".
        </div>
      </div>
    </Modal>
  );
}