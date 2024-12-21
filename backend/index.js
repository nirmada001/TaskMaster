import express from 'express';
import {PORT, mongoDBURL} from './config.js';
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';


import dotenv from 'dotenv'; // Import dotenv
dotenv.config(); // Load environment variables

// Middleware
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (request, response) => {
    console.log(request)
    return response.status(234).send('Welcome to the home page')
});

// Routes
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

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