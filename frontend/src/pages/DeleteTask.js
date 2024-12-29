import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import Footer from '../components/Footer';

const DeleteTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const deleteTask = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');

            try {
                await axios.delete(`http://localhost:5555/tasks/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSuccessMessage('Task deleted successfully');
                navigate('/tasks');
            } catch (error) {
                console.error('Error deleting task:', error);
                if (error.response?.data?.action === 'redirect_to_login') {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError(
                        error.response?.data?.message || 'An error occurred while deleting the task'
                    );
                }
            }
            setLoading(false);
        };

        deleteTask();
    }, [id, navigate]);

  return (
    <div>
        <Navbar />
        <div className="task-list-container">
            <div className="task-header">
            <h1>Delete Task</h1>
            </div>
            {loading && <p>Deleting task...</p>}
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
        <Footer />
    </div>
  )
}

export default DeleteTask