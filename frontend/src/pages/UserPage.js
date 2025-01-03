import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Corrected import
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import '../css/userPage.css';

const UserPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false); // Track if edit mode is enabled
    const [updatedDetails, setUpdatedDetails] = useState({ name: '', email: '' });
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
                            setUpdatedDetails({ name: response.data.name, email: response.data.email });
                        } else {
                            console.warn('User details not found.');
                        }
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error('Error fetching user details:', error);
                        localStorage.removeItem('token'); // Clear invalid token
                        navigate('/login'); // Redirect to login
                    });
            } catch (error) {
                console.error('Invalid token', error);
                localStorage.removeItem('token'); // Clear invalid token
                navigate('/login'); // Redirect to login
            }
        }
    }, [navigate]);

    const handleEditToggle = () => {
        setEditMode(!editMode); // Toggle edit mode
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
    };

    const handleUpdate = () => {
        axios
            .put(`http://localhost:5555/users/${user._id}`, updatedDetails)
            .then((response) => {
                setUser(response.data);
                setEditMode(false); // Exit edit mode
                alert('User details updated successfully!');
            })
            .catch((error) => {
                console.error('Error updating user details:', error);
                alert('Failed to update user details. Please try again.');
            });
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            axios
                .delete(`http://localhost:5555/users/${user._id}`)
                .then(() => {
                    alert('Account deleted successfully.');
                    localStorage.removeItem('token');
                    navigate('/register'); // Redirect to signup after account deletion
                })
                .catch((error) => {
                    console.error('Error deleting account:', error);
                    alert('Failed to delete account. Please try again.');
                });
        }
    };

    return (
        <div className="home">
            <Navbar />
            <div className="user-page">
                <h1>User Details</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="user-details">
                        {user ? (
                            <div>
                                {editMode ? (
                                    <div className="edit-form">
                                        <label>
                                            Name:
                                            <input
                                                type="text"
                                                name="name"
                                                value={updatedDetails.name}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                        <label>
                                            Email:
                                            <input
                                                type="email"
                                                name="email"
                                                value={updatedDetails.email}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                        <button onClick={handleUpdate}>Save</button>
                                        <button onClick={handleEditToggle}>Cancel</button>
                                    </div>
                                ) : (
                                    <div>
                                        <p><strong>Name:</strong> {user.name}</p>
                                        <p><strong>Email:</strong> {user.email}</p>
                                        <button onClick={handleEditToggle}>Edit</button>
                                        <button onClick={handleDeleteAccount} className="delete-btn">Delete Account</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p>User details not found.</p>
                        )}
                    </div>
                )}
            </div>
            <Chatbot />
            <Footer />
        </div>
    );
};

export default UserPage;
