import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // <--- NE PAS OUBLIER CET IMPORT

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem('token');

  const fetchEvents = async () => {
    try {
        const res = await axios.get('http://127.0.0.1:8001/api/events', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(res.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleDelete = async (id) => {
      if(!confirm("Supprimer définitivement ?")) return;
      try {
          await axios.delete(`http://127.0.0.1:8001/api/events/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          setEvents(events.filter(e => e.id !== id));
      } catch (error) { alert("Erreur suppression"); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Événements</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Titre</th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Prix</th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(evt => (
              <tr key={evt.id} className="hover:bg-gray-50">
                <td className="px-5 py-5 border-b bg-white text-sm font-bold">{evt.title}</td>
                <td className="px-5 py-5 border-b bg-white text-sm">{evt.price} €</td>
                <td className="px-5 py-5 border-b bg-white text-sm text-right space-x-2">
                  {/* BOUTON MODIFIER */}
                  <Link to={`/admin/events/edit/${evt.id}`} className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-xs font-bold hover:bg-blue-200">
                    Modifier
                  </Link>
                  {/* BOUTON SUPPRIMER */}
                  <button onClick={() => handleDelete(evt.id)} className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs font-bold hover:bg-red-200">
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