import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function AdminEditEvent() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  // 1. On récupère le token
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    title: '', description: '', date: '', location: '', places: '', price: ''
  });
  const [currentImage, setCurrentImage] = useState(null);
  const [newImage, setNewImage] = useState(null);

  // Charger les données actuelles
  useEffect(() => {
    // Si pas de token, on redirige vers le login
    if (!token) {
        navigate('/login');
        return;
    }

    const fetchEvent = async () => {
      try {
        // --- CORRECTION ICI : ON AJOUTE LE TOKEN DANS LE HEADER ---
        const res = await axios.get('http://127.0.0.1:8001/api/events', {
            headers: { Authorization: `Bearer ${token}` }
        });
        // ----------------------------------------------------------

        // On cherche le bon événement dans la liste
        // (Note: Idéalement, on ferait un endpoint GET /api/events/{id} côté Symfony, mais ça marche comme ça pour l'instant)
        const event = res.data.find(e => e.id === parseInt(id));
        
        if (event) {
          const formattedDate = event.date.replace(' ', 'T');
          setFormData({
            title: event.title,
            description: event.description || '',
            date: formattedDate,
            location: event.location,
            places: event.places,
            price: event.price
          });
          setCurrentImage(event.image);
        } else {
            alert("Événement introuvable");
            navigate('/admin/events');
        }
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 401) {
            alert("Session expirée. Veuillez vous reconnecter.");
            navigate('/login');
        }
      }
    };
    fetchEvent();
  }, [id, token, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('date', formData.date);
    data.append('location', formData.location);
    data.append('places', formData.places);
    data.append('price', formData.price);
    
    if (newImage) {
        data.append('image', newImage);
    }

    try {
        await axios.post(`http://127.0.0.1:8001/api/events/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert("✅ Événement modifié !");
        navigate('/admin/events'); 
    } catch (error) {
        console.error(error);
        alert("Erreur lors de la modification");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Modifier l'événement #{id}</h2>
      
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
            <label className="block text-sm font-medium">Titre</label>
            <input type="text" className="w-full border p-2 rounded" 
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium">Date</label>
                <input type="datetime-local" className="w-full border p-2 rounded"
                    value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-medium">Lieu</label>
                <input type="text" className="w-full border p-2 rounded"
                    value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium">Prix (€)</label>
                <input type="number" className="w-full border p-2 rounded"
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-medium">Places</label>
                <input type="number" className="w-full border p-2 rounded"
                    value={formData.places} onChange={e => setFormData({...formData, places: e.target.value})} />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea className="w-full border p-2 rounded h-24"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>

        <div className="border p-4 rounded bg-gray-50">
            <label className="block text-sm font-medium mb-2">Image</label>
            <div className="flex items-center space-x-4">
                {currentImage && (
                    <div className="text-center">
                        <span className="text-xs text-gray-500 block">Actuelle</span>
                        <img src={`http://127.0.0.1:8001/uploads/${currentImage}`} className="h-16 w-16 object-cover rounded" />
                    </div>
                )}
                <div>
                    <span className="text-xs text-gray-500 block">Nouvelle (laisser vide pour garder l'actuelle)</span>
                    <input type="file" onChange={e => setNewImage(e.target.files[0])} />
                </div>
            </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
            Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}