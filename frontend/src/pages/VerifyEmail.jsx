import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("Vérification en cours...");

    useEffect(() => {
        const verify = async () => {
            const token = searchParams.get('token');
            if (!token) return setStatus("Lien invalide.");

            try {
                // Appel au service Auth pour valider le token
                const res = await axios.post('http://127.0.0.1:8000/api/verify-email', { token });
                
                // SUPER IMPORTANT : On connecte l'utilisateur directement !
                localStorage.setItem('token', res.data.token);
                
                setStatus("✅ Compte activé ! Redirection...");
                setTimeout(() => {
                    navigate('/dashboard'); // Redirection directe vers le dashboard user
                    window.location.reload(); // Pour mettre à jour l'état global de l'app
                }, 2000);

            } catch (error) {
                setStatus("❌ Erreur : Lien expiré ou invalide.");
            }
        };
        verify();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow text-center">
                <h2 className="text-2xl font-bold mb-4">Activation du compte</h2>
                <p className="text-lg text-gray-700">{status}</p>
            </div>
        </div>
    );
}