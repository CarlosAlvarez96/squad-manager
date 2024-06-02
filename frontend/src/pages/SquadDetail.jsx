import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { get, post } from '../api/apiService';

const SquadDetail = () => {
  const { id } = useParams();
  const [squad, setSquad] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUserEmail, setNewUserEmail] = useState('');
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
      await post(`/user/${id}/addUserByEmail`, { email: newUserEmail });
      setSuccessMessage('User added to squad successfully');
      setNewUserEmail('');
      await fetchUsersBySquadId(id);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading squad details: {error.message}</p>;

  return (
    <div className="container mx-auto p-6 m-6 bg-white rounded-lg shadow-lg ">
      <h2 className="text-3xl font-bold mb-6">Mi squad</h2>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <p className="text-xl font-semibold mb-2">ID: {squad.id}</p>
        <p className="text-xl font-semibold mb-2">Name: {squad.name}</p>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-2xl font-bold mb-4">Miembros del squad</h3>
        <ul>
          {users.map(user => (
            <li key={user.id} className="text-lg">{user.username}</li>
          ))}
        </ul>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-2xl font-bold mb-4">Add User to Squad</h3>
        <input
          type="text"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          placeholder="Enter User Email"
          className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
        />
        <button
          onClick={handleAddUserToSquad}
          className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add User
        </button>
        {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default SquadDetail;
