import React from 'react';
import Navbar from '../components/Navbar';
import '../css/general.css';
import Chatbot from '../components/Chatbot';


const Home = () => {
  

  return (
    <div className="home">
      <Navbar />
      <h1>This is home page</h1>
      <Chatbot />
    </div>
  );
};

export default Home;
