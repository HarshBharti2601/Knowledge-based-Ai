# Knowledge Base AI Assistant

A production-ready, AI-powered knowledge base assistant that indexes internal documents and provides grounded, source-backed responses to user queries. Built with Next.js 15, Cohere AI, and Pinecone vector database.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![Cohere](https://img.shields.io/badge/Cohere-AI-purple?style=flat-square)
![Pinecone](https://img.shields.io/badge/Pinecone-Vector_DB-green?style=flat-square)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Overview

This project implements a Retrieval-Augmented Generation (RAG) system that enables users to query a knowledge base and receive AI-generated responses with cited sources. The system is designed to provide accurate, contextual answers while maintaining transparency through source attribution.

### Key Capabilities

- **Document Ingestion**: Index documents with automatic chunking and embedding generation
- **Semantic Search**: Find relevant documents using vector similarity search
- **Grounded Responses**: AI-generated answers with clear source citations
- **Modern UI**: Clean, responsive interface with dark/light mode support

---

## Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| **Document Indexing** | One-click indexing of knowledge base documents into Pinecone vector database |
| **Semantic Search** | Cohere embeddings enable meaning-based document retrieval |
| **Source Citations** | Every response includes expandable source cards with relevance scores |
| **Chat History** | Persistent conversation history with localStorage backup |

### User Interface

| Feature | Description |
|---------|-------------|
| **Collapsible Sidebar** | Resizable sidebar (200-400px) for managing chat sessions |
| **Dark/Light Mode** | System-aware theme with manual toggle option |
| **Profile Menu** | User profile dropdown with settings access |
| **GitHub Integration** | Direct link to source code repository |
| **Expandable Sources** | Click-to-expand source cards showing full document text |

### Technical Features

| Feature | Description |
|---------|-------------|
| **SSR Compatible** | Proper hydration handling for server-side rendering |
| **Type Safety** | Full TypeScript implementation with strict typing |
| **Error Handling** | Graceful fallbacks and user-friendly error messages |
| **Lazy Loading** | Optimized API client initialization |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Client (Browser)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │   Sidebar   │  │   Header    │  │  Chat Area  │  │   Theme    │ │
│  │  (History)  │  │  (Controls) │  │  (Messages) │  │  Provider  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Next.js API Routes                           │
│  ┌────────────────────────┐    ┌────────────────────────────────┐  │
│  │    /api/ingest         │    │         /api/query             │  │
│  │  (Document Indexing)   │    │    (Search & Generate)         │  │
│  └───────────┬────────────┘    └───────────────┬────────────────┘  │
└──────────────┼─────────────────────────────────┼────────────────────┘
               │                                 │
               ▼                                 ▼
┌──────────────────────────┐    ┌────────────────────────────────────┐
│       Cohere AI          │    │            Cohere AI               │
│  ┌────────────────────┐  │    │  ┌────────────┐  ┌─────────────┐  │
│  │ embed-english-v3.0 │  │    │  │  Embedding │  │   Command   │  │
│  │   (Embeddings)     │  │    │  │   Search   │  │  (Generate) │  │
│  └────────────────────┘  │    │  └────────────┘  └─────────────┘  │
└───────────┬──────────────┘    └────────────────┬───────────────────┘
            │                                    │
            ▼                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Pinecone Vector DB                           │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                    knowledge-base index                        │ │
│  │   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │ │
│  │   │ Vector 1 │  │ Vector 2 │  │ Vector 3 │  │ Vector N │     │ │
│  │   │ +metadata│  │ +metadata│  │ +metadata│  │ +metadata│     │ │
│  │   └──────────┘  └──────────┘  └──────────┘  └──────────┘     │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **CSS Variables** - Dynamic theming support

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Cohere AI** - Embeddings (embed-english-v3.0) and generation (command)
- **Pinecone** - Vector database for semantic search

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- Cohere API key ([Get one here](https://dashboard.cohere.com/api-keys))
- Pinecone API key ([Get one here](https://www.pinecone.io/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HarshBharti2601/Knowledge-based-Ai.git
   cd Knowledge-based-Ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your API keys.

4. **Create Pinecone Index**
   
   Create an index in your Pinecone dashboard with:
   - **Name**: `knowledge-base`
   - **Dimensions**: `1024` (for Cohere embed-english-v3.0)
   - **Metric**: `cosine`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

7. **Index the knowledge base**
   
   Click the "Index KB" button in the header to index the mock documents.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `COHERE_API_KEY` | Yes | Your Cohere API key for embeddings and generation |
| `PINECONE_API_KEY` | Yes | Your Pinecone API key for vector storage |
| `PINECONE_INDEX_NAME` | No | Custom index name (default: `knowledge-base`) |

### Example `.env.local`

```env
COHERE_API_KEY=your-cohere-api-key-here
PINECONE_API_KEY=your-pinecone-api-key-here
PINECONE_INDEX_NAME=knowledge-base
```

---

## API Reference

### POST `/api/ingest`

Indexes all mock documents into the Pinecone vector database.

**Request**: No body required

**Response**:
```json
{
  "success": true,
  "message": "Successfully indexed 10 documents"
}
```

### POST `/api/query`

Queries the knowledge base and generates an AI response.

**Request**:
```json
{
  "query": "How do I open an account?"
}
```

**Response**:
```json
{
  "answer": "To open an account, you must be at least 18 years old...",
  "sources": [
    {
      "title": "Account Opening Process",
      "category": "Account Management",
      "score": 0.89,
      "text": "Full document text..."
    }
  ]
}
```

---

## Project Structure

```
Knowledge-based-Ai/
├── app/
│   ├── api/
│   │   ├── ingest/
│   │   │   └── route.ts          # Document indexing endpoint
│   │   └── query/
│   │       └── route.ts          # Query and generation endpoint
│   ├── globals.css               # Global styles and theme variables
│   ├── layout.tsx                # Root layout with theme provider
│   └── page.tsx                  # Main application page
├── components/
│   ├── chat-area.tsx             # Chat messages and input
│   ├── header.tsx                # Top navigation bar
│   ├── sidebar.tsx               # Collapsible chat history sidebar
│   ├── theme-provider.tsx        # Theme context provider
│   └── theme-toggle.tsx          # Dark/light mode toggle
├── lib/
│   ├── documents.ts              # Mock knowledge base documents
│   ├── openai.ts                 # Cohere AI integration
│   ├── pinecone.ts               # Pinecone vector DB integration
│   └── types.ts                  # TypeScript type definitions
└── README.md                     # This file
```

---

## How It Works

### 1. Document Ingestion Flow

```
Mock Documents → Chunking → Cohere Embeddings → Pinecone Vectors
```

1. Documents are loaded from `lib/documents.ts`
2. Each document is chunked (if needed) for optimal retrieval
3. Cohere's `embed-english-v3.0` model generates 1024-dimensional embeddings
4. Vectors are stored in Pinecone with metadata (title, category, text)

### 2. Query Flow

```
User Query → Embedding → Vector Search → Context Assembly → AI Generation → Response
```

1. User submits a question through the chat interface
2. Query is converted to an embedding using Cohere
3. Pinecone performs similarity search (top 5 results)
4. Relevant document chunks are assembled as context
5. Cohere's `command` model generates a grounded response
6. Response and sources are returned to the UI

### 3. Source Citation

Every response includes:
- **Title**: Document name
- **Category**: Document classification
- **Relevance Score**: Cosine similarity percentage
- **Full Text**: Expandable document content

---

## Sample Knowledge Base

The included mock documents cover a fintech platform:

| Document | Category |
|----------|----------|
| Account Opening Process | Account Management |
| Trading Hours and Market Access | Trading |
| Deposit and Withdrawal Policy | Payments |
| Security Features and 2FA | Security |
| Fee Structure and Pricing | Pricing |
| Customer Support Methods | Support |
| Tax Reporting Documentation | Compliance |
| Mobile App Features | Product Features |
| Account Verification Levels | Account Management |
| Referral Program and Rewards | Rewards |

---

## Future Enhancements

- [ ] **Authentication** - User login with Supabase Auth
- [ ] **Document Upload** - Allow users to add custom documents
- [ ] **Admin Dashboard** - Manage knowledge base content
- [ ] **Analytics** - Track common queries and response quality
- [ ] **Multi-tenant** - Support for multiple organizations
- [ ] **Streaming Responses** - Real-time token streaming
- [ ] **Feedback System** - Thumbs up/down for response quality

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Cohere](https://cohere.com/) for embeddings and language generation
- [Pinecone](https://www.pinecone.io/) for vector database
- [Vercel](https://vercel.com/) for Next.js and deployment
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

<div align="center">

**Built with care by [Harsh Bharti](https://github.com/HarshBharti2601)**

</div>
