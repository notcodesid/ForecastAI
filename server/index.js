const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', async (data) => {
        try {
            const message = JSON.parse(data);
            
            // Call OpenAI API
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: message.content }
                ],
                temperature: 0.7,
                max_tokens: 1000
            });

            // Send response back to client
            ws.send(JSON.stringify({
                role: 'assistant',
                content: response.choices[0].message.content
            }));
        } catch (error) {
            console.error('Error:', error);
            ws.send(JSON.stringify({
                role: 'assistant',
                content: 'Sorry, there was an error processing your request.'
            }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Basic health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 