import { NextResponse } from 'next/server';
import { generateEmbedding, generateAnswer } from '@/lib/openai';
import { queryVectors } from '@/lib/pinecone';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Search for similar chunks
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
      text: r.metadata?.text || '',
    }));

    // Generate answer using GPT-4
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