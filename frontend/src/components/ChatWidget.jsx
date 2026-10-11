import { useState, useRef, useEffect } from 'react'
import { PeachIcon } from './PeachLogo'
import { API_URL } from '../lib/api'


function makeGreeting() {
  return {
    role: 'assistant',
    content: "Hi, I'm Peachy, PeachWeb's assistant. Ask me what we build, how a project works, or how to get started.",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}

const INITIAL_SUGGESTIONS = ["What do you build?", "How does it work?", "How do I get started?"]

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{ backgroundColor: '#F8DDC9' }}
      >
        <PeachIcon size={24} uid="typing" />
      </div>
      <div className="px-4 py-3 rounded-tr-2xl rounded-tl-sm rounded-br-2xl" style={{ backgroundColor: '#F3E6D8' }}>
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: '#685B51',
                animation: 'bounce 1.2s infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([makeGreeting()])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showInitialSuggestions, setShowInitialSuggestions] = useState(true)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [showNewChatPrompt, setShowNewChatPrompt] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, showFollowUp, showNewChatPrompt])

  const startNewChat = () => {
    setMessages([makeGreeting()])
    setInput('')
    setShowInitialSuggestions(true)
    setShowFollowUp(false)
    setShowNewChatPrompt(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const sendMessage = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return

    setInput('')
    setShowInitialSuggestions(false)
    setShowFollowUp(false)
    setShowNewChatPrompt(false)

    const userMessage = {
      role: 'user',
      content: userMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages
            .filter(m => m.role === 'user' || m.role === 'assistant')
            .map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Chat error')

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
      setShowFollowUp(true)
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I couldn't connect just now. You can reach the team at peachwebdevelopment@gmail.com.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleTellMeMore = () => {
    setShowFollowUp(false)
    sendMessage("Tell me more")
  }

  const handleThatsAll = () => {
    setShowFollowUp(false)
    setShowNewChatPrompt(true)
    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: "Thanks for stopping by. When you're ready, use \"Request a website\" at the top of the page, or email peachwebdevelopment@gmail.com.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .follow-up-enter { animation: fadeSlideUp 0.25s ease forwards; }
      `}</style>

      {/* Chat Window */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Peachy, PeachWeb's assistant"
          className="fixed bottom-24 right-2.5 md:right-5 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-line"
          style={{ width: 'min(380px, calc(100vw - 20px))', height: 'min(520px, calc(100dvh - 120px))', backgroundColor: 'white' }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ backgroundColor: '#241D19' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
              style={{ backgroundColor: '#F8DDC9' }}
            >
              <PeachIcon size={28} uid="header" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white leading-tight">Peachy</p>
                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" aria-hidden="true"></span>
              </div>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>PeachWeb assistant</p>
            </div>

            {/* New Chat button */}
            <button
              onClick={startNewChat}
              title="Start new chat"
              className="p-1.5 rounded-full transition-colors"
              style={{ color: '#9CA3AF' }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}
              aria-label="Start new chat"
            >
              {/* pencil-square icon */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>

            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-full transition-colors"
              style={{ color: '#9CA3AF' }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}
              aria-label="Close chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 chat-messages" aria-live="polite" style={{ backgroundColor: '#FBF7F1' }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex mb-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start items-end gap-2'}`}
              >
                {msg.role === 'assistant' && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{ backgroundColor: '#F8DDC9' }}
                  >
                    <PeachIcon size={24} uid={`msg-${i}`} />
                  </div>
                )}
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div
                    className={`px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-tl-2xl rounded-tr-sm rounded-bl-2xl text-white'
                        : 'rounded-tr-2xl rounded-tl-sm rounded-br-2xl'
                    }`}
                    style={
                      msg.role === 'user'
                        ? { backgroundColor: '#A3431D' }
                        : { backgroundColor: '#F3E6D8', color: msg.isError ? '#B91C1C' : '#241D19' }
                    }
                  >
                    {msg.content}
                  </div>
                  <p className="text-xs mt-1 px-1" style={{ color: '#685B51' }}>{msg.time}</p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && <TypingIndicator />}

            {/* Initial suggestion chips */}
            {showInitialSuggestions && messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 mt-2">
                {INITIAL_SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="px-3 py-1.5 text-xs font-medium rounded-full border transition-all hover:shadow-sm"
                    style={{ borderColor: '#E5D7C7', color: '#A3431D', backgroundColor: '#ffffff' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Follow-up chips after each bot response */}
            {showFollowUp && !loading && (
              <div className="follow-up-enter flex gap-2 mt-1 mb-2 ml-10">
                <button
                  onClick={handleTellMeMore}
                  className="px-3 py-1.5 text-xs font-medium rounded-full border transition-all hover:shadow-sm"
                  style={{ borderColor: '#E5D7C7', color: '#A3431D', backgroundColor: '#ffffff' }}
                >
                  Tell me more
                </button>
                <button
                  onClick={handleThatsAll}
                  className="px-3 py-1.5 text-xs font-medium rounded-full border transition-all hover:shadow-sm"
                  style={{ borderColor: '#E5D7C7', color: '#685B51', backgroundColor: '#FBF7F1' }}
                >
                  That's all, thanks
                </button>
              </div>
            )}

            {/* New Chat prompt after "That's all" */}
            {showNewChatPrompt && !loading && (
              <div className="follow-up-enter flex justify-center mt-3 mb-1">
                <button
                  onClick={startNewChat}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
                  style={{ backgroundColor: '#A3431D' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Start a new chat
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            className="flex items-center gap-2 px-3 py-3 border-t flex-shrink-0"
            style={{ borderColor: '#E5D7C7', backgroundColor: 'white' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question"
              aria-label="Message Peachy"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none border transition-colors disabled:opacity-60"
              style={{ borderColor: '#E5D7C7', backgroundColor: '#FBF7F1' }}
              onFocus={e => e.target.style.borderColor = '#A3431D'}
              onBlur={e => e.target.style.borderColor = '#E5D7C7'}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              style={{ backgroundColor: '#A3431D' }}
              aria-label="Send"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-5 right-2.5 md:right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95"
        style={{
          backgroundColor: open ? '#A3431D' : '#ffffff',
          border: open ? 'none' : '1px solid #E5D7C7',
          color: 'white',
        }}
        aria-label={open ? 'Close chat' : 'Chat with Peachy'}
        aria-expanded={open}
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <PeachIcon size={36} uid="fab" />
        )}
      </button>
    </>
  )
}
