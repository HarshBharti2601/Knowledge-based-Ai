import { NextResponse } from 'next/server';
import { generateEmbedding, generateAnswer } from '@/lib/openai';
import { queryVectors } from '@/lib/pinecone';
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    console.log('Generating query embedding...');
    
    // Generate embedding for query using search_query type
    const queryEmbeddingResponse = await cohere.embed({
      texts: [query],
      model: 'embed-english-v3.0',
      inputType: 'search_query', // Note: different from document type
    });
    
    const embeddings = queryEmbeddingResponse.embeddings;
    let queryEmbedding: number[];
    
    if (Array.isArray(embeddings)) {
      queryEmbedding = embeddings[0] as number[];
    } else if (embeddings && 'float' in embeddings) {
      queryEmbedding = (embeddings as any).float[0];
    } else {
      throw new Error('Failed to generate embeddings');
    }

    console.log('Searching Pinecone...');
    const results = await queryVectors(queryEmbedding, 5);

    if (results.length === 0 || !results) {
      return NextResponse.json({
        answer: "I couldn't find any relevant information in my knowledge base.",
        sources: [],
      });
    }

    // Extract context and sources
    const contexts: string[] = results.map((r, i) => {
      const metadata = r.metadata as Record<string, any>;
      const title = typeof metadata.title === 'string' ? metadata.title : 'Unknown';
      const text = typeof metadata.text === 'string' ? metadata.text : '';
      return `Document: ${title}\nContent: ${text}`;
    });

    console.log('Generating answer...');
    const answer = await generateAnswer(query, contexts);

    const sources = results.map((r) => {
      const metadata = r.metadata as Record<string, any>;
      return {
        title: typeof metadata.title === 'string' ? metadata.title : 'Unknown',
        category: typeof metadata.category === 'string' ? metadata.category : 'General',
        text: typeof metadata.text === 'string' ? metadata.text : '',
        score: typeof r.score === 'number' ? r.score : 0,
      };
    });

    return NextResponse.json({
      answer,
      sources,
    });
  } catch (error: any) {
    console.error('Query error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}