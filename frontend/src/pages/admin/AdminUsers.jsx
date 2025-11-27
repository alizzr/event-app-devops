import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  // Charger la liste des utilisateurs (Port 8000 - Laravel)
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Erreur chargement users", error);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Supprimer un utilisateur
  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.")) return;
    
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u.id !== id));
      alert("🗑️ Utilisateur supprimé !");
    } catch (error) {
      alert("Erreur : " + (error.response?.data?.message || "Impossible de supprimer"));
    }
  };

  // Changer le rôle (Admin <-> User)
  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Passer cet utilisateur en ${newRole.toUpperCase()} ?`)) return;

    try {
      await axios.put(`http://127.0.0.1:8000/api/users/${user.id}/role`, 
        { role: newRole }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Mise à jour locale de la liste
      setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
      alert(`✅ Rôle modifié : ${newRole}`);
    } catch (error) {
      alert("Erreur : " + (error.response?.data?.message || "Impossible de modifier le rôle"));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Utilisateurs</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Nom</th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Rôle</th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-5 py-5 border-b bg-white text-sm text-gray-500">#{u.id}</td>
                <td className="px-5 py-5 border-b bg-white text-sm font-bold">{u.name}</td>
                <td className="px-5 py-5 border-b bg-white text-sm">{u.email}</td>
                <td className="px-5 py-5 border-b bg-white text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="px-5 py-5 border-b bg-white text-sm text-right space-x-2">
                  {/* Bouton Rôle */}
                  <button 
                    onClick={() => toggleRole(u)}
                    className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1 rounded text-xs font-bold transition"
                  >
                    {u.role === 'admin' ? '⬇️ Rétrograder' : '⬆️ Promouvoir'}
                  </button>
                  
                  {/* Bouton Supprimer */}
                  <button 
                    onClick={() => handleDelete(u.id)}
                    className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded text-xs font-bold transition"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div className="p-4 text-center text-gray-500">Aucun utilisateur trouvé.</div>}
      </div>
    </div>
  );
}