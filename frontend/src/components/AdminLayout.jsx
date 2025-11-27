import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function AdminLayout({ logout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Latérale */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold text-center border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
<Link to="/admin" className="block p-3 rounded hover:bg-gray-700">📊 Dashboard</Link>
<Link to="/admin/users" className="block p-3 rounded hover:bg-gray-700">👥 Utilisateurs</Link>
<Link to="/admin/events" className="block p-3 rounded hover:bg-gray-700">📅 Événements</Link>
<Link to="/admin/bookings" className="block p-3 rounded hover:bg-gray-700">🎫 Réservations</Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full bg-red-600 p-2 rounded hover:bg-red-700">
            Déconnexion
          </button>
          <Link to="/" className="block text-center mt-2 text-sm text-gray-400 hover:text-white">
            Retour au site
          </Link>
        </div>
      </aside>

      {/* Contenu Principal */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet /> {/* C'est ici que les pages changeront */}
      </main>
    </div>
  );
}