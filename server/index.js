// There are some modeuls which helps:

//  Express - create a http server
//  WebSocket - create a websocket server ( easily communicate with the browser {client }))
//  cors - allows to connect with different origins ( urls)
//  OpenAI - connect with the OpenAI API

import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();


const app = express(); // create a new express application
app.use(cors()); // allow cross-origin requests
app.use(express.json()); // get the data and convert data into json

// Resource to learn about web socket { https://projects.100xdevs.com/tracks/ABEC/ABEC-3}

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server. 
const wss = new WebSocket.Server({ server });

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// WebSocket connection handler
wss.on('connection', (ws) => {

    //  if client connected
    console.log('New client connected');

    //  if client send a message
    ws.on('message', async (data) => {
        try {
            const message = JSON.parse(data); // convert data into json
            
            // Call OpenAI API
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",  // model to use
                messages: [
                    { role: "system", content: "You are a helpful assistant." }, 
                    // system message this define the behavior of the assistant
                    { role: "user", content: message.content } // user message
                ],
                temperature: 0.7, // not sure about these two parameters
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

    //  if connectioned got closed
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the backend server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 