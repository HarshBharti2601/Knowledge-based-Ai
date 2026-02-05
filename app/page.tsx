'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { ChatArea } from '@/components/chat-area';
import type { Message, ChatSession } from '@/lib/types';

export default function Home() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const [indexed, setIndexed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load chats from localStorage on mount
    const savedChats = localStorage.getItem('kb-chats');
    if (savedChats) {
      try {
        const parsed = JSON.parse(savedChats);
        setChats(parsed);
        if (parsed.length > 0) {
          setCurrentChatId(parsed[0].id);
        }
      } catch (e) {
        console.error('Failed to parse saved chats');
      }
    }
    // Check if indexed
    const isIndexed = localStorage.getItem('kb-indexed');
    if (isIndexed === 'true') {
      setIndexed(true);
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (mounted && chats.length > 0) {
      localStorage.setItem('kb-chats', JSON.stringify(chats));
    }
  }, [chats, mounted]);

  const currentChat = chats.find((c) => c.id === currentChatId);
  const messages = currentChat?.messages || [];

  const handleIndex = async () => {
    setIndexing(true);
    try {
      const res = await fetch('/api/ingest', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIndexed(true);
        localStorage.setItem('kb-indexed', 'true');
      } else {
        alert('Indexing failed: ' + data.error);
      }
    } catch (error) {
      alert('Indexing failed');
    }
    setIndexing(false);
  };

  const createNewChat = useCallback(() => {
    const newChat: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setInput('');
  }, []);

  const handleSelectChat = (id: string) => {
    setCurrentChatId(id);
    setInput('');
  };

  const handleDeleteChat = (id: string) => {
    setChats((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      if (currentChatId === id) {
        setCurrentChatId(updated.length > 0 ? updated[0].id : null);
      }
      if (updated.length === 0) {
        localStorage.removeItem('kb-chats');
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Create new chat if none exists
    let chatId = currentChatId;
    if (!chatId) {
      const newChat: ChatSession = {
        id: crypto.randomUUID(),
        title: input.slice(0, 30) + (input.length > 30 ? '...' : ''),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setChats((prev) => [newChat, ...prev]);
      chatId = newChat.id;
      setCurrentChatId(chatId);
    }

    const userMessage: Message = { role: 'user', content: input };

    // Update chat with user message
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          const isFirstMessage = chat.messages.length === 0;
          return {
            ...chat,
            title: isFirstMessage
              ? input.slice(0, 30) + (input.length > 30 ? '...' : '')
              : chat.title,
            messages: [...chat.messages, userMessage],
            updatedAt: new Date(),
          };
        }
        return chat;
      })
    );

    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
      };

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, assistantMessage],
              updatedAt: new Date(),
            };
          }
          return chat;
        })
      );
    } catch (error) {
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [
                ...chat.messages,
                { role: 'assistant', content: 'Sorry, an error occurred.' },
              ],
              updatedAt: new Date(),
            };
          }
          return chat;
        })
      );
    }
    setLoading(false);
  };

  if (!mounted) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header onIndex={handleIndex} indexing={indexing} indexed={indexed} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onNewChat={createNewChat}
          onDeleteChat={handleDeleteChat}
        />
        <ChatArea
          messages={messages}
          loading={loading}
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          disabled={!indexed}
        />
      </div>
    </div>
  );
}
