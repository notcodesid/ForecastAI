import { useState, useEffect, useRef } from 'react' // Importing React hooks for managing state and effects.

function App() { // Defining the main React component
  
  // State to store the chat messages
  const [messages, setMessages] = useState([]) 
  
  // State to store the user's input message
  const [inputMessage, setInputMessage] = useState('') 
  
  // State to store the spreadsheet ID
  const [spreadsheetId, setSpreadsheetId] = useState('') 
  
  // State to indicate whether the AI is processing the message
  const [isLoading, setIsLoading] = useState(false) 
  
  // Reference to keep track of the last message for scrolling purposes
  const messagesEndRef = useRef(null) 
  
  // Reference to manage the WebSocket connection
  const ws = useRef(null) 

  // This useEffect runs once when the component is mounted
  useEffect(() => {
    
    // Establishing WebSocket connection to the server
    ws.current = new WebSocket('ws://localhost:8000/ws') 
    
    // When WebSocket is successfully connected
    ws.current.onopen = () => {
      console.log('Connected to WebSocket')
    }

    // When a message is received from the server
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data) // Converting the received data into a JavaScript object
      setMessages(prev => [...prev, { role: 'assistant', content: message.content }]) // Adding AI response to chat
      setIsLoading(false) // Stopping the loading state
    }

    // Handling WebSocket errors
    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error)
      setIsLoading(false) // Stopping the loading state
    }

    // Cleanup function: This runs when the component is removed, closing the WebSocket connection
    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [])

  // Function to scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Whenever the messages array updates, scroll to the latest message
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Function to handle message submission
  const handleSubmit = (e) => {
    e.preventDefault() // Prevents the default form submission behavior
    if (!inputMessage.trim()) return // If input is empty, do nothing

    // Creating a new message object for the user
    const newMessage = {
      role: 'user',
      content: inputMessage.trim(),
      spreadsheetId: spreadsheetId.trim() // Include spreadsheet ID if provided
    }

    setMessages(prev => [...prev, { role: 'user', content: inputMessage.trim() }]) // Adding the user message to chat
    setInputMessage('') // Clearing the input field
    setIsLoading(true) // Setting loading state to true

    ws.current.send(JSON.stringify(newMessage)) // Sending the message to the WebSocket server
  }

  return (
    <div className="flex flex-col h-screen bg-[#1e1f22]"> {/* Main container with dark background */}
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto"> 
        <div className="w-full max-w-4xl mx-auto px-4">
          {messages.length === 0 ? ( // If no messages, show welcome text
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-6">
                <h1 className="text-4xl font-bold text-white/90">SheetGPT</h1>
                <p className="text-lg text-white/50">AI-Powered Spreadsheet Analysis</p>
                <div className="max-w-md mx-auto p-6 bg-[#2A2B32] rounded-lg">
                  <h2 className="text-white mb-4">Getting Started</h2>
                  <ol className="text-white/70 text-left space-y-2">
                    <li>1. Enter your Google Sheet ID below</li>
                    <li>2. Ask questions about your spreadsheet data</li>
                    <li>3. Get AI-powered insights and analysis</li>
                  </ol>
                </div>
              </div>
            </div>
          ) : ( // Otherwise, display chat messages
            <div className="py-10 space-y-5">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* AI messages have an identifier */}
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded bg-[#1FBF7C] flex items-center justify-center flex-shrink-0 text-white text-sm font-medium">
                      AI
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[85%] ${
                      message.role === 'user'
                        ? 'bg-[#34373d] text-white'
                        : 'bg-[#2A2B32] text-white/90'
                    }`}
                  >
                    <div className="prose prose-invert">
                      {message.content.split('\n').map((line, i) => (
                        <p key={i} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </div>
                  {/* User messages have an identifier */}
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded bg-[#838383] flex items-center justify-center flex-shrink-0 text-white text-sm font-medium">
                      U
                    </div>
                  )}
                </div>
              ))}
              
              {/* Show loading state when AI is thinking */}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded bg-[#1FBF7C] flex items-center justify-center flex-shrink-0 text-white text-sm font-medium">
                    AI
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-[#2A2B32] text-white/90">
                    <div className="animate-pulse">Analyzing spreadsheet data...</div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} /> {/* Invisible div for scrolling to the bottom */}
            </div>
          )}
        </div>
      </div>

      {/* Input Container */}
      <div className="border-t border-white/10 bg-[#1E1F2E] p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              placeholder="Enter Google Sheet ID..."
              className="flex-1 bg-[#2A2B32] text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C64E4]/50"
            />
            <div className="text-white/50 text-sm">
              Sheet ID
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about your spreadsheet data..."
                className="w-full bg-[#2A2B32] text-white rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#2C64E4]/50"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
          <p className="text-xs text-center text-white/50">
            Enter your questions about the spreadsheet data for AI-powered analysis and insights.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App // Exporting the component so it can be used elsewhere
