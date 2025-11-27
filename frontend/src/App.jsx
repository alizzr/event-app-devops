import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode"; 

// Pages Publiques / Utilisateur
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import VerifyEmail from './pages/VerifyEmail';
import LandingPage from './pages/LandingPage';

// Pages Admin
import AdminLayout from './components/AdminLayout'; 
import AdminUsers from './pages/admin/AdminUsers'; 
import AdminEvents from './pages/admin/AdminEvents';
import AdminEditEvent from './pages/admin/AdminEditEvent';
import AdminCreateEvent from './pages/admin/AdminCreateEvent';
import AdminBookings from './pages/admin/AdminBookings';

// --- 1. FONCTION UTILITAIRE DE SÉCURITÉ (Anti-Crash) ---
// Cette fonction essaie de décoder le token. Si ça rate, elle renvoie null sans faire planter l'app.
const safeDecode = (token) => {
    if (!token || typeof token !== 'string') return null;
    try {
        return jwtDecode(token);
    } catch (e) {
        return null;
    }
};

// --- 2. COMPOSANT ROUTE PROTÉGÉE ADMIN ---
const AdminRoute = ({ token }) => {
    const user = safeDecode(token);
    // Si le token est invalide ou si le rôle n'est pas 'admin', on redirige
    if (!user || user.role !== 'admin') return <Navigate to="/login" />;
    return <Outlet />;
};

// --- 3. COMPOSANT DASHBOARD PRINCIPAL ---
function Dashboard({ token, logout }) {
  const [events, setEvents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // États des filtres et chargement
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loadingId, setLoadingId] = useState(null);

  // --- SÉCURITÉ ET INITIALISATION ---
  useEffect(() => {
    const user = safeDecode(token);
    
    // Si le token est invalide ou expiré, on déconnecte proprement
    if (!user || (user.exp * 1000 < Date.now())) {
        logout();
        return;
    }

    // Sinon, on met à jour l'interface selon le rôle
    setIsAdmin(user.role === 'admin');
  }, [token, logout]);

  // Chargement des événements (avec filtres)
  const fetchEvents = async () => {
    try {
        const params = new URLSearchParams();
        if (search.trim()) params.append('search', search);
        if (locationFilter.trim()) params.append('location', locationFilter);
        if (dateFilter) params.append('date', dateFilter);

        const res = await axios.get(`http://127.0.0.1:8001/api/events?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(res.data);
    } catch (e) { console.error("Erreur chargement événements"); }
  };

  // Effet de recherche (Debounce)
  useEffect(() => { 
      const delay = setTimeout(() => { fetchEvents(); }, 300);
      return () => clearTimeout(delay);
  }, [search, locationFilter, dateFilter]);

  // Action de réservation
  const handleBooking = async (event) => {
    if (event.places <= 0) return alert("Complet !");
    if(!confirm(`Payer ${event.price}€ et réserver ?`)) return;

    setLoadingId(event.id); 
    try {
      await axios.post('http://127.0.0.1:8002/api/bookings', 
        { event_id: event.id, event_title: event.title, event_date: event.date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Réservé !");
      fetchEvents(); 
    } catch (error) { 
        const msg = error.response?.data?.message || "Erreur";
        alert("❌ " + msg); 
    } finally { setLoadingId(null); }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📅 Événements</h1>
        <div className="space-x-4">
          {!isAdmin && <Link to="/dashboard" className="bg-teal-500 text-white px-4 py-2 rounded font-bold shadow">👤 Mon Espace</Link>}
          {isAdmin && (
            <>
                <Link to="/admin/events/new" className="bg-green-600 text-white px-4 py-2 rounded font-bold shadow">➕ Créer</Link>
                <Link to="/admin" className="bg-purple-600 text-white px-4 py-2 rounded font-bold shadow">👑 Admin</Link>
            </>
          )}
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded font-bold shadow">Déconnexion</button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded shadow mb-8 flex flex-col md:flex-row gap-4">
          <input type="text" placeholder="Rechercher..." className="border p-2 flex-1 rounded" value={search} onChange={e => setSearch(e.target.value)} />
          <input type="text" placeholder="Ville..." className="border p-2 flex-1 rounded" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} />
          <input type="date" className="border p-2 flex-1 rounded" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
      </div>

      {/* Liste des cartes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {events.map(evt => (
          <div key={evt.id} className="bg-white rounded shadow overflow-hidden hover:shadow-lg transition">
            <div className="h-48 bg-gray-200 relative">
                {evt.image ? <img src={`http://127.0.0.1:8001/uploads/${evt.image}`} className="w-full h-full object-cover"/> : <div className="p-10 text-center text-gray-400">Pas d'image</div>}
                <span className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 m-2 rounded font-bold">{evt.price} €</span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{evt.title}</h3>
              <p className="text-sm text-gray-500">{new Date(evt.date).toLocaleString()} • {evt.location}</p>
              <p className="text-sm mt-2 mb-4 font-semibold text-blue-600">{evt.places} places restantes</p>
              <button 
                onClick={() => handleBooking(evt)} 
                disabled={loadingId === evt.id || evt.places === 0}
                className={`w-full py-2 rounded text-white font-bold ${evt.places === 0 ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {loadingId === evt.id ? "Traitement..." : (evt.places === 0 ? "Complet" : "Réserver")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 4. APPLICATION PRINCIPALE (GESTION GLOBALE) ---
export default function App() {
  // Initialisation : On récupère le token, mais on vérifie qu'il n'est pas corrompu
  const [token, setToken] = useState(() => {
      const t = localStorage.getItem('token');
      return (t && t !== 'null' && t !== 'undefined') ? t : null;
  });

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    // Pas de window.location.href ici pour éviter le rechargement brutal, React Router gère la redirection
  };

  // Intercepteur global pour les erreurs 401 (Expiration session)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response, 
      (error) => {
        if (error.response && error.response.status === 401) {
          logout(); 
        }
        return Promise.reject(error);
      }
    );
    return () => { axios.interceptors.response.eject(interceptor); };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes Publiques */}
        <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<div className="text-center mt-20">À venir...</div>} />

        {/* Routes Protégées Utilisateur */}
     {/* PAGE D'ACCUEIL PUBLIQUE */}
<Route path="/" element={<LandingPage />} />

{/* LISTE DES ÉVÉNEMENTS (Anciennement Accueil) */}
{/* Note : On force le login pour voir les événements, ou on peut le laisser public selon votre choix */}
<Route path="/events" element={token ? <Dashboard token={token} logout={logout} /> : <Navigate to="/login" />} />

{/* DASHBOARD PERSONNEL (Mes réservations) */}
<Route path="/dashboard" element={token ? <UserDashboard /> : <Navigate to="/login" />} />

        {/* Routes Protégées Admin */}
        <Route path="/admin" element={<AdminRoute token={token} />}>
            <Route element={<AdminLayout logout={logout} />}>
                <Route index element={<div className="text-2xl font-bold">Bienvenue Admin 👋</div>} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="events/new" element={<AdminCreateEvent />} />
                <Route path="events/edit/:id" element={<AdminEditEvent />} />
                <Route path="bookings" element={<AdminBookings />} />
            </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}