import React, { useState, useRef, useEffect } from 'react';
import { Language, ChatMessage, DiseaseDetectionResult } from '../types';
import { TEXTS } from '../constants';
import { getChatbotResponse } from '../services/geminiService';
import { SparklesIcon, UserCircleIcon } from './icons';

interface ChatbotProps {
  language: Language;
  initialContext: DiseaseDetectionResult | null;
}

const Chatbot: React.FC<ChatbotProps> = ({ language, initialContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const T = TEXTS[language];
  
  useEffect(() => {
    if (initialContext) {
        setMessages([
            {
                id: Date.now(),
                sender: 'bot',
                text: `I have identified the disease as ${initialContext.diseaseName}. How can I help you with the treatment?`
            }
        ]);
    }
  }, [initialContext]);


  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, { id: Date.now() + 1, text: '', sender: 'bot', isTyping: true }]);

    try {
        const history = messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

      const botResponseText = await getChatbotResponse(input, history, language);
      const botMessage: ChatMessage = { id: Date.now() + 2, text: botResponseText, sender: 'bot' };

      setMessages(prev => prev.filter(m => !m.isTyping));
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: ChatMessage = { id: Date.now() + 2, text: "Sorry, I couldn't get a response. Please try again.", sender: 'bot' };
      setMessages(prev => prev.filter(m => !m.isTyping));
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
        <SparklesIcon className="h-6 w-6 text-green-500"/>
        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">{T.chatWithBot}</h3>
      </div>
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-800/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0"><SparklesIcon className="w-5 h-5"/></div>}
            <div className={`p-3 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none'}`}>
                {msg.isTyping ? (
                    <div className="flex items-center justify-center space-x-1 py-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    </div>
                ) : (
                    <p className="text-sm">{msg.text}</p>
                )}
            </div>
             {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 flex-shrink-0"><UserCircleIcon className="w-6 h-6"/></div>}
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={T.chatPlaceholder}
          className="flex-1 p-2 border-2 border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white focus:border-transparent transition"
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading} className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed font-semibold transition-colors">
          {T.send}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;