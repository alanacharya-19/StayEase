import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react'
import { useThemeStore } from '../../store'
import { chatWithAI, type ChatMessage } from '../../services/ai'

export default function AiChatbot() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hey! I'm your travel assistant. Ask me anything about hotels, destinations, or itineraries!" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg: ChatMessage = { role: 'user', content: input.trim() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)
    const reply = await chatWithAI(updated)
    setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 gradient-primary rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-200"
        aria-label="AI Chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden ${
              isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-200'
            }`}
          >
            <div className="gradient-primary p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Travel Assistant</p>
                <p className="text-white/70 text-xs">AI-powered • StayEase</p>
              </div>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-primary/10' : 'bg-gray-100 dark:bg-dark-border'
                  }`}>
                    {msg.role === 'user' ? <User size={13} className="text-primary" /> : <Bot size={13} className={isDark ? 'text-gray-300' : 'text-gray-600'} />}
                  </div>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'gradient-primary text-white rounded-tr-sm'
                      : isDark ? 'bg-dark-border text-gray-200 rounded-tl-sm' : 'bg-gray-100 text-gray-700 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gray-100 dark:bg-dark-border rounded-full flex items-center justify-center">
                    <Bot size={13} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                  </div>
                  <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-dark-border">
                    <Loader2 size={13} className="animate-spin text-gray-500" />
                    <span className="text-xs text-gray-500">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className={`p-3 border-t ${isDark ? 'border-dark-border' : 'border-gray-200'}`}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about travel..."
                  className={`flex-1 px-3 py-2 rounded-xl text-sm outline-none ${
                    isDark ? 'bg-dark-border text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
                  }`}
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="p-2 gradient-primary text-white rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
