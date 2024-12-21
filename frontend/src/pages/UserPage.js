import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';  // Corrected import
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../css/general.css';

const UserPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
        } else {
            try {
                const decodedUser = jwtDecode(token);

                axios.get(`http://localhost:5555/users/${decodedUser.id}`)
                    .then(response => {
                        if (response.data) {
                            setUser(response.data);
                        } else {
                            console.warn('User details not found.');
                        }
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error('Error fetching user details:', error);
                        localStorage.removeItem('token');  // Clear invalid token
                        navigate('/login');  // Redirect to login
                    });
            } catch (error) {
                console.error('Invalid token', error);
                localStorage.removeItem('token');  // Clear invalid token
                navigate('/login');  // Redirect to login
            }
        }
    }, [navigate]);
    return (
        <div className="home">
            <Navbar />
            <div className="user-details">
                <h1>User Details</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        {user ? (
                            <div className="user-details">
                                <p><strong>Name:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                            </div>
                        ) : (
                            <p>User details not found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserPage