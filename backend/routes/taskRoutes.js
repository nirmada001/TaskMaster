import express from 'express';
import {Task} from '../models/tasksModel.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Route to save a new task
router.post('/', authenticate, async (request, response) => {
    try {
        const { title, description } = request.body;

        // Check if all required fields are provided
        if (!title) {
            return response.status(400).send({ message: 'Send all the required fields: title' });
        }

        // Create the task
        const newTask = new Task({
            userId: request.user.id,
            title,
            description
        });

        await newTask.save();

        return response.status(201).send({ message: 'Task created successfully' });
    } catch (error) {
        console.error('Error in creating task:', error);
        response.status(500).send({ message: 'Error in creating task' });
    }
});


//route to get all tasks of the particular user
router.get('/', authenticate, async (request, response) => {
    try {
        const tasks = await Task.find({ userId: request.user.id });
        response.status(200).send(tasks);
    } catch (error) {
        console.error('Error in getting tasks:', error);
        response.status(500).send({ message: 'Error in getting tasks' });
    }
});

//route to get a particular task of the user
router.get('/:id', authenticate, async (request, response) => {
    try {
        const task = await Task.findOne({ _id: request.params.id, userId: request.user.id });

        if (!task) {
            return response.status(404).send({ message: 'Task not found' });
        }

        response.status(200).send(task);
    } catch (error) {
        console.error('Error in getting task:', error);
        response.status(500).send({ message: 'Error in getting task' });
    }
});

router.put('/:id', authenticate, async (request, response) => {
    try {
        const task = await Task.findOne({ _id: request.params.id, userId: request.user.id });

        if (!task) {
            return response.status(404).send({ message: 'Task not found' });
        }

        const { title, description, completed } = request.body;

        // Update fields only if they are explicitly provided
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (completed !== undefined) task.completed = completed;

        await task.save();

        response.status(200).send({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Error in updating task:', error);
        response.status(500).send({ message: 'Error in updating task' });
    }
});

router.delete('/:id', authenticate, async (request, response) => {
    try {
        const task = await Task.findOne({ _id: request.params.id, userId: request.user.id });

        if (!task) {
            return response.status(404).send({ message: 'Task not found' });
        }

        await task.deleteOne();

        response.status(200).send({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error in deleting task:', error);

        // Check for specific error types
        if (error.name === 'CastError') {
            return response.status(400).send({ message: 'Invalid task ID' });
        }

        response.status(500).send({ message: 'Internal Server Error' });
    }
});


export default router;