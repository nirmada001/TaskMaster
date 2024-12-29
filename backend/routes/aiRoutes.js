import express from 'express';
import axios from 'axios';
import { authenticate } from '../middleware/authenticate.js';
import { Task } from '../models/tasksModel.js'; // Import the Task model

const router = express.Router();

router.post('/chat', authenticate, async (req, res) => {
    const { userInput } = req.body;

    try {
        // Communicate with OpenAI API
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: 'You are a task management assistant.' },
                    { role: 'user', content: userInput },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const assistantReply = response.data.choices[0].message.content;

        if (assistantReply.toLowerCase().includes('delete')) {
            const taskTitle = extractDeleteTaskDetails(userInput); // Extract task title for deletion

            if (taskTitle) {
                try {
                    // Delete the task from the database
                    const deletedTask = await Task.findOneAndDelete({
                        userId: req.user.id,
                        title: taskTitle,
                    });

                    if (deletedTask) {
                        console.log('Task successfully deleted:', deletedTask);
                        return res.status(200).send({ reply: `Task '${taskTitle}' deleted successfully.` });
                    } else {
                        console.log('Task not found:', taskTitle);
                        return res.status(404).send({ reply: `Task '${taskTitle}' not found.` });
                    }
                } catch (taskError) {
                    console.error('Error deleting task:', taskError);
                    return res.status(500).send({ reply: 'Task deletion failed.' });
                }
            } else {
                console.log('Could not extract task title for deletion:', userInput);
                return res.status(400).send({ reply: 'Could not understand which task to delete.' });
            }
        } else if (assistantReply.toLowerCase().includes('added')) {
            const taskDetails = extractTaskDetails(userInput); // Helper function to extract details
            if (taskDetails) {
                try {
                    // Save the task directly using the Task model
                    const newTask = new Task({
                        userId: req.user.id, // Authenticated user's ID
                        title: taskDetails.title,
                        description: taskDetails.description,
                        completed: false,
                    });

                    await newTask.save();
                    console.log('Task successfully saved:', newTask);
                } catch (taskError) {
                    console.error('Error saving task:', taskError);
                    return res.status(500).send({ message: 'Task creation failed' });
                }
            } else {
                console.log('Could not extract task details from input:', userInput);
            }
        }

        res.status(200).send({ reply: assistantReply });
    } catch (error) {
        console.error('Error in AI chatbot:', error);
        res.status(500).send({ message: 'AI assistant is unavailable. Try again later.' });
    }
});

// Helper function to extract task details for deletion
function extractDeleteTaskDetails(input) {
    const deleteRegex = /delete (?:the )?task (?:titled )?"?(.+?)"?$/i;
    const match = input.match(deleteRegex);

    if (match) {
        return match[1].trim(); // Extract and return the task title
    }

    return null; // Return null if no match is found
}

// Existing helper function to extract task details for adding tasks
function extractTaskDetails(input) {
    const taskRegex = /add a task to (.+?) (?:by|at|on|before) (.+)/i;
    const match = input.match(taskRegex);

    if (match) {
        const title = match[1].trim();
        const dueInfo = match[2].trim();

        return {
            title: title.charAt(0).toUpperCase() + title.slice(1), // Capitalize the first letter
            description: `${title} before ${dueInfo}`, // Construct the description
        };
    }

    return null; // Return null if no match is found
}

export default router;
