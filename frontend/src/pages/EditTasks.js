import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import '../css/general.css';
import '../css/editTasks.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons';

const EditTasks = () => {
    const { id } = useParams(); // Use useParams at the top level
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate for redirection

    useEffect(() => {
        const fetchTask = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');

            try {
                const response = await axios.get(`http://localhost:5555/tasks/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTitle(response.data.title);
                setDescription(response.data.description);
                setCompleted(response.data.completed);
            } catch (error) {
                console.error('Error fetching task:', error);

                // Check for session expiration
                if (error.response?.data?.action === 'redirect_to_login') {
                    localStorage.removeItem('token'); // Clear token
                    navigate('/login'); // Redirect to the login page
                } else {
                    setErrorMessage(
                        error.response?.data?.message || 'An error occurred while fetching the task'
                    );
                }
            }
            setLoading(false);
        };

        fetchTask();
    }, [id, navigate]);

    const handleEditTask = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const updatedTask = {
                title,
                description,
                completed, // Ensure this reflects the updated state, even when set to false
            };

            await axios.put(`http://localhost:5555/tasks/${id}`, updatedTask, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccessMessage('Task updated successfully!');
        } catch (error) {
            console.error('Error updating task:', error);
            setErrorMessage(
                error.response?.data?.message || 'An error occurred while updating the task'
            );
        }
        setLoading(false);
    };

    return (
        <div>
            <Navbar />
            <div className="task-div">
                <div className="createTasks-div">
                    <h2>Edit Task</h2>
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
                    <form onSubmit={handleEditTask}>
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                        <label htmlFor="completed">Completed</label>
                        <input
                            type="checkbox"
                            id="completed"
                            name="completed"
                            checked={completed}
                            onChange={() => setCompleted((prev) => !prev)} // Toggle between true/false
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Loading...' : 'Edit Task'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditTasks;
