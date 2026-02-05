import { Pinecone, RecordMetadata } from '@pinecone-database/pinecone';

if (!process.env.PINECONE_API_KEY) {
  throw new Error('PINECONE_API_KEY is not set');
}

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const indexName = process.env.PINECONE_INDEX_NAME || 'knowledge-base';

export async function getIndex() {
  return pinecone.index(indexName);
}

export async function upsertVectors(vectors: Array<{
  id: string;
  values: number[];
  metadata: any;
}>) {
  if (!vectors || vectors.length === 0) {
    throw new Error('No vectors provided to upsert');
  }

  console.log(`Attempting to upsert ${vectors.length} vectors to Pinecone...`);
  
  const index = pinecone.index<RecordMetadata>(indexName);
  
  try {
    // Try direct upsert with proper typing
    await index.upsert({records:vectors});
    console.log('✓ Upsert successful');
  } catch (error: any) {
    console.error('Pinecone upsert error:', error);
    throw error;
  }
}

export async function queryVectors(embedding: number[], topK: number = 5) {
  const index = pinecone.index<RecordMetadata>(indexName);
  
  const results = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true,
  });
  
  return results.matches || [];
}