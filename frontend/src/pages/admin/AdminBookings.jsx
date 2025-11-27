import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem('token');

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8002/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchBookings(); }, []);

  // Fonction de suppression
  const handleDelete = async (id) => {
      if(!confirm("⚠️ Admin : Supprimer cette réservation ?")) return;
      try {
          // On appelle le DELETE avec l'ID en paramètre URL
          await axios.delete(`http://127.0.0.1:8002/api/bookings?id=${id}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          setBookings(bookings.filter(b => b.id !== id)); // Mise à jour visuelle
          alert("Réservation supprimée.");
      } catch (error) {
          alert("Erreur lors de la suppression");
      }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Réservations</h2>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Événement</th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Client (ID)</th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-5 py-5 border-b bg-white text-sm">#{b.id}</td>
                <td className="px-5 py-5 border-b bg-white text-sm font-bold">{b.event_title}</td>
                <td className="px-5 py-5 border-b bg-white text-sm">User #{b.user_id}</td>
                <td className="px-5 py-5 border-b bg-white text-sm text-right">
                    <button onClick={() => handleDelete(b.id)} className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs font-bold hover:bg-red-200">
                        Supprimer
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}