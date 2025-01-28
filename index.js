// const express = require('express');
// const bodyParser = require('body-parser');
// const AWS = require('aws-sdk');

// const cors = require('cors'); // Add this line
// app.use(cors()); // Enable CORS for all routes


// // Initialize Express app
// const app = express();
// app.use(bodyParser.json());

// // Configure AWS SDK
// AWS.config.update({ region: 'eu-central-1' }); // Replace with your region
// const lexruntime = new AWS.LexRuntime();

// // Environment variables for bot configuration
// const BOT_NAME = 'PocketLawyer'; // Replace with your Lex bot name
// const BOT_ALIAS = 'TestBotAlias'; // Replace with your Lex bot alias

// // POST endpoint to handle user messages
// app.post('/chat', (req, res) => {
//     const params = {
//         botName: BOT_NAME,
//         botAlias: BOT_ALIAS,
//         userId: 'user123', // Unique user ID (can be dynamic)
//         inputText: req.body.message,
//     };

//     // Send user message to Lex
//     lexruntime.postText(params, (err, data) => {
//         if (err) {
//             console.error('Error communicating with Lex:', err);
//             res.status(500).json({ error: 'Failed to communicate with Lex' });
//         } else {
//             res.json({ message: data.message });
//         }
//     });
// });

// // Serve static files (frontend)
// app.use(express.static('public'));

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

const { LexRuntimeServiceClient, PostTextCommand } = require("@aws-sdk/client-lex-runtime-service");
const readline = require("readline");

// Create an instance of the Lex client
const client = new LexRuntimeServiceClient({
  region: "us-east-1", // Specify your region
});

// Set up a readline interface to capture user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Your Amazon Lex bot settings
const botAlias = "TestBotAlias";  // Replace with your Bot Alias
const botName = "PocketLawyer";    // Replace with your Bot Name
const userId = "testUser";    // Replace with a unique user ID

// Function to send the message to Lex
async function sendMessageToLex(text) {
  try {
    const params = {
      botAlias: botAlias,
      botName: botName,
      inputText: text,
      userId: userId,
    };

    // Send request to Lex
    const command = new PostTextCommand(params);
    const data = await client.send(command);

    // Log the response
    console.log("Lex Response:", data);
    console.log("Message from Lex:", data.message);

    // Ask for the next input
    rl.question("\nEnter your message to Lex: ", sendMessageToLex);
  } catch (error) {
    console.error("Error sending message to Lex:", error);
    rl.close();
  }
}

// Start the interaction
rl.question("Enter your message to Lex: ", sendMessageToLex);
