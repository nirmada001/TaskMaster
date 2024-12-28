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

        // If the AI indicates a task is added, extract task details
        if (assistantReply.toLowerCase().includes('added')) {
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

// Helper function to extract task details from userInput
function extractTaskDetails(input) {
    const taskRegex = /add a task to (.+?) (?:by|at|on|before) (.+)/i;
    const match = input.match(taskRegex);
    if (match) {
        return {
            title: match[1].trim(),
            description: match[1].trim(), // Adjust if you differentiate title and description
            dueDate: isNaN(Date.parse(match[2])) ? null : new Date(match[2]), // Parse due date
        };
    }
    return null; // Return null if no match found
}

export default router;
