import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { get, post } from '../api/apiService.js';
import '../Squad.css';

const Squad = () => {
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSquadName, setNewSquadName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('hola'); // Verificar si se llega al inicio del useEffect
        // Llamada al endpoint user/me para obtener el ID del usuario actual
        const response = await get('/user/me');
        console.log(response); // Verificar la respuesta del endpoint
        const userId = response.id; // Obtener el ID del usuario
  
        // Utilizar el ID del usuario para obtener los escuadrones asociados a ese usuario
        const data = await get(`/user/squads/${userId}`);
        setSquads(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const handleCreateSquad = async () => {
    try {
      await post('/squad/create', { name: newSquadName });
      const newData = await get('/squad/all');
      setSquads(newData);
      setNewSquadName('');
    } catch (error) {
      setError(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading squads: {error.message}</p>;

  return (
    <div className="container bg-white p-5 rounded-md m-10 mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Squads</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {squads.map(squad => (
          <Link key={squad.id} to={`/SquadDetail/${squad.id}`}>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{squad.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Create a new squad</h2>
        <div className="flex">
          <input
            type="text"
            value={newSquadName}
            onChange={(e) => setNewSquadName(e.target.value)}
            className="border border-gray-300 rounded-l-lg px-4 py-2 w-full sm:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter squad name"
          />
          <button
            onClick={handleCreateSquad}
            className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Squad
          </button>
        </div>
      </div>
    </div>
  );
};

export default Squad;
