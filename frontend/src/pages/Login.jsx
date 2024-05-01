import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, setEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://wondernotes.onrender.com/jwtauth/login',
        `grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const userResponse = await axios.get('https://wondernotes.onrender.com/jwtauth/users/me', {
        headers: {
          Authorization: `Bearer ${response.data.access_token}`,
        },
      });

      const userEmail = userResponse.data.email || 'default@example.com';
      setEmail(userEmail);
      console.log(userEmail)
 
      login(response.data.access_token, username,password, userEmail);
      Swal.fire({
        icon:'success',
        title: 'Login successful',
        text: `Welcome, ${username}!`,
      })
      console.log('Login successful');
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Credentials error',
      });
    }
  };

  return (
    <div className={`mt-20 `}>
      <form className={`max-w-sm mx-auto `} onSubmit={handleSubmit}>
        <h2
          htmlFor="username"
          className={`block mb-4 text-2xl font-medium `}
        >
          Sign in
        </h2>
        <hr className="mb-10" />
        <div className={`mb-5 `}>
          <label
            htmlFor="username"
            className={`block mb-2 text-sm font-medium `}
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 `}
            placeholder="John Doe"
            required
          />
        </div>
  
        <div className={`mb-5 `}>
          <label
            htmlFor="password"
            className={`block mb-2 text-sm font-medium `}
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 `}
            required
          />
        </div>
        <button
          type="submit"
          className={` bg-gray-300 hover:bg-gray-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center `}
        >
          Submit
        </button>
      </form>
    </div>
  );
  
};

export default Login;   