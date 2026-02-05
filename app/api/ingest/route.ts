import { NextResponse } from 'next/server';
import { mockDocuments, chunkDocument } from '@/lib/documents';
import { generateEmbedding } from '@/lib/openai';
import { upsertVectors } from '@/lib/pinecone';

export async function POST() {
  try {
    const allChunks = mockDocuments.flatMap(doc => chunkDocument(doc));
    
    console.log(`Processing ${allChunks.length} chunks...`);
    
    const vectors = await Promise.all(
      allChunks.map(async (chunk) => {
        const embedding = await generateEmbedding(chunk.text);
        return {
          id: chunk.id,
          values: embedding,
          metadata: {
            text: chunk.text,
            ...chunk.metadata,
          },
        };
      })
    );

    await upsertVectors(vectors);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully indexed ${vectors.length} chunks from ${mockDocuments.length} documents` 
    });
  } catch (error: any) {
    console.error('Ingestion error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}