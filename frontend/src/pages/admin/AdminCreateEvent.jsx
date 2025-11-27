// frontend/src/pages/admin/AdminCreateEvent.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminCreateEvent() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // États du formulaire
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [places, setPlaces] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('location', location);
    formData.append('places', places);
    formData.append('price', price);
    if (image) formData.append('image', image);

    try {
        await axios.post('http://127.0.0.1:8001/api/events', formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert("✅ Événement créé avec succès !");
        navigate('/'); // Retour au dashboard après création
    } catch (error) {
        alert("Erreur lors de la création.");
        console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">➕ Créer un nouvel événement</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Titre */}
        <div>
            <label className="block text-sm font-bold text-gray-700">Titre</label>
            <input type="text" required className="w-full p-2 border rounded" 
                value={title} onChange={e => setTitle(e.target.value)} />
        </div>

        {/* Date & Lieu */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold text-gray-700">Date</label>
                <input type="datetime-local" required className="w-full p-2 border rounded" 
                    value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700">Lieu</label>
                <input type="text" required className="w-full p-2 border rounded" 
                    value={location} onChange={e => setLocation(e.target.value)} />
            </div>
        </div>

        {/* Prix & Places */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold text-gray-700">Prix (€)</label>
                <input type="number" required className="w-full p-2 border rounded" 
                    value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700">Places</label>
                <input type="number" required className="w-full p-2 border rounded" 
                    value={places} onChange={e => setPlaces(e.target.value)} />
            </div>
        </div>

        {/* Image */}
        <div>
            <label className="block text-sm font-bold text-gray-700">Image</label>
            <input type="file" className="w-full p-2 border rounded" 
                onChange={e => setImage(e.target.files[0])} />
        </div>

        {/* Description */}
        <div>
            <label className="block text-sm font-bold text-gray-700">Description</label>
            <textarea required className="w-full p-2 border rounded h-32" 
                value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition">
            Publier l'événement
        </button>
      </form>
    </div>
  );
}