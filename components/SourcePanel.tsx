'use client';

interface SourcePanelProps {
  source: any;
  sources: any[];
  onClose: () => void;
  onSelectSource: (source: any) => void;
}

export function SourcePanel({ source, sources, onClose, onSelectSource }: SourcePanelProps) {
  return (
    <div className="w-96 border-l border-border bg-card flex flex-col animate-slideIn">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Source Details</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {sources.length} sources available
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition"
            title="Close panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* All Sources List */}
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="text-xs font-semibold text-muted-foreground mb-3">
            ALL SOURCES ({sources.length})
          </div>
          <div className="space-y-2">
            {sources.map((src, i) => (
              <button
                key={i}
                onClick={() => onSelectSource(src)}
                className={`w-full text-left p-3 rounded-lg transition border ${
                  source === src
                    ? 'bg-primary/10 border-primary/50'
                    : 'bg-card border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-primary">[{i + 1}]</span>
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">
                    {(src.score * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm font-medium truncate">{src.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{src.category}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Source Details */}
        {source && (
          <div className="p-4 space-y-4">
            <div>
              <div className="text-xs text-muted-foreground mb-2">DOCUMENT TITLE</div>
              <div className="font-bold text-lg">{source.title}</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2">CATEGORY</div>
              <div className="inline-flex px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium border border-primary/30">
                {source.category}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2">RELEVANCE SCORE</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Match Quality</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {(source.score * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                    style={{ width: `${source.score * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2">CONTENT PREVIEW</div>
              <div className="p-4 bg-muted rounded-xl text-sm leading-relaxed border border-border max-h-64 overflow-y-auto">
                {source.text}
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(source.text);
                  alert('Source content copied!');
                }}
                className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="text-xs text-muted-foreground text-center">
          💡 Click on any source above to view its details
        </div>
      </div>
    </div>
  );
}