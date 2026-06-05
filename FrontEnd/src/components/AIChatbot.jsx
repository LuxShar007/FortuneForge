import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config';


export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Greetings, Adventurer! I am your AI Coach. How can I help you forge your Budget Shield, optimize your Cash Flow Mana, or plan your wealth journey today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to state
    const userMsgId = `user_${Date.now()}`;
    setMessages((prev) => [...prev, { id: userMsgId, sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to communicate with AI Coach');
      }

      // Add bot response to state
      const botMsgId = `bot_${Date.now()}`;
      setMessages((prev) => [...prev, { id: botMsgId, sender: 'bot', text: data.advice }]);
    } catch (error) {
      console.error(error);
      const errorMsgId = `err_${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { 
          id: errorMsgId, 
          sender: 'bot', 
          text: `Apologies, Adventurer! My connection was interrupted: ${error.message}. Please verify the backend is running and try again.` 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full gold-bg-gradient hover:opacity-95 text-white flex items-center justify-center shadow-lg hover:shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-amber-400/50"
        >
          <MessageSquare className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div 
          className="w-80 md:w-96 h-[480px] rounded-2xl border border-amber-500/30 bg-slate-900/90 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-5"
          style={{ boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 15px 0 rgba(212, 175, 55, 0.1)' }}
        >
          {/* Header */}
          <div className="p-4 border-b border-amber-500/20 bg-slate-900/95 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-slate-900" />
              </div>
              <div className="text-left">
                <h4 className="font-display font-black text-sm uppercase tracking-wider gold-text-gradient leading-none">
                  AI Coach
                </h4>
                <span className="text-[10px] font-bold text-green-500/80 uppercase">Online Advisor</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-normal ${
                    msg.sender === 'user'
                      ? 'bg-amber-600 text-white rounded-tr-none'
                      : 'bg-slate-800/80 text-slate-100 border border-slate-700/50 rounded-tl-none text-left'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1 font-semibold">
                  {msg.sender === 'user' ? 'You' : 'AI Coach'}
                </span>
              </div>
            ))}
            
            {loading && (
              <div className="flex flex-col items-start">
                <div className="bg-slate-800/50 border border-slate-700/30 text-slate-400 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 animate-bounce"></span>
                  </div>
                  <span className="italic font-medium">AI Coach is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form 
            onSubmit={handleSend}
            className="p-3 border-t border-amber-500/20 bg-slate-900/95 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for budgeting advice..."
              disabled={loading}
              className="flex-1 bg-slate-800/50 border border-slate-700 hover:border-amber-500/40 focus:border-amber-500/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-3.5 rounded-xl gold-bg-gradient hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all duration-300 cursor-pointer border border-amber-400/40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
