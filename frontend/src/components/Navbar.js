import React, { useState, useEffect } from 'react';  // Import useState and useEffect
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../css/navbar.css';  // Import the CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    const [user, setUser] = useState(null);  // Initialize state for user
    const navigate = useNavigate();  // Initialize the navigate hook

    // Fetch user data from token on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedUser = jwtDecode(token);  // Decode the token to get user info
                setUser(decodedUser);  // Set the decoded user details
            } catch (error) {
                console.error('Invalid token', error);  // Handle invalid token
            }
        } else{
            navigate('/login');
        }
    }, []);  // Empty dependency array to run this effect only once

    // Handle logout logic
    const logout = () => {
        localStorage.removeItem('token');  // Remove the token from localStorage
        navigate('/login');  // Redirect to login page after logout
    };

    return (
        <div className="navbar">
            <div className="navbar-content">
                <h1 className='navbar-heading'>Welcome, {user ? user.name : 'Guest'}</h1>
                <div className="navbar-links">
                    <a href="/">Home</a>
                    <a href="/tasks">Tasks</a>
                    <a href="/dashboard"><FontAwesomeIcon icon={faUser} className="logout-icon" /></a>
                    {user && (
                        <button onClick={logout} className="logout-button"><FontAwesomeIcon icon={faRightFromBracket} className="logout-icon" />Logout</button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Navbar;
