import { useState, useEffect, useRef } from 'react'

function App() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const ws = useRef(null)

  useEffect(() => {
    // Initialize WebSocket connection
    ws.current = new WebSocket('ws://localhost:8000/ws')

    ws.current.onopen = () => {
      console.log('Connected to WebSocket')
    }

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data)
      setMessages(prev => [...prev, { role: 'assistant', content: message.content }])
      setIsLoading(false)
    }

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error)
      setIsLoading(false)
    }

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const newMessage = {
      role: 'user',
      content: inputMessage.trim()
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage('')
    setIsLoading(true)

    ws.current.send(JSON.stringify(newMessage))
  }

  return (
    <div className="flex flex-col h-screen bg-[#1e1f22]">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto px-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-3">
                <h1 className="text-4xl font-bold text-white/90">ForcastAI Chat</h1>
                <p className="text-lg text-white/50">How can I help you today?</p>
              </div>
            </div>
          ) : (
            <div className="py-10 space-y-5">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded bg-[#1FBF7C] flex items-center justify-center flex-shrink-0 text-white text-sm font-medium">
                      AI
                    </div>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[85%] ${
                      message.role === 'user'
                        ? 'bg-[#34373d] text-white'
                        : 'bg-[#2A2B32] text-white/90'
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded bg-[#838383] flex items-center justify-center flex-shrink-0 text-white text-sm font-medium">
                      U
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded bg-[#1FBF7C] flex items-center justify-center flex-shrink-0 text-white text-sm font-medium">
                    AI
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-[#2A2B32] text-white/90">
                    <div className="animate-pulse">Thinking...</div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Container */}
      <div className="border-t border-white/10 bg-[#1E1F2E] p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Send a message..."
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
          <p className="text-xs text-center text-white/50 mt-2">
            ForcastAI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
