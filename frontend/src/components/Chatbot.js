import React, { useState } from 'react';
import axios from 'axios';
import '../css/chatbot.css';  // Importing external CSS for styling

const Chatbot = () => {
    const [userInput, setUserInput] = useState('');
    const [reply, setReply] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle chat visibility

    const handleSend = async () => {
        try {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');
            
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
        // Clear the input field after sending
        setUserInput('');
    };

    const toggleChatWindow = () => {
        setIsChatOpen(!isChatOpen); // Toggle chat window visibility
    };

    return (
        <div>
            {/* Chatbot icon to toggle chat window */}
            <div className={`chatbot-icon ${isChatOpen ? 'open' : ''}`} onClick={toggleChatWindow}>
                <span>💬</span>
            </div>

            {/* Chat window */}
            {isChatOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <span>Chat with us</span>
                        <button className="close-btn" onClick={toggleChatWindow}>X</button>
                    </div>
                    <div className="chat-body">
                        <div className="messages">
                            {reply && <p><strong>AI:</strong> {reply}</p>}
                        </div>
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button className="send-btn" onClick={handleSend}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
