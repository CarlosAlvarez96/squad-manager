import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { get, post } from '../api/apiService';

const SquadDetail = () => {
  const { id } = useParams();
  const [squad, setSquad] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUserId, setNewUserId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchSquadById = async () => {
      try {
        const data = await get(`/squad/${id}`);
        setSquad(data);
        await fetchUsersBySquadId(id);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSquadById();
  }, [id]);

  const fetchUsersBySquadId = async (squadId) => {
    try {
      const userData = await get(`/user/squad/${squadId}`);
      setUsers(userData);
    } catch (error) {
      setError(error);
    }
  };

  const handleAddUserToSquad = async () => {
    try {
      // Llama al método POST de ApiService para añadir un usuario al escuadrón
      await post(`/squad/${id}/addUser/${newUserId}`);
      setSuccessMessage('User added to squad successfully');
      setNewUserId('');
      // Vuelve a cargar la lista de usuarios después de agregar uno nuevo
      await fetchUsersBySquadId(id);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading squad details: {error.message}</p>;

  return (
    <div className='bg-white'>
      <h2>Squad Detail</h2>
      <p>ID: {squad.id}</p>
      <p>Name: {squad.name}</p>
      <div>
        <h3>Users in Squad</h3>
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Add User to Squad</h3>
        <input
          type="text"
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
          placeholder="Enter User ID"
        />
        <button onClick={handleAddUserToSquad}>Add User</button>
        {successMessage && <p>{successMessage}</p>}
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default SquadDetail;
