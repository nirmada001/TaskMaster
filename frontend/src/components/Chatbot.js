import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [userInput, setUserInput] = useState('');
    const [reply, setReply] = useState('');

    const handleSend = async () => {
        try {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                console.log("No token found");
                return;  // Exit early if token is not found
            }

            console.log('Token from localStorage:', token);  // Log the token

            // Send the user input along with the token in the Authorization header
            const response = await axios.post(
                'http://localhost:5555/api/ai/chat',
                { userInput },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Attach the token here
                    },
                }
            );
            setReply(response.data.reply);
        } catch (error) {
            console.error('Error communicating with chatbot:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
            />
            <button onClick={handleSend}>Send</button>
            {reply && <p>AI Reply: {reply}</p>}
        </div>
    );
};

export default Chatbot;
