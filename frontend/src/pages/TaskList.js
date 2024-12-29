import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../css/taskList.css';
import '../css/general.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faInfoCircle, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import Chatbot from '../components/Chatbot';
import Footer from '../components/Footer';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');

            try {
                const response = await axios.get('http://localhost:5555/tasks', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                if (error.response?.data?.action === 'redirect_to_login') {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError(
                        error.response?.data?.message || 'An error occurred while fetching tasks'
                    );
                }
            }
            setLoading(false);
        };

        fetchTasks();
    }, [navigate]);

    return (
        <div>
            <Navbar />
            <div className="task-list-container">
                <div className="task-header">
                    <h1>My Tasks</h1>
                    <Link to={`/createTasks`} className="create-task-link">
                        <FontAwesomeIcon icon={faPlusSquare} className="create-task-icon" />
                        Create Task
                    </Link>
                </div>
                {loading && <p>Loading tasks...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && tasks.length > 0 ? (
                    <div className="task-grid">
                        <div className="grid-header">
                            <span>Title</span>
                            <span>Status</span>
                            <span>Actions</span>
                        </div>
                        {tasks.map((task) => (
                            <div key={task._id} className="task-row">
                                <div className="task-title">{task.title}</div>
                                <div className={`task-status ${task.completed ? "completed" : "not-completed"}`}>
                                    {task.completed ? "Completed" : "Not Completed"}
                                </div>
                                <div className="task-actions">
                                    <Link to={`/editTasks/${task._id}`}>
                                        <FontAwesomeIcon icon={faEdit} className="action-icon-edit" />
                                    </Link>
                                    <Link to={`/taskDetails/${task._id}`}>
                                        <FontAwesomeIcon icon={faInfoCircle} className="action-icon-info" />
                                    </Link>
                                    <Link to={`/deleteTask/${task._id}`}>
                                        <FontAwesomeIcon icon={faTrashAlt} className="action-icon-delete" />
                                    </Link>


                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    !loading &&
                    !error && <p>No tasks found. Start creating your tasks!</p>
                )}
            </div>
            <Chatbot />
            <Footer />
        </div>
    );
};

export default TaskList;
