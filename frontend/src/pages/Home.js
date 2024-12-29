import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';
// import '../css/general.css';
import '../css/home.css';
import Footer from '../components/Footer';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token exists in localStorage and if it's valid
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login'); // Redirect to login page if token is not found
    } else {
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
      <header className="home-header">
        <div className="header-content">
          <h1>Welcome to TaskMaster</h1>
          <p>Your personal assistant to manage tasks effortlessly.</p>
          <button className="get-started-btn" onClick={() => navigate('/tasks')}>
            Get Started
          </button>
        </div>
      </header>

      <main className="home-main">
        {/* About Section */}
        <section className="about-section">
          <h2>About TaskMaster</h2>
          <p>
            TaskMaster is your go-to solution for organizing your daily life. With our AI-driven assistant,
            you can add, delete, and manage tasks effortlessly, ensuring you never miss an important deadline.
          </p>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2>Features</h2>
          <div className="features-list">
            <div className="feature">
              <h3>AI Chatbot</h3>
              <p>Interact with our intelligent assistant to add or remove tasks in seconds.</p>
            </div>
            <div className="feature">
              <h3>Task Management</h3>
              <p>View, edit, and organize your tasks to stay on top of your responsibilities.</p>
            </div>
            <div className="feature">
              <h3>Seamless Navigation</h3>
              <p>Easily access all features through a user-friendly interface.</p>
            </div>
          </div>
        </section>

        {/* Chatbot Section */}
        <section className="chatbot-section">
          <h2>Need Help?</h2>
          <p>Our AI chatbot is here to assist you at any time.</p>
          <Chatbot />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
