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
    
    const queryEmbedding = queryEmbeddingResponse.embeddings[0];

    console.log('Searching Pinecone...');
    const results = await queryVectors(queryEmbedding, 5);

    if (results.length === 0) {
      return NextResponse.json({
        answer: "I couldn't find any relevant information in my knowledge base.",
        sources: [],
      });
    }

    // Extract context and sources
    const contexts = results.map(r => r.metadata?.text || '');
    const sources = results.map(r => ({
      title: r.metadata?.title || 'Unknown',
      category: r.metadata?.category || 'General',
      score: r.score || 0,
      text: (r.metadata?.text || '').slice(0, 300),
    }));

    console.log('Generating answer...');
    const answer = await generateAnswer(query, contexts);

    return NextResponse.json({
      answer,
      sources,
    });
  } catch (error: any) {
    console.error('Query error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}