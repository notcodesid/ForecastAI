# ForcastAI Chat Application

A real-time chat application that uses GPT-3.5 to generate responses, built with React and Express.js.

## Setup

### Frontend (Client)
1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

### Backend (Server)
1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
- Create a `.env` file in the server directory
- Add your OpenAI API key to the `.env` file:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the server:
```bash
# For development with auto-reload:
npm run dev

# For production:
npm start
```

## Usage
1. Open your browser and navigate to `http://localhost:5173`
2. Start chatting with the AI assistant
3. The chat interface will display your messages and the AI's responses in real-time

## Features
- Real-time chat interface
- WebSocket communication
- Integration with GPT-3.5
- Responsive design
- Loading states and error handling 