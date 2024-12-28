import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useHistory hook for navigation
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';
import '../css/general.css';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token exists in localStorage and if it's valid
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login'); // Redirect to login page if token is not found
    } else {
      // You can add logic here to validate the token if necessary (e.g., by decoding the JWT or making a backend request)
      const tokenExpiration = JSON.parse(atob(token.split('.')[1])).exp;
      const currentTime = Math.floor(Date.now() / 1000);

      if (tokenExpiration < currentTime) {
        localStorage.removeItem('token'); // Remove expired token
        navigate('/login'); // Redirect to login page if token is expired
      }
    }
  }, [navigate]);

  return (
    <div className="home">
      <Navbar />
      <div className="home-content">
        <h1>Welcome to Your Dashboard</h1>
        <p>Explore your tasks, manage your activities, and chat with the assistant below.</p>
        <Chatbot />
      </div>
    </div>
  );
};

export default Home;
