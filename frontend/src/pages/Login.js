import React, { useState } from 'react';
import '../css/login.css';
import '../css/general.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
//fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault(); // Prevent form submission

        const user = { email, password };

        setLoading(true);
        axios
            .post('http://localhost:5555/users/login', user)
            .then((res) => {
                setLoading(false);
                alert('Login Successful');
                localStorage.setItem('token', res.data.token); // Save the token in local storage
                navigate('/');
            })
            .catch((err) => {
                setLoading(false);
                if (err.response && err.response.data && err.response.data.message) {
                    setErrorMessage(err.response.data.message);
                } else {
                    setErrorMessage('Login Failed.');
                    console.error(err);
                }
            });
    };

    return (
        <div className="main-div">
            <div className="login-div">
                <h1 className='title'>Login</h1>
                {errorMessage && (
                    <p className="error-message">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="alert-icon" />
                        {errorMessage}
                    </p>
                )}
                <form onSubmit={handleLogin}>
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
                    <p>Don't have an account? <Link to="/register">Register Here</Link></p>
                    <button type="submit" disabled={loading} className='login-button'>
                        {loading ? 'Loging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
