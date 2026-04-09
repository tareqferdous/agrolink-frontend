"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type ChatResponse = {
  success: boolean;
  message: string;
  data: {
    intent: string;
    reply: string;
    suggestions: string[];
  };
};

const initialMessage: Message = {
  id: "welcome-1",
  role: "assistant",
  text: "Hi. I am AgroLink Assistant. Ask me about listings, bids, orders, payment, or tracking.",
};

const quickActions = [
  "How do I place a bid?",
  "How do I create a listing?",
  "How do I track my order?",
];

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [suggestions, setSuggestions] = useState<string[]>(quickActions);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isLoading,
    [input, isLoading],
  );

  const sendMessage = async (text: string) => {
    const content = text.trim();
    if (!content || isLoading) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      text: content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error("Assistant is unavailable right now.");
      }

      const json = (await response.json()) as ChatResponse;

      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        text: json.data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSuggestions(json.data.suggestions.slice(0, 3));
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant-error`,
          role: "assistant",
          text: "Sorry, I could not process that now. Please try again, or contact support@agrolinkbd.com.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await sendMessage(input);
  };

  return (
    <div className='fixed bottom-6 right-6 z-50'>
      {isOpen ? (
        <div className='w-88 max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden'>
          <div className='flex items-center justify-between px-4 py-3 bg-green-600 text-white'>
            <div>
              <p className='text-sm font-semibold'>AgroLink Assistant</p>
              <p className='text-xs text-green-100'>FAQ and task guidance</p>
            </div>
            <button
              type='button'
              onClick={() => setIsOpen(false)}
              className='rounded-md p-1 hover:bg-white/20 transition-colors'
              aria-label='Close chat'>
              <X size={16} />
            </button>
          </div>

          <div className='h-80 overflow-y-auto px-3 py-3 space-y-2 bg-gray-50/70 dark:bg-gray-900'>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto bg-green-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 border border-gray-100 dark:border-gray-700"
                }`}>
                {message.text}
              </div>
            ))}

            {isLoading && (
              <div className='max-w-[85%] rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 border border-gray-100 dark:border-gray-700'>
                Thinking...
              </div>
            )}
          </div>

          <div className='px-3 pb-3 pt-2 border-t border-gray-100 dark:border-gray-800'>
            <div className='mb-2 flex flex-wrap gap-2'>
              {suggestions.map((item) => (
                <button
                  key={item}
                  type='button'
                  onClick={() => sendMessage(item)}
                  className='rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>
                  {item}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className='flex items-center gap-2'>
              <input
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={500}
                placeholder='Ask a question...'
                className='flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none'
              />
              <button
                type='submit'
                disabled={!canSend}
                className='inline-flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                aria-label='Send message'>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          type='button'
          onClick={() => setIsOpen(true)}
          className='inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-green-700 transition-colors'
          aria-label='Open assistant'>
          <MessageCircle size={18} />
          Chat
        </button>
      )}
    </div>
  );
}
