import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../css/taskDetails.css'; // Link to the new CSS file
import '../css/general.css';
import Footer from '../components/Footer';

const TaskDetails = () => {
    const { id } = useParams();
    const [task, setTask] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
                setTask(response.data);
            } catch (error) {
                console.error('Error fetching task:', error);

                if (error.response?.data?.action === 'redirect_to_login') {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError(
                        error.response?.data?.message || 'An error occurred while fetching the task'
                    );
                }
            }
            setLoading(false);
        };

        fetchTask();
    }, [id, navigate]);

    return (
        <div>
            <Navbar />
            <div className="task-details-container">
                {loading && <p>Loading task...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && (
                    <div className="task-details-card">
                        <h2 className="task-details-title">{task.title}</h2>
                        <p><strong>Task ID:</strong> {task._id}</p>
                        <p><strong>Description:</strong> {task.description}</p>
                        <p>
                            <strong>Status:</strong>{' '}
                            <span className={`status ${task.completed ? 'completed' : 'not-completed'}`}>
                                {task.completed ? 'Completed' : 'Not Completed'}
                            </span>
                        </p>
                        <p><strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}</p>
                    </div>
                )}
            </div>
            <Footer/>
        </div>
    );
};

export default TaskDetails;
