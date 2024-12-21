import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error in authentication:', error);

        if (error.name === 'TokenExpiredError') {
            // Token has expired
            return res.status(401).json({ 
                message: 'Session expired. Please log in again.', 
                action: 'redirect_to_login' 
            });
        }

        return res.status(400).json({ message: 'Invalid token' });
    }
};
