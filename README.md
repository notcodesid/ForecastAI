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

4. Set up Google Sheets credentials:
- Create a `config` directory in the server folder
- Copy `google-credentials.example.json` to `google-credentials.json`
- Replace the placeholder values with your actual Google Service Account credentials
- Make sure NOT to commit `google-credentials.json` to version control
- Share your Google Sheets with the service account email address for access

5. Run the server:
```bash
# For development with auto-reload:
npm run dev

# For production:
npm start
```

## Usage
1. Open your browser and navigate to `http://localhost:5173`
2. Enter your Google Sheet ID (found in the sheet's URL between /d/ and /edit)
3. Start asking questions about your spreadsheet data
4. Get AI-powered insights and analysis

## Features
- Real-time chat interface
- WebSocket communication
- Integration with GPT-3.5
- Google Sheets data analysis
- Responsive design
- Loading states and error handling

## Security Notes
- Never commit sensitive credentials to version control
- Keep your `.env` and `google-credentials.json` files secure
- Use environment variables for sensitive information
- Regularly rotate API keys and credentials 