import { Link } from 'react-router-dom';

export default function LandingPage() {
  const token = localStorage.getItem('token');

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-white">
      
      {/* --- NAVBAR TRANSPARENTE --- */}
      <nav className="flex justify-between items-center p-6 absolute w-full z-20">
        <div className="text-2xl font-extrabold text-white tracking-wide drop-shadow-md">
          EVENT<span className="text-blue-400">APP</span>
        </div>
        <div className="space-x-4">
          {token ? (
            <Link to="/dashboard" className="bg-white text-blue-900 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
              Mon Espace
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-blue-200 font-medium transition px-4">Connexion</Link>
              <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-lg border border-blue-500">
                Inscription
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative h-[600px] flex flex-col justify-center items-center text-center bg-gray-900 text-white overflow-hidden">
        {/* Image de fond assombrie */}
        <div className="absolute inset-0">
            <img 
                src="https://images.unsplash.com/photo-1459749411177-3c2ea1f21e64?q=80&w=2070&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-40" 
                alt="Concert crowd"
            />
            {/* Dégradé pour la lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-white"></div>
        </div>
        
        {/* Contenu Hero */}
        <div className="z-10 px-4 max-w-5xl animate-fade-in-up">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-900/50 border border-blue-500 text-blue-300 text-sm font-semibold mb-4">
            🚀 La plateforme n°1 de gestion d'événements
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            Créez des souvenirs <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Inoubliables
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
            Rejoignez une communauté de passionnés. Concerts, conférences, festivals : tout commence ici.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/events" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-full font-bold transition transform hover:scale-105 shadow-xl ring-4 ring-blue-600/30">
              Découvrir les événements
            </Link>
            {!token && (
                <Link to="/register" className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white text-lg px-8 py-4 rounded-full font-bold transition">
                  Organiser un événement
                </Link>
            )}
          </div>
        </div>
      </header>

      {/* --- SECTION STATS --- */}
      <section className="py-10 bg-white -mt-16 relative z-10 max-w-5xl mx-auto w-full px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center border border-gray-100">
            <div>
                <div className="text-4xl font-extrabold text-blue-600 mb-2">10k+</div>
                <div className="text-gray-500 font-medium">Utilisateurs Actifs</div>
            </div>
            <div className="md:border-l md:border-r border-gray-100">
                <div className="text-4xl font-extrabold text-purple-600 mb-2">500+</div>
                <div className="text-gray-500 font-medium">Événements par mois</div>
            </div>
            <div>
                <div className="text-4xl font-extrabold text-green-600 mb-2">100%</div>
                <div className="text-gray-500 font-medium">Paiements Sécurisés</div>
            </div>
        </div>
      </section>

      {/* --- SECTION POURQUOI NOUS (FEATURES) --- */}
      <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pourquoi choisir EventApp ?</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">Une suite d'outils puissants conçus pour simplifier la vie des organisateurs et des participants.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {/* Feature 1 */}
                  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 text-center">
                      <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                        🔒
                      </div>
                      <h3 className="text-xl font-bold mb-3">Billetterie Sécurisée</h3>
                      <p className="text-gray-600">Vos transactions sont protégées. Recevez vos billets numériques instantanément par email avec un code unique.</p>
                  </div>

                  {/* Feature 2 */}
                  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 text-center">
                      <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                        ⚡
                      </div>
                      <h3 className="text-xl font-bold mb-3">Temps Réel</h3>
                      <p className="text-gray-600">Suivez les places restantes en direct. Notre système haute performance gère les fortes affluences sans bug.</p>
                  </div>

                  {/* Feature 3 */}
                  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 text-center">
                      <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                        📱
                      </div>
                      <h3 className="text-xl font-bold mb-3">Dashboard Intuitif</h3>
                      <p className="text-gray-600">Retrouvez tous vos événements, gérez vos réservations et accédez à votre historique depuis un espace unique.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* --- SECTION CATÉGORIES --- */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">Catégories Populaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Concerts', 'Festivals', 'Tech & IA', 'Business', 'Sport', 'Art', 'Théâtre', 'Gastronomie'].map((cat, i) => (
                    <div key={i} className="group relative h-32 rounded-xl overflow-hidden cursor-pointer shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                        <img 
                            src={`https://source.unsplash.com/random/400x300?${cat.split(' ')[0]}`} 
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                            alt={cat} 
                            onError={(e) => e.target.style.display = 'none'} // Fallback si l'image ne charge pas
                        />
                        {/* Fallback background color si pas d'image */}
                        <div className="absolute inset-0 bg-gray-800 -z-10"></div>
                        
                        <span className="absolute bottom-4 left-4 text-white font-bold z-20 text-lg">{cat}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- CALL TO ACTION FOOTER --- */}
      <section className="py-20 bg-blue-600 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à vivre l'expérience ?</h2>
          <p className="text-blue-100 mb-8 text-lg max-w-xl mx-auto">Ne manquez plus aucun événement. Rejoignez des milliers d'utilisateurs dès aujourd'hui.</p>
          <Link to="/register" className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
              Créer mon compte gratuitement
          </Link>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
                <div className="text-2xl font-bold text-white mb-4">EVENT<span className="text-blue-500">APP</span></div>
                <p className="text-sm">La solution complète pour la gestion d'événements en microservices.</p>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Liens Rapides</h4>
                <ul className="space-y-2 text-sm">
                    <li><Link to="/events" className="hover:text-white">Événements</Link></li>
                    <li><Link to="/login" className="hover:text-white">Connexion</Link></li>
                    <li><Link to="/register" className="hover:text-white">Inscription</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Légal</h4>
                <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-white">Mentions légales</a></li>
                    <li><a href="#" className="hover:text-white">Confidentialité</a></li>
                    <li><a href="#" className="hover:text-white">CGV</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Contact</h4>
                <p className="text-sm">support@eventapp.com</p>
                <p className="text-sm">+33 1 23 45 67 89</p>
            </div>
        </div>
        <div className="text-center text-sm border-t border-gray-800 pt-8">
            &copy; 2025 EventApp Microservices. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}