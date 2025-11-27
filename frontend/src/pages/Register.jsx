import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', password_confirmation: ''
  });
  const [isSuccess, setIsSuccess] = useState(false); // Nouvel état pour le message
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://127.0.0.1:8000/api/register', formData);
      setIsSuccess(true); // On active le message de succès
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  // Si l'inscription est réussie, on affiche juste le message
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border-t-4 border-green-500">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Inscription réussie !</h2>
          <p className="text-gray-600 mb-6">
            Un email de validation vient de vous être envoyé à <strong>{formData.email}</strong>.
            Veuillez cliquer sur le lien reçu pour activer votre compte.
          </p>
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  // Sinon, on affiche le formulaire classique
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Créer un compte</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nom complet" className="w-full p-2 border rounded"
            onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input type="email" placeholder="Email" className="w-full p-2 border rounded"
            onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Mot de passe" className="w-full p-2 border rounded"
            onChange={e => setFormData({...formData, password: e.target.value})} required />
          <input type="password" placeholder="Confirmer le mot de passe" className="w-full p-2 border rounded"
            onChange={e => setFormData({...formData, password_confirmation: e.target.value})} required />
          
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
            S'inscrire
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Déjà un compte ? <Link to="/login" className="text-blue-500">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}