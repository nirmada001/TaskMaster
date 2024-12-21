import express from 'express';
import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const router = express.Router();
const secretKey = process.env.JWT_SECRET;

// Route to save a new user
router.post('/register', async (request, response) => {
    try {
        const { name, email, password, confirmPassword } = request.body;

        // Check if all required fields are provided
        if (!name || !email || !password || !confirmPassword) {
            return response.status(400).send({
                message: 'Send all the required fields: name, email, password, confirmPassword'
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            // alert('User already exists');
            return response.status(400).send({ message: 'User already exists' });
        }

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            return response.status(400).send({ message: 'Passwords do not match' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        return response.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error in creating user:', error);
        response.status(500).send({ message: 'Error in creating user' });
    }
});



// Route to login a user using email and password
router.post('/login', async (request, response) => {
    try {
        const { email, password } = request.body;

        // Validate required fields
        if (!email || !password) {
            return response.status(400).send({
                message: 'Send all the required fields: email, password'
            });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return response.status(400).send({ message: 'Invalid credentials' });
        }

        // Compare the entered password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return response.status(400).send({ message: 'Invalid Password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email },
            secretKey,
            { expiresIn: '1h' }
        );

        return response.status(200).send({
            message: 'Login successful',
            token
        });
    } catch (error) {
        console.error('Error in login:', error);
        response.status(500).send({ errormessage });
    }
});


//Route to get all users
router.get('/', async (request, response) =>{
    try{
        const users = await User.find({});
        return response.status(200).send({
            count: users.length,
            data: users,
        });
    } 
    catch(error){
        console.error(error);
        response.status(500).send({message: 'Error in getting users'});	
    }
})


//Route to get a user by id
router.get('/:id', async (request, response) =>{
    try{

        const {id} = request.params;
        const user = await User.findById(id);
        return response.status(200).send(user);
    } 
    catch(error){
        console.error(error);
        response.status(500).send({message: error.message});	
    }
})

export default router;
