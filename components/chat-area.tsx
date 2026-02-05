'use client';

import type { Message } from '@/lib/types';

type ChatAreaProps = {
  messages: Message[];
  loading: boolean;
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
  onSourceClick: (source: any, allSources: any[]) => void;
};

export function ChatArea({
  messages,
  loading,
  input,
  setInput,
  onSubmit,
  disabled,
  onSourceClick,
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
                <div className="mt-2 ml-2 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Sources:
                  </p>
                  {msg.sources.slice(0, 3).map((source, i) => (
                    <div
                      key={i}
                      className="bg-accent/50 border-l-4 border-primary p-3 text-sm rounded"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-foreground">{source.title}</p>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          {source.category}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs line-clamp-2">
                        {source.text}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
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
