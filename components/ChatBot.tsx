import React, { useState, useEffect, useRef } from 'react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { Send, User, ChefHat, Loader2, MessageSquare } from 'lucide-react';
import { Chat } from '@google/genai';

interface ChatBotProps {
  language: Language;
}

const ChatBot: React.FC<ChatBotProps> = ({ language }) => {
  const t = TRANSLATIONS[language].chat;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: t.welcome,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset chat when language changes
  useEffect(() => {
    chatSessionRef.current = createChatSession(language);
    setMessages([{
      id: 'welcome-' + language,
      role: 'model',
      text: t.welcome,
      timestamp: Date.now()
    }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: result.text || "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Connection error. Please try again.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-[600px] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200">
      {/* Header */}
      <div className="bg-amazigh-green p-4 text-white flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-full">
          <ChefHat className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg">{t.chefName}</h3>
          <p className="text-xs opacity-90 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span> {t.online}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-stone-700 text-white' : 'bg-amazigh-yellow text-stone-900'}`}>
              {msg.role === 'user' ? <User size={16} /> : <MessageSquare size={16} />}
            </div>
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-stone-800 text-white rounded-tr-none' 
                  : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none'}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amazigh-yellow text-stone-900 flex items-center justify-center">
              <MessageSquare size={16} />
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-stone-200 flex items-center gap-2">
              <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-stone-200">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            className="w-full pl-4 pr-12 py-3 bg-stone-100 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-amazigh-green focus:border-transparent outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`absolute ${language === 'ar' ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 p-2 text-amazigh-green hover:text-green-700 disabled:opacity-30 transition-colors`}
          >
            {isTyping ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot;