import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login', { email, password });
      const token = res.data.authorisation.token;
      
      // On sauvegarde le token et on redirige
      localStorage.setItem('token', token);
      setToken(token);
      navigate('/'); // Vers le dashboard
    } catch (error) {
      alert('Identifiants incorrects');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Connexion</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-2 border rounded"
            onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Mot de passe" className="w-full p-2 border rounded"
            onChange={e => setPassword(e.target.value)} required />
          
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-gray-800">Mot de passe oublié ?</Link>
          </div>

          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
            Se connecter
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Pas de compte ? <Link to="/register" className="text-green-500">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}