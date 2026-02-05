'use client';

import { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    title: string;
    category: string;
    score: number;
    text: string;
  }>;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const [indexed, setIndexed] = useState(false);

  const handleIndex = async () => {
    setIndexing(true);
    try {
      const res = await fetch('/api/ingest', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIndexed(true);
        alert('Knowledge base indexed successfully!');
      } else {
        alert('Indexing failed: ' + data.error);
      }
    } catch (error) {
      alert('Indexing failed');
    }
    setIndexing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
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

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, an error occurred.' },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🤖 Knowledge Base Assistant
          </h1>
          <p className="text-gray-600">
            AI-powered customer service copilot with source citations
          </p>
        </header>

        {!indexed && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700">
                  <strong>First time setup:</strong> Index the knowledge base to enable queries
                </p>
              </div>
              <button
                onClick={handleIndex}
                disabled={indexing}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {indexing ? 'Indexing...' : 'Index Now'}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-20">
                <p className="text-lg">Ask me anything about our platform!</p>
                <div className="mt-6 text-sm space-y-2">
                  <p className="text-gray-500">Try asking:</p>
                  <div className="space-y-1">
                    <p>"How do I open an account?"</p>
                    <p>"What are the trading hours?"</p>
                    <p>"How do deposits and withdrawals work?"</p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx}>
                  <div
                    className={`flex ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 ml-2 space-y-2">
                      <p className="text-xs font-semibold text-gray-600">📚 Sources:</p>
                      {msg.sources.slice(0, 3).map((source, i) => (
                        <div
                          key={i}
                          className="bg-blue-50 border-l-4 border-blue-400 p-3 text-sm rounded"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-blue-900">{source.title}</p>
                            <span className="text-xs bg-blue-200 px-2 py-1 rounded">
                              {source.category}
                            </span>
                          </div>
                          <p className="text-gray-700 text-xs line-clamp-2">{source.text}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Relevance: {(source.score * 100).toFixed(1)}%
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t p-4 bg-gray-50">
            <div className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={!indexed || loading}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-200"
              />
              <button
                type="submit"
                disabled={!indexed || loading || !input.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Send
              </button>
            </div>
          </form>
        </div>

        <footer className="text-center mt-8 text-sm text-gray-600">
          Built with Next.js, OpenAI, and Pinecone • Internship Assignment
        </footer>
      </div>
    </div>
  );
}