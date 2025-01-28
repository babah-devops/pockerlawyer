const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Configure AWS SDK
AWS.config.update({ region: 'us-east-1' }); // Replace with your region
const lexruntime = new AWS.LexRuntime();

// Environment variables for bot configuration
const BOT_NAME = 'YourBotName'; // Replace with your Lex bot name
const BOT_ALIAS = 'YourBotAlias'; // Replace with your Lex bot alias

// POST endpoint to handle user messages
app.post('/chat', (req, res) => {
    const params = {
        botName: BOT_NAME,
        botAlias: BOT_ALIAS,
        userId: 'user123', // Unique user ID (can be dynamic)
        inputText: req.body.message,
    };

    // Send user message to Lex
    lexruntime.postText(params, (err, data) => {
        if (err) {
            console.error('Error communicating with Lex:', err);
            res.status(500).json({ error: 'Failed to communicate with Lex' });
        } else {
            res.json({ message: data.message });
        }
    });
});

// Serve static files (frontend)
app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});