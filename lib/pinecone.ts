import { Pinecone } from '@pinecone-database/pinecone';

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
  const index = await getIndex();
  await index.upsert(vectors);
}

export async function queryVectors(embedding: number[], topK: number = 5) {
  const index = await getIndex();
  const results = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true,
  });
  
  return results.matches || [];
}