'use client';

import { useState } from 'react';
import type { Message } from '@/lib/types';

type ChatAreaProps = {
  messages: Message[];
  loading: boolean;
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
};

export function ChatArea({
  messages,
  loading,
  input,
  setInput,
  onSubmit,
  disabled,
}: ChatAreaProps) {
  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-foreground mb-2">
              How can I help you today?
            </p>
            <p className="text-sm text-center max-w-md">
              Ask me anything about our platform. I can help with account setup, trading
              hours, deposits, withdrawals, and more.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'How do I open an account?',
                'What are the trading hours?',
                'How do deposits work?',
                'What fees do you charge?',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  disabled={disabled}
                  className="px-4 py-2 text-sm bg-card border border-border rounded-lg hover:bg-accent transition-colors text-left text-foreground disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
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
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-card-foreground border border-border'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>

              {msg.sources && msg.sources.length > 0 && (
                <SourcesList sources={msg.sources} />
              )}
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="border-t border-border p-4 bg-card">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={disabled ? 'Index the knowledge base first...' : 'Ask a question...'}
            disabled={disabled || loading}
            className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:bg-muted disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={disabled || loading || !input.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

// Expandable sources component
function SourcesList({ sources }: { sources: Message['sources'] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!sources) return null;

  return (
    <div className="mt-3 ml-2 space-y-2">
      <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3 h-3"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
        Sources ({sources.length})
      </p>
      {sources.slice(0, 3).map((source, i) => (
        <button
          key={i}
          onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
          className="w-full text-left bg-accent/50 hover:bg-accent border border-border rounded-lg p-3 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
              {source.title}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                {source.category}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                  expandedIndex === i ? 'rotate-180' : ''
                }`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3 h-3"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              Relevance: {(source.score * 100).toFixed(0)}%
            </span>
          </div>
          {expandedIndex === i && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {source.text}
              </p>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
