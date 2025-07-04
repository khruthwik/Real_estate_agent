import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Home } from 'lucide-react';

export default function SearchBroker() {
  const [msgLog, setMsgLog] = useState([
    { from: 'bot', text: '👋 Hi, I\'m your AI real-estate broker. How can I help you today?' }
  ]);
  const [inbox, setInbox] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [msgLog]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = async () => {
    if (!inbox.trim() || isLoading) return;
    
    const userMsg = inbox;
    setMsgLog(log => [...log, { from: 'user', text: userMsg }]);
    setInbox('');
    setIsLoading(true);

    try {
      const chatRes = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });

      if (!chatRes.ok) {
        const errText = await chatRes.text();
        console.error('❌ Server error:', errText);
        throw new Error('Chat API failed');
      }

      const { reply } = await chatRes.json();
      setMsgLog(log => [...log, { from: 'bot', text: reply }]);
    } catch (err) {
      console.error('❌ Chat error:', err.message);
      setMsgLog(log => [...log, { from: 'bot', text: '❌ Something went wrong. Please try again.' }]);
    } finally {
      setIsLoading(false);
      // Refocus input after sending message
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-950 font-['Outfit',_sans-serif] relative overflow-hidden flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 py-4 border-b border-gray-800 bg-black/40 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-thin text-gray-100">AI Property Broker</h1>
            <p className="text-xs text-gray-400">Your intelligent real estate assistant</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="relative z-10 flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 overflow-hidden">
        {/* Chat Log */}
        <div className="flex-1 overflow-y-auto space-y-4 px-2 py-4 custom-scrollbar min-h-0">
          {msgLog.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'bot' ? 'justify-start' : 'justify-end'} animate-fadeIn`}>
              <div className={`flex items-start space-x-2 max-w-2xl ${m.from === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  m.from === 'bot' ? 'bg-indigo-600' : 'bg-gray-700'
                }`}>
                  {m.from === 'bot' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                </div>
                
                {/* Message */}
                <div className={`px-4 py-3 rounded-2xl text-sm shadow-lg transition-all hover:shadow-xl ${
                  m.from === 'bot'
                    ? 'bg-gray-800/80 text-gray-200 border border-gray-700/50 backdrop-blur-sm'
                    : 'bg-indigo-600/90 text-white border border-indigo-500/50 backdrop-blur-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="flex items-start space-x-2 max-w-2xl">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="px-4 py-3 bg-gray-800/80 text-gray-200 border border-gray-700/50 backdrop-blur-sm rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Scroll anchor */}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="flex-shrink-0 py-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-gray-800 mt-4">
          <div className="flex space-x-3 px-4">
            <input
              ref={inputRef}
              type="text"
              value={inbox}
              onChange={e => setInbox(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about properties, neighborhoods, market trends..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 text-gray-100 border border-gray-700/50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-thin backdrop-blur-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={send}
              disabled={!inbox.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all font-thin shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        @media (max-width: 640px) {
          .max-w-2xl {
            max-width: 85%;
          }
        }
      `}</style>
    </div>
  );
}