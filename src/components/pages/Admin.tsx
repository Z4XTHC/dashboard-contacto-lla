import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useTheme } from '../../contexts/ThemeContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { UserPlus, Edit3, Shield, Users as UsersIcon } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  role: 'Administrador' | 'Usuario';
  createdAt: string;
}

export default function Admin() {
  const { speak } = useAccessibility();
  const { theme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Create User Form
  const [newUser, setNewUser] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    role: 'Usuario' as 'Administrador' | 'Usuario'
  });

  // Edit User Form
  const [editUser, setEditUser] = useState({
    email: '',
    role: 'Usuario' as 'Administrador' | 'Usuario'
  });

  useEffect(() => {
    speak('Panel de administración cargado');
    loadUsers();
  }, [speak]);

  const loadUsers = () => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData: User[] = [];
      snapshot.forEach(doc => {
        usersData.push({
          id: doc.id,
          ...doc.data()
        } as User);
      });
      setUsers(usersData);
    });

    return () => unsubscribe();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        newUser.email, 
        newUser.password
      );

      // Guardar información adicional en Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        nombre: newUser.nombre,
        apellido: newUser.apellido,
        email: newUser.email,
        role: newUser.role,
        createdAt: new Date().toISOString()
      });

      setNewUser({ nombre: '', apellido: '', email: '', password: '', role: 'Usuario' });
      setShowCreateModal(false);
      speak(`Usuario ${newUser.email} creado exitosamente`);
    } catch (error: any) {
      console.error('Error creating user:', error);
      speak('Error al crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setLoading(true);

    try {
      await updateDoc(doc(db, 'users', selectedUser.id), {
        role: editUser.role
      });

      setShowEditModal(false);
      setSelectedUser(null);
      speak(`Usuario ${editUser.email} actualizado exitosamente`);
    } catch (error: any) {
      console.error('Error updating user:', error);
      speak('Error al actualizar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditUser({
      email: user.email,
      role: user.role
    });
    setShowEditModal(true);
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          card: 'bg-gray-800 text-white border-gray-700',
          table: 'bg-gray-800',
          row: 'border-gray-700 hover:bg-gray-700',
          text: 'text-gray-300'
        };
      case 'high-contrast':
        return {
          card: 'bg-white text-black border-black border-2',
          table: 'bg-white',
          row: 'border-black hover:bg-gray-100',
          text: 'text-black'
        };
      default:
        return {
          card: 'bg-white text-gray-900 border-gray-200',
          table: 'bg-white',
          row: 'border-gray-200 hover:bg-gray-50',
          text: 'text-gray-600'
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Shield className="w-6 h-6 mr-3 text-[#371959]" />
            Administración de Usuarios
          </h2>
          <Button onClick={() => setShowCreateModal(true)} className="bg-[#371959] hover:bg-[#2d1247]">
            <UserPlus className="w-4 h-4 mr-2" />
            Crear Usuario
          </Button>
        </div>
        <p className={themeClasses.text}>
          Gestiona los usuarios del sistema, asigna roles y controla los permisos de acceso.
        </p>
      </div>

      {/* Users Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${themeClasses.text}`}>Total Usuarios</p>
              <p className="text-3xl font-bold mt-2">{users.length}</p>
            </div>
            <UsersIcon className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${themeClasses.text}`}>Administradores</p>
              <p className="text-3xl font-bold mt-2">
                {users.filter(u => u.role === 'Administrador').length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className={`rounded-lg p-6 border ${themeClasses.card} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${themeClasses.text}`}>Usuarios Regulares</p>
              <p className="text-3xl font-bold mt-2">
                {users.filter(u => u.role === 'Usuario').length}
              </p>
            </div>
            <UsersIcon className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className={`rounded-lg border ${themeClasses.card} shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className={`w-full ${themeClasses.table}`}>
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Creación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className={`${themeClasses.row} transition-colors`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{user.nombre} {user.apellido}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex px-2 py-1 text-xs font-semibold rounded-full
                      ${user.role === 'Administrador' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                      }
                    `}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(user.createdAt).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      onClick={() => openEditModal(user)}
                      size="sm"
                      variant="secondary"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className={themeClasses.text}>No hay usuarios registrados en el sistema.</p>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nuevo Usuario"
        size="md"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              label="Nombre"
              value={newUser.nombre}
              onChange={(e) => setNewUser({...newUser, nombre: e.target.value})}
              required
            />
            <Input
              type="text"
              label="Apellido"
              value={newUser.apellido}
              onChange={(e) => setNewUser({...newUser, apellido: e.target.value})}
              required
            />
          </div>
          <Input
            type="email"
            label="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            required
          />
          
          <Input
            type="password"
            label="Contraseña"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            required
            minLength={6}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value as 'Administrador' | 'Usuario'})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#371959] focus:border-[#371959]"
            >
              <option value="Usuario">Usuario</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creando...' : 'Crear Usuario'}
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Usuario"
        size="md"
      >
        <form onSubmit={handleEditUser} className="space-y-4">
          <Input
            type="email"
            label="Email"
            value={editUser.email}
            disabled
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              value={editUser.role}
              onChange={(e) => setEditUser({...editUser, role: e.target.value as 'Administrador' | 'Usuario'})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#371959] focus:border-[#371959]"
            >
              <option value="Usuario">Usuario</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Actualizando...' : 'Actualizar Usuario'}
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setShowEditModal(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
