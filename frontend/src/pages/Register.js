import React, { useState } from 'react';
import '../css/register.css';
import '../css/general.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
//fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';


const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = (event) => {
        event.preventDefault(); // Prevent form submission

        const user = { name, email, password, confirmPassword };

        setLoading(true);
        axios
            .post('http://localhost:5555/users/register', user)
            .then((res) => {
                setLoading(false);
                alert('Registration Successful');
                navigate('/login');
            })
            .catch((err) => {
                setLoading(false);
                if (err.response && err.response.data && err.response.data.message) {
                    setErrorMessage(err.response.data.message);
                } else {
                    setErrorMessage('SRegistration Failed. Please try again later.');
                    console.error(err);
                }

            });
    };

    return (
        <div className="main-div">
            <div className="register-div">
                <h1 className='title'>Register</h1>
                {errorMessage && (
                    <p className="error-message">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="alert-icon" />
                        {errorMessage}
                    </p>
                )}

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="name" className='label'>Name</label><br />
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='input'
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className='label'>Email</label><br />
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='input'
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className='label'>Password</label><br />
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='input'
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className='label'>Confirm Password</label><br />
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className='input'
                        />
                    </div>

                    <p>Already have an account? <Link to="/login">Login Here</Link></p>
                    <button type="submit" disabled={loading} className='reg-button'>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
