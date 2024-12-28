import express from 'express';
import {PORT, mongoDBURL} from './config.js';
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import dotenv from 'dotenv'; // Import dotenv

dotenv.config(); // Load environment variables

// Middleware
const app = express();

// CORS configuration to allow Authorization header
const corsOptions = {
  origin: 'http://localhost:3000', // Your frontend URL
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow Authorization header
};

app.use(cors(corsOptions));

app.use(express.json());


app.get('/', (request, response) => {
    console.log(request)
    return response.status(234).send('Welcome to the home page')
});

// Routes
//user routes
app.use('/users', userRoutes);
//task routes
app.use('/tasks', taskRoutes);
//ai routes
app.use('/api/ai', aiRoutes);

//connect to database
mongoose.connect(mongoDBURL)
  .then(() => {
    console.log('Connected to the database');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
  })
  .catch((err) => {
    console.log('Failed to connect to the database', err);
  });