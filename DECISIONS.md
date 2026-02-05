# Technical Decisions Document

> This document outlines the key architectural and technical decisions made during the development of the Knowledge Base AI Assistant, including the rationale behind each choice and trade-offs considered.

---

## Table of Contents

1. [Architecture Decisions](#architecture-decisions)
2. [Technology Stack](#technology-stack)
3. [AI/ML Decisions](#aiml-decisions)
4. [Frontend Decisions](#frontend-decisions)
5. [Data Storage Decisions](#data-storage-decisions)
6. [Security Considerations](#security-considerations)
7. [Trade-offs & Limitations](#trade-offs--limitations)

---

## Architecture Decisions

### ADR-001: Retrieval-Augmented Generation (RAG) Architecture

**Decision:** Implement a RAG-based system rather than fine-tuning a language model.

**Context:** We needed a system that could answer questions grounded in specific internal documents with verifiable sources.

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| Fine-tuned LLM | Better fluency, no retrieval latency | Expensive, no source attribution, hallucination risk |
| RAG Architecture | Source citations, updatable knowledge, cost-effective | Additional retrieval step, chunking complexity |
| Keyword Search + LLM | Simple implementation | Poor semantic understanding, misses context |

**Rationale:**
- RAG provides explicit source attribution for every response
- Knowledge base can be updated without retraining
- Lower cost than fine-tuning while maintaining accuracy
- Reduces hallucination by grounding responses in retrieved documents

**Consequences:**
- Requires vector database infrastructure
- Response quality depends on retrieval accuracy
- Need to manage document chunking strategies

---

### ADR-002: Serverless API Architecture

**Decision:** Use Next.js API routes (serverless functions) instead of a dedicated backend server.

**Context:** Need a scalable, cost-effective backend that integrates well with the frontend.

**Rationale:**
- Zero server management overhead
- Automatic scaling with traffic
- Cost-effective (pay per invocation)
- Seamless integration with Next.js frontend
- Easy deployment on Vercel

**Trade-offs:**
- Cold start latency on first request
- 10-second execution limit on Vercel Hobby plan
- Stateless architecture requires external state management

---

## Technology Stack

### ADR-003: Next.js 15 with App Router

**Decision:** Use Next.js 15 with the App Router paradigm.

**Context:** Needed a modern React framework with server-side capabilities.

**Rationale:**
- Server Components reduce client-side JavaScript
- Built-in API routes eliminate need for separate backend
- Excellent TypeScript support
- Strong ecosystem and community
- Optimized for Vercel deployment

**Alternatives Considered:**
- Remix: Good alternative but smaller ecosystem
- Vite + Express: More setup, less integrated
- Create React App: No SSR, deprecated

---

### ADR-004: Cohere for Embeddings and Generation

**Decision:** Use Cohere AI for both embedding generation and text generation.

**Context:** Needed reliable embedding and generation models with good documentation.

**Rationale:**
- `embed-english-v3.0` produces high-quality 1024-dimensional embeddings
- Unified API for both embeddings and generation
- Good documentation and TypeScript SDK
- Competitive pricing with generous free tier
- Supports batch embedding operations

**Alternatives Considered:**
| Provider | Embedding Model | Pros | Cons |
|----------|-----------------|------|------|
| OpenAI | text-embedding-3-small | Popular, well-documented | Higher cost, billing required |
| Cohere | embed-english-v3.0 | Good quality, free tier | Less popular |
| Hugging Face | Various | Open source, free | Requires hosting |

---

### ADR-005: Pinecone for Vector Storage

**Decision:** Use Pinecone as the vector database.

**Context:** Needed a scalable, managed vector database for similarity search.

**Rationale:**
- Fully managed service (no infrastructure management)
- Fast similarity search with filtering capabilities
- Generous free tier for development
- Easy-to-use SDK
- Supports metadata filtering

**Alternatives Considered:**
- Weaviate: Good but more complex setup
- Qdrant: Excellent but requires self-hosting for free tier
- Chroma: Good for local dev, less suitable for production
- pgvector: Requires PostgreSQL management

---

## AI/ML Decisions

### ADR-006: Chunking Strategy

**Decision:** Store documents as single chunks rather than splitting into smaller pieces.

**Context:** Mock documents are relatively short (under 1000 tokens each).

**Current Implementation:**
```typescript
// Each document stored as single vector
const vector = {
  id: doc.id,
  values: embedding,
  metadata: {
    title: doc.title,
    category: doc.category,
    text: doc.content
  }
};
```

**Future Consideration:**
For larger documents, implement:
- Recursive text splitting (500 tokens with 50 token overlap)
- Sentence-aware chunking to preserve context
- Metadata to link chunks back to parent documents

---

### ADR-007: Retrieval Parameters

**Decision:** Retrieve top 5 documents with relevance threshold.

**Parameters:**
- `topK: 5` - Balance between context and noise
- Score threshold: Display sources with >50% relevance
- Context window: Include top 3 sources in generation prompt

**Rationale:**
- 5 documents provide sufficient context without overwhelming the LLM
- Threshold filtering removes low-relevance noise
- Limiting displayed sources keeps UI clean

---

### ADR-008: Prompt Engineering Strategy

**Decision:** Use structured system prompts with explicit grounding instructions.

**Prompt Structure:**
```
You are a helpful customer service assistant...
Based on the following knowledge base articles:
[Retrieved Documents]
Please provide a helpful, accurate response...
If the information is not in the provided articles, say so.
```

**Key Principles:**
- Explicit instruction to ground responses in provided context
- Clear directive to acknowledge knowledge gaps
- Professional, helpful tone guidance
- Source attribution encouragement

---

## Frontend Decisions

### ADR-009: CSS Variables for Theming

**Decision:** Use CSS custom properties (variables) for the theme system.

**Context:** Needed light/dark mode support with easy customization.

**Implementation:**
```css
:root {
  --background: #f8fafc;
  --foreground: #0f172a;
  /* ... */
}

.dark {
  --background: #0f172a;
  --foreground: #f8fafc;
  /* ... */
}
```

**Rationale:**
- No JavaScript required for color switching
- CSS-only transitions between themes
- Easy to extend with additional themes
- Works with Tailwind CSS design tokens

---

### ADR-010: Client-Side Chat History Storage

**Decision:** Store chat history in localStorage rather than a database.

**Context:** Need to persist conversations without requiring authentication.

**Rationale:**
- No backend storage required
- Instant load times
- Privacy-friendly (data stays on device)
- Suitable for demo/portfolio use case

**Trade-offs:**
- Not synced across devices
- Lost if browser data cleared
- No analytics on usage patterns
- Limited storage capacity (~5MB)

**Future Migration Path:**
When adding authentication, migrate to database storage:
1. Add `chat_sessions` and `messages` tables
2. Sync localStorage to database on login
3. Maintain localStorage as offline cache

---

### ADR-011: Resizable Sidebar Implementation

**Decision:** Custom implementation using mouse events and CSS transitions.

**Context:** Needed GPT-style collapsible and resizable sidebar.

**Implementation Details:**
- Mouse event listeners for drag resize
- CSS `transition` for smooth collapse animation
- Min/max width constraints (200px - 400px)
- Persisted width preference in localStorage

**Alternatives Considered:**
- react-resizable-panels: Good library but adds dependency
- CSS resize property: Limited control and styling
- Framer Motion: Overkill for this use case

---

### ADR-012: Expandable Source Citations

**Decision:** Make source citations clickable and expandable rather than always-visible.

**Context:** Sources can contain lengthy text that clutters the chat interface.

**Implementation:**
- Collapsed view shows: title, category badge, relevance score
- Expanded view adds: full source text content
- Click to toggle expansion state
- Visual indicators (chevron rotation) for state

**Rationale:**
- Keeps chat interface clean and scannable
- Users can drill down into sources when needed
- Relevance scores help prioritize which sources to read
- Better mobile experience with less scrolling

---

## Data Storage Decisions

### ADR-013: Document Schema Design

**Decision:** Simple flat document structure with category-based organization.

**Schema:**
```typescript
interface Document {
  id: string;
  title: string;
  category: string;
  content: string;
}
```

**Categories Defined:**
- Account Management
- Trading & Investments
- Security
- Payments
- Support

**Rationale:**
- Simple structure easy to extend
- Categories enable filtered retrieval
- Metadata stored alongside vectors in Pinecone

---

### ADR-014: Mock Document Strategy

**Decision:** Create 10 realistic mock documents covering common customer service scenarios.

**Document Topics:**
1. Account verification process
2. Password reset procedures
3. Two-factor authentication setup
4. Trading account types
5. Fee structures and pricing
6. Payment methods
7. Withdrawal process
8. Account closure
9. Contact support options
10. Mobile app features

**Rationale:**
- Covers breadth of typical customer queries
- Realistic enough to demonstrate RAG capabilities
- Easy to extend with additional documents

---

## Security Considerations

### ADR-015: API Key Management

**Decision:** Use environment variables for all API keys with lazy initialization.

**Implementation:**
```typescript
function getCohere(): CohereClient {
  if (!process.env.COHERE_API_KEY) {
    throw new Error('COHERE_API_KEY is not set');
  }
  // Lazy initialization prevents startup crashes
}
```

**Security Measures:**
- API keys never exposed to client
- Server-side only API calls
- Environment variables in Vercel dashboard
- No keys committed to repository
- Lazy loading prevents module-level errors

---

### ADR-016: Input Validation

**Decision:** Validate all user inputs on the server side.

**Implemented Validations:**
- Query length limits
- Content type verification
- JSON parsing error handling
- Empty input rejection

**Future Enhancements:**
- Rate limiting per IP/session
- Content moderation for inputs
- Query sanitization

---

## Trade-offs & Limitations

### Current Limitations

| Limitation | Reason | Mitigation Path |
|------------|--------|-----------------|
| No authentication | Demo scope | Add Supabase Auth |
| localStorage only | No backend DB | Migrate to Supabase/Neon |
| English only | Cohere model choice | Use multilingual model |
| 10 mock documents | Demo scope | Add document upload UI |
| No streaming | Simpler implementation | Add SSE streaming |
| No rate limiting | Demo scope | Add Upstash rate limiter |

### Accepted Trade-offs

1. **Simplicity over Features:** Prioritized core RAG functionality over advanced features like document upload, user management, and analytics.

2. **Cost over Performance:** Chose serverless architecture accepting cold start latency in exchange for zero infrastructure cost.

3. **Privacy over Sync:** Chose localStorage accepting no cross-device sync in exchange for privacy and no auth requirement.

4. **Single Embedding Model:** Used same model for documents and queries, accepting potential mismatch for simplicity.

5. **Client-side State:** Managed chat state in React rather than server, accepting refresh data loss for simpler architecture.

---

## Future Decision Points

Decisions to be made when extending the project:

| Decision | Options | Recommendation |
|----------|---------|----------------|
| Authentication | Supabase Auth, NextAuth, Clerk | Supabase (integrated DB) |
| Chat Persistence | Supabase, Neon, PlanetScale | Supabase (unified platform) |
| Document Upload | Direct upload, S3, Vercel Blob | Vercel Blob (integrated) |
| Streaming | SSE, WebSockets | SSE (simpler, sufficient) |
| Rate Limiting | Upstash, custom | Upstash (serverless) |
| Analytics | Vercel Analytics, PostHog | Vercel Analytics (integrated) |

---

## Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-02-05 | 1.0 | Initial | Created decisions document |

---

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Cohere API Reference](https://docs.cohere.com/)
- [Pinecone Documentation](https://docs.pinecone.io/)
- [RAG Architecture Patterns](https://www.pinecone.io/learn/retrieval-augmented-generation/)
- [Vercel Deployment Guides](https://vercel.com/docs)

---

*This document follows the Architecture Decision Records (ADR) format for documenting significant technical decisions.*
