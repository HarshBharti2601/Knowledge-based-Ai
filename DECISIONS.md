# AI Knowledge Base - Technical Decision Document

## Project Overview
An AI-powered knowledge base assistant that provides source-backed answers to customer queries using RAG (Retrieval Augmented Generation).

**Live Demo:** [Your Vercel URL here]
**GitHub Repository:** https://github.com/HarshBharti2601/Knowledge-based-Ai

---

## 1. Architecture & Tech Stack

### Frontend & Backend
- **Next.js 14+ (App Router)**: Chose for full-stack capabilities in one framework, reducing complexity and deployment overhead
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Rapid UI development with utility-first approach

### AI & ML Services
- **Cohere AI**: 
  - Embeddings: `embed-english-v3.0` (1024 dimensions)
  - Text Generation: `command` model
  - **Why?** Free tier (1000+ calls/month), reliable API, optimized for semantic search
  - Alternative considered: OpenAI (rejected due to billing requirements)

### Vector Database
- **Pinecone**: 
  - **Why?** Serverless, easy setup, free tier sufficient for assignment
  - Configured with cosine similarity for semantic matching
  - Alternatives considered: Supabase pgvector, Weaviate

### Deployment
- **Vercel**: 
  - Native Next.js support, zero-config deployment
  - Edge network for fast global access
  - Easy environment variable management

---

## 2. Key Technical Decisions

### Document Processing Strategy
**Decision:** Chunked documents into ~500 word segments

**Reasoning:**
- Preserves context while staying within model token limits
- Improves retrieval precision (smaller chunks = more specific matches)
- Better citation granularity for users

**Implementation:**
```typescript
function chunkDocument(doc, chunkSize = 500) {
  // Split into manageable chunks while preserving title context
}