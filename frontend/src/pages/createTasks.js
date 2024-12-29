import React, { useState } from 'react';
import axios from 'axios';
import '../css/createTask.css';
import '../css/general.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Footer from '../components/Footer';

const CreateTasks = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate for redirection

    const handleAddTask = (event) => {
        event.preventDefault(); // Prevent form submission

        const task = { title, description };
        const token = localStorage.getItem('token'); // Retrieve the token

        if (!token) {
            setErrorMessage('You are not logged in. Redirecting to login page...');
            setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
            return;
        }

        setLoading(true);

        axios
            .post('http://localhost:5555/tasks', task, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setLoading(false);
                setSuccessMessage('Task created successfully');
                setErrorMessage('');
                setTitle('');
                setDescription('');
            })
            .catch((err) => {
                setLoading(false);

                // Handle authentication errors
                if (err.response?.data?.action === 'redirect_to_login') {
                    setErrorMessage('Session expired. Redirecting to login page...');
                    localStorage.removeItem('token'); // Clear token
                    setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
                } else if (err.response && err.response.data && err.response.data.message) {
                    setErrorMessage(err.response.data.message);
                } else {
                    setErrorMessage('Task creation failed. Please try again later.');
                    console.error(err);
                }
            });
    };

    return (
        <div>
            <Navbar />
            <div className="task-div">
                <div className="createTasks-div">
                    <h1 className="title">Create Tasks</h1>
                    {successMessage && (
                        <p className="success-message">
                            <FontAwesomeIcon icon={faCheck} className="success-icon" />
                            {successMessage}
                        </p>
                    )}
                    {errorMessage && (
                        <p className="error-message">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="alert-icon" />
                            {errorMessage}
                        </p>
                    )}
                    <form onSubmit={handleAddTask}>
                        <div className="form-group">
                            <label htmlFor="title" className="label">Title</label><br />
                            <input
                                type="text"
                                id="title"
                                placeholder="Enter Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description" className="label">Description</label><br />
                            <input
                                type="text"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter description"
                                className="input"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="reg-button">
                            {loading ? 'Creating...' : 'Create Task'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CreateTasks;
