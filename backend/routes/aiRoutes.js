import express from 'express';
import axios from 'axios';
import { Task } from '../models/tasksModel.js'; // Import your Task model
import { authenticate } from '../middleware/authenticate.js'; // Ensure you have the authenticate middleware

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

        // If the AI indicates a task is added, extract and save it to the database
        if (assistantReply.toLowerCase().includes('task added')) {
            const taskDetails = extractTaskDetails(userInput); // Helper function to extract task details
            if (taskDetails) {
                const newTask = new Task({
                    title: taskDetails.title,
                    description: taskDetails.description,
                    userId: req.user.id, // Use authenticated user's ID
                    dueDate: taskDetails.dueDate, // Optional if parsed
                    completed: false,
                });

                await newTask.save();
                console.log('Task successfully saved:', newTask);
            }
        }

        res.status(200).send({ reply: assistantReply });
    } catch (error) {
        console.error('Error in AI chatbot:', error);
        res.status(500).send({ message: 'AI assistant is unavailable. Try again later.' });
    }
});

// Helper function to extract task details from userInput.
function extractTaskDetails(input) {
    const taskRegex = /add a task to (.+?) (?:by|at|on|before) (.+)/i;
    const match = input.match(taskRegex);
    if (match) {
        return {
            title: match[1].trim(),
            description: match[1].trim(), // Can differentiate title and description as needed
            dueDate: new Date(match[2]), // Parse date if possible
        };
    }
    return null; // Return null if input doesn't match expected format
}

export default router;
