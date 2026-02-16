import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';
import axios from '../../utils/axios';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export const ShopAssistant = () => {
  console.log("🟢 ShopAssistant mounted");

  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am your Impulse AI assistant. Looking for something specific or just browsing?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async () => {
    console.log("🔥 handleSend triggered");

    if (!inputValue.trim()) {
      console.log("⛔ Input empty, returning");
      return;
    }

    const userText = inputValue;
    console.log("📤 User message:", userText);

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date()
    };

    console.log("📝 Adding user message to state");
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);
    console.log("🤔 isThinking = true");

    try {
      console.log("🌍 Sending POST request to /ai/chat");

      const { data } = await axios.post('/ai/chat', {
        message: userText,
      });

      console.log("✅ API Response received:", data);

      const aiResponseText = data.text || "Sorry, I couldn't respond.";

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date()
      };

      console.log("🤖 Adding AI message to state");
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error("❌ AI Chat Error:", error);

      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "AI service is currently unavailable. Please try again later.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMsg]);
    }

    console.log("🧠 isThinking = false");
    setIsThinking(false);
  };

  return (
    <>
      {/* Floating Action Button Container */}
      <div className={cn(
        "fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 flex flex-col items-end gap-2 transition-all duration-300",
        isOpen && "translate-y-4 opacity-0 pointer-events-none"
      )}>

        {/* Tooltip */}
        <div className={cn(
          "bg-white dark:bg-gray-800 shadow-xl rounded-xl px-4 py-2 text-sm font-medium text-gray-800 dark:text-white transition-all duration-500 transform origin-bottom-right flex items-center gap-2 border border-gray-100 dark:border-gray-700 mb-2",
          showTooltip ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none absolute"
        )}>
          <span>Need personalized help?</span>
          <button
            onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-3 w-3" />
          </button>
        </div>

        {/* Premium AI Button */}
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Shopping Assistant"
          aria-expanded={isOpen}
          className="group relative flex items-center justify-center p-0.5 rounded-full overflow-hidden shadow-[0_8px_30px_rgba(124,58,237,0.3)] hover:shadow-[0_10px_40px_rgba(124,58,237,0.5)] transition-all duration-300 hover:-translate-y-1 active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 animate-spin-slow opacity-100 blur-[1px]"></div>

          <div className="relative flex items-center gap-2 md:gap-3 
            h-10 md:h-14 
            pl-3 md:pl-4 
            pr-4 md:pr-6 
            rounded-full 
            bg-slate-950/95 backdrop-blur-sm 
            text-white border border-white/10 
            group-hover:bg-slate-900 transition-colors"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-full blur-md opacity-60 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-violet-600 to-indigo-600 
                p-1.5 md:p-2 
                rounded-full border border-white/20 shadow-inner"
              >
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-white fill-white/20" />
              </div>
            </div>

            <div className="flex flex-col items-start leading-none gap-0.5">
              <span className="font-heading font-bold text-xs md:text-sm tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Ask AI
              </span>
              <span className="text-[8px] md:text-[10px] text-gray-400 font-medium tracking-wider uppercase">
                Assistant
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-dark-card shadow-2xl transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) border border-gray-100 dark:border-gray-700 ring-1 ring-black/5",
          "w-[calc(100vw-32px)] h-[80vh] md:w-[400px] md:h-[600px]",
          !isOpen && "translate-y-[20px] opacity-0 scale-95 pointer-events-none",
          isOpen && "translate-y-0 opacity-100 scale-100"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
              <Bot className="h-5 w-5 text-violet-300" />
            </div>
            <div>
              <h3 className="font-bold font-heading text-lg leading-none tracking-wide text-white">Impulse AI</h3>
              <span className="text-[10px] text-gray-300 flex items-center gap-1.5 mt-1 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Online
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-black/20 p-4">
          <div className="space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex w-max max-w-[85%] flex-col rounded-2xl px-5 py-3.5 text-sm shadow-sm",
                  msg.sender === 'user'
                    ? "ml-auto bg-gradient-to-br from-slate-900 to-slate-800 text-white"
                    : "mr-auto bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border"
                )}
              >
                <div>{msg.text}</div>
                <span className="mt-1.5 text-[9px] opacity-60 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isThinking && (
              <div className="mr-auto rounded-2xl bg-white dark:bg-gray-800 px-5 py-4 shadow-sm border w-16 h-12" />
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card p-4">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me about products..."
              className="flex-1 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 pl-5 pr-12 py-3.5 text-sm focus:border-violet-500 focus:outline-none"
              disabled={isThinking}
            />
            <div className="absolute right-1.5 top-1.5 bottom-1.5">
              <Button
                size="sm"
                onClick={handleSend}
                disabled={!inputValue.trim() || isThinking}
                className="rounded-full h-full aspect-square p-0 flex items-center justify-center"
              >
                <Send className="h-4 w-4 ml-0.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
