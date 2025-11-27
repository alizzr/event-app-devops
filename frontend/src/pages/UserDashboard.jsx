import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      setUser(jwtDecode(token));
      fetchMyBookings();
    }
  }, [token]);

  // Récupération des données avec rafraîchissement pour le compteur
  // (Astuce : on force un re-render chaque seconde pour le timer)
  const [tick, setTick] = useState(0);
  useEffect(() => {
     const timer = setInterval(() => setTick(t => t + 1), 1000);
     return () => clearInterval(timer);
  }, []);

  const fetchMyBookings = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8002/api/bookings', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (e) { console.error(e); }
  };

  const handleCancel = async (id) => {
      if(!confirm("Annuler cette réservation ?")) return;
      try {
          await axios.delete(`http://127.0.0.1:8002/api/bookings?id=${id}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          setBookings(bookings.filter(b => b.id !== id));
          alert("✅ Réservation annulée.");
      } catch (error) { alert("Impossible d'annuler."); }
  };

  // Calcul du temps restant
  const getTimeRemaining = (dateStr) => {
    if (!dateStr) return null;
    const total = Date.parse(dateStr) - Date.parse(new Date());
    if (total <= 0) return null; // Événement passé
    
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-8 flex justify-between items-center border-l-4 border-teal-500">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Mon Espace</h1>
                <p className="text-gray-500">{user.email}</p>
            </div>
            <Link to="/" className="bg-gray-200 px-4 py-2 rounded font-bold hover:bg-gray-300">← Retour</Link>
        </div>

        <h2 className="text-xl font-bold mb-4 text-gray-800">Mes Réservations & Compteurs</h2>
        <div className="grid gap-6">
            {bookings.length > 0 ? bookings.map(b => {
                const timeLeft = getTimeRemaining(b.event_date);
                return (
                    <div key={b.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
                        <div className="z-10 mb-4 md:mb-0">
                            <h3 className="text-xl font-bold text-teal-700">{b.event_title}</h3>
                            <p className="text-gray-500">📅 {b.event_date ? new Date(b.event_date).toLocaleString() : 'Date inconnue'}</p>
                            <button onClick={() => handleCancel(b.id)} className="mt-3 text-red-500 hover:text-red-700 text-sm font-bold underline">
                                Annuler ma réservation
                            </button>
                        </div>

                        {/* --- LE COMPTEUR --- */}
                        <div className="z-10 text-center">
                           {timeLeft ? (
                             <div className="flex space-x-2">
                                <div className="bg-teal-600 text-white p-2 rounded-lg min-w-[60px]">
                                    <div className="font-bold text-2xl">{timeLeft.days}</div>
                                    <div className="text-[10px] uppercase">Jours</div>
                                </div>
                                <div className="bg-teal-500 text-white p-2 rounded-lg min-w-[60px]">
                                    <div className="font-bold text-2xl">{timeLeft.hours}</div>
                                    <div className="text-[10px] uppercase">Heures</div>
                                </div>
                                <div className="bg-teal-400 text-white p-2 rounded-lg min-w-[60px]">
                                    <div className="font-bold text-2xl">{timeLeft.minutes}</div>
                                    <div className="text-[10px] uppercase">Min</div>
                                </div>
                                <div className="bg-teal-300 text-white p-2 rounded-lg min-w-[60px]">
                                    <div className="font-bold text-2xl">{timeLeft.seconds}</div>
                                    <div className="text-[10px] uppercase">Sec</div>
                                </div>
                             </div>
                           ) : (
                             <div className="bg-gray-100 text-gray-500 px-6 py-3 rounded-lg font-bold border border-gray-200">
                                {b.event_date ? "🏁 Événement Terminé" : "📅 Date non définie"}
                             </div>
                           )}
                        </div>
                    </div>
                );
            }) : (
                <div className="text-center py-12 bg-white rounded shadow text-gray-500">
                    Vous n'avez aucune réservation en cours.
                </div>
            )}
        </div>
      </div>
    </div>
  );
}