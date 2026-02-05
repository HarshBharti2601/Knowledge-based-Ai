import { NextResponse } from 'next/server';
import { mockDocuments, chunkDocument } from '@/lib/documents';
import { generateEmbedding } from '@/lib/openai';
import { upsertVectors } from '@/lib/pinecone';

export async function POST() {
  try {
    const allChunks = mockDocuments.flatMap(doc => chunkDocument(doc));
    
    console.log(`Processing ${allChunks.length} chunks...`);
    
    const vectors = [];
    
    for (let i = 0; i < allChunks.length; i++) {
      const chunk = allChunks[i];
      try {
        console.log(`[${i + 1}/${allChunks.length}] Processing chunk: ${chunk.id}`);
        const embedding = await generateEmbedding(chunk.text);
        
        console.log(`✓ Embedding generated for ${chunk.id}, dimensions: ${embedding.length}`);
        
        vectors.push({
          id: chunk.id,
          values: embedding,
          metadata: {
            text: chunk.text.slice(0, 1000), // Limit metadata size
            title: chunk.metadata.title,
            category: chunk.metadata.category,
            documentId: chunk.metadata.documentId,
            chunkIndex: chunk.metadata.chunkIndex,
          },
        });
        
        // Add delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error: any) {
        console.error(`✗ Failed chunk ${chunk.id}:`, error.message);
        console.error('Full error:', error);
        // Continue processing other chunks
      }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Total chunks: ${allChunks.length}`);
    console.log(`Successfully processed: ${vectors.length}`);
    console.log(`Failed: ${allChunks.length - vectors.length}`);

    if (vectors.length === 0) {
      return NextResponse.json({ 
        error: 'No vectors were generated. All embeddings failed. Check the console for detailed errors.',
        success: false,
      }, { status: 500 });
    }

    console.log(`\nUpserting ${vectors.length} vectors to Pinecone...`);
    await upsertVectors(vectors);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully indexed ${vectors.length} out of ${allChunks.length} chunks from ${mockDocuments.length} documents` 
    });
  } catch (error: any) {
    console.error('Ingestion error:', error);
    return NextResponse.json({ 
      error: error.message,
      details: error.toString(),
      success: false,
    }, { status: 500 });
  }
}