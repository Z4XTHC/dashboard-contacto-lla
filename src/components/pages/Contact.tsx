import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useAccessibility } from "../../contexts/AccessibilityContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  MessageCircle,
  Phone,
  Mail,
  Search,
  Filter,
  RefreshCw,
  User,
  MapPinned,
} from "lucide-react";
import { collection, doc, setDoc, onSnapshot, query } from "firebase/firestore";
import { db } from "../../config/firebase";
import WhatsAppModal from "../modals/WhatsAppModal";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";

interface Contact {
  id: string;
  nombre: string;
  telefono: string;
  telefono2: string;
  email: string;
  localidad: string;
  rol: string;
  dni: string;
  genero: string;
  experiencia: string;
  correoElectronico: string;
  preferencias: string;
  estado: "Comunicado" | "Incomunicado";
  ultimoComunicacion?: string;
  comunicadoPor?: string;
}

export default function Contact() {
  const { userData } = useAuth();
  const { speak } = useAccessibility();
  const { theme } = useTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showFilterWarningModal, setShowFilterWarningModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Incomunicado");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Simular datos de Google Sheets
  // const mockContactsFromSheets = [
  //   { nombre: "Juan Pérez", telefono: "1234567890", email: "juan@email.com" },
  //   {
  //     nombre: "Fabián Arriola",
  //     telefono: "3624406355",
  //     email: "example1@email.com",
  //   },
  //   {
  //     nombre: "Christian Naidenoff",
  //     telefono: "3624883675",
  //     email: "example2@email.com",
  //   },
  //   {
  //     nombre: "Alexander Gallardo",
  //     telefono: "3624997707",
  //     email: "example3@email.com",
  //   },
  //   {
  //     nombre: "Joaquín Lavia",
  //     telefono: "3624121192",
  //     email: "example4@email.com",
  //   },
  // ];

  // Traer datos de Google Sheets
  const contactsFromSheets = async () => {
    // ▼▼▼ PEGA AQUÍ LA URL DE TU APLICACIÓN WEB DE APPS SCRIPT ▼▼▼
    const appsScriptUrl =
      "https://script.google.com/macros/s/AKfycbw62hvYFbONYig2qw8kclilRdvK3HKah0sg9-ACcWHRNh42FKxS-ZSFeGoo69gUy8r1ug/exec";

    try {
      const response = await fetch(appsScriptUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Error al traer los datos desde Google Apps Script:",
        error
      );
      return [];
    }
  };

  useEffect(() => {
    speak("Página de contactos cargada");
    loadContacts();
  }, [speak]);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, statusFilter, locationFilter]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const sheetsData = await contactsFromSheets();

      if (!Array.isArray(sheetsData)) {
        console.error("Data from Google Sheets is not an array:", sheetsData);
        setLoading(false);
        return;
      }

      const q = query(collection(db, "contact_status"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const statusData: { [key: string]: any } = {};
        snapshot.forEach((doc) => {
          statusData[doc.id] = doc.data();
        });

        const combinedContacts: Contact[] = sheetsData.map((contact) => {
          const statusInfo = statusData[contact.id];
          return {
            ...contact,
            estado: statusInfo?.estado || "Incomunicado",
            ultimoComunicacion: statusInfo?.ultimoComunicacion,
            comunicadoPor: statusInfo?.comunicadoPor,
          };
        });

        setContacts(combinedContacts);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error loading contacts:", error);
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = contacts;

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((contact) => {
        const nombreMatch =
          contact.nombre &&
          contact.nombre.toLowerCase().includes(lowercasedSearchTerm);
        const telefonoMatch =
          contact.telefono && String(contact.telefono).includes(searchTerm);
        const emailMatch =
          contact.email &&
          contact.email.toLowerCase().includes(lowercasedSearchTerm);
        return nombreMatch || telefonoMatch || emailMatch;
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((contact) => contact.estado === statusFilter);
    }

    if (locationFilter) {
      filtered = filtered.filter(
        (contact) => contact.localidad === locationFilter
      );
    }

    setFilteredContacts(filtered);
  };

  const handleSendMessage = (contact: Contact) => {
    setSelectedContact(contact);
    if (contact.estado === "Comunicado") {
      setShowWarningModal(true);
    } else {
      setShowWhatsAppModal(true);
    }
  };

  const handleWarningConfirmation = () => {
    setShowWarningModal(false);
    setShowWhatsAppModal(true);
  };

  const handleStatusFilterChange = (newStatus: string) => {
    if (newStatus === "Comunicado") {
      setShowFilterWarningModal(true);
    } else {
      setStatusFilter(newStatus);
    }
  };

  const handleFilterWarningConfirmation = () => {
    setStatusFilter("Comunicado");
    setShowFilterWarningModal(false);
  };

  const updateContactStatus = async (
    contactId: string,
    status: "Comunicado" | "Incomunicado"
  ) => {
    if (!userData) return;

    try {
      await setDoc(
        doc(db, "contact_status", contactId),
        {
          estado: status,
          ultimoComunicacion: new Date().toISOString(),
          comunicadoPor: `${userData.nombre} ${userData.apellido}`,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error updating contact status:", error);
    }
  };

  const handleMessageSent = (contact: Contact) => {
    updateContactStatus(contact.id, "Comunicado");
    setShowWhatsAppModal(false);
    speak(`Mensaje enviado a ${contact.nombre}`);
  };

  const getThemeClasses = () => {
    switch (theme) {
      case "dark":
        return {
          card: "bg-gray-800 text-white border-gray-700",
          table: "bg-gray-800",
          row: "border-gray-700 hover:bg-gray-700",
          text: "text-gray-300",
        };
      case "high-contrast":
        return {
          card: "bg-white text-black border-black border-2",
          table: "bg-white",
          row: "border-black hover:bg-gray-100",
          text: "text-black",
        };
      default:
        return {
          card: "bg-white text-gray-900 border-gray-200",
          table: "bg-white",
          row: "border-gray-200 hover:bg-gray-50",
          text: "text-gray-600",
        };
    }
  };

  const themeClasses = getThemeClasses();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-[#371959]" />
        <span className="ml-3 text-lg">Cargando contactos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Gestión de Contactos</h2>
          <div className="flex space-x-4 text-sm">
            <span className={themeClasses.text}>Total: {contacts.length}</span>
            <span className="text-green-600">
              Comunicados:{" "}
              {contacts.filter((c) => c.estado === "Comunicado").length}
            </span>
            <span className="text-orange-600">
              Incomunicados:{" "}
              {contacts.filter((c) => c.estado === "Incomunicado").length}
            </span>
          </div>
        </div>

        <p className={themeClasses.text}>
          Datos sincronizados desde Google Sheets. Estados actualizados en
          tiempo real desde Firebase.
        </p>

        {/* Sync Button */}
        <div className="mt-4 flex justify-end">
          <Button
            onClick={loadContacts}
            className="flex items-center justify-center md:w-96"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Sincronizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className={`rounded-lg p-4 border ${themeClasses.card} shadow-sm`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Buscar contacto */}
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar contactos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          {/* Filtro de Estado */}{}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#371959] focus:border-[#371959]"
            >
              <option value="Incomunicado">Incomunicados</option>
              <option value="Comunicado">Comunicados</option>
              <option value="all">Todos los estados</option>
            </select>
          </div>

          {/* Filtro de Localidad */}
          <div className="flex items-center space-x-2">
            <MapPinned className="w-5 h-5 text-gray-400" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#371959] focus:border-[#371959]"
            >
              <option value="">Todas las localidades</option>
              {[...new Set(contacts.map((c) => c.localidad))].map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div
        className={`rounded-lg border ${themeClasses.card} shadow-sm overflow-hidden`}
      >
        <div className="overflow-x-auto">
          <table className={`w-full ${themeClasses.table}`}>
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre y Apellido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Comunicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comunicado Por
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className={`${themeClasses.row} transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{contact.nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {contact.telefono}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPinned className="w-4 h-4 mr-2 text-gray-400" />
                      {contact.localidad}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`
                      inline-flex px-2 py-1 text-xs font-semibold rounded-full
                      ${
                        contact.estado === "Comunicado"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }
                    `}
                    >
                      {contact.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {contact.ultimoComunicacion
                      ? new Date(contact.ultimoComunicacion).toLocaleDateString(
                          "es-AR"
                        )
                      : "Nunca"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {contact.comunicadoPor && (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        {contact.comunicadoPor}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      onClick={() => handleSendMessage(contact)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Comunicar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <p className={themeClasses.text}>
              No se encontraron contactos con los filtros aplicados.
            </p>
          </div>
        )}
      </div>

      {/* WhatsApp Modal */}
      {showWhatsAppModal && selectedContact && (
        <WhatsAppModal
          isOpen={showWhatsAppModal}
          onClose={() => setShowWhatsAppModal(false)}
          contact={selectedContact}
          onMessageSent={handleMessageSent}
        />
      )}

      {/* Warning Modal */}
      {showWarningModal && selectedContact && (
        <Modal
          isOpen={showWarningModal}
          onClose={() => setShowWarningModal(false)}
          title="Advertencia"
          size="sm"
        >
          <div>
            <p className="text-sm text-gray-600 mb-6">
              Este contacto ya fue comunicado por{" "}
              {selectedContact.comunicadoPor}. ¿Estás seguro de que quieres
              enviar otro mensaje?
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowWarningModal(false)}
                variant="secondary"
              >
                Cancelar
              </Button>
              <Button onClick={handleWarningConfirmation} variant="danger">
                Enviar de todos modos
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Filter Warning Modal */}
      {showFilterWarningModal && (
        <Modal
          isOpen={showFilterWarningModal}
          onClose={() => setShowFilterWarningModal(false)}
          title="Advertencia de Filtro"
          size="md"
        >
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Estás a punto de ver la lista de contactos que ya han sido
              comunicados.
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Para evitar el spam y mantener una buena relación, te recomendamos
              contactar a estas personas solo si es necesario, con un mensaje
              personalizado o después de consultarlo con el equipo.
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowFilterWarningModal(false)}
                variant="secondary"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleFilterWarningConfirmation}
                variant="primary"
              >
                Entendido, mostrar comunicados
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
