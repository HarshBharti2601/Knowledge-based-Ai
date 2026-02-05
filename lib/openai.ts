import { CohereClient } from 'cohere-ai';

let cohereClient: CohereClient | null = null;

function getCohere(): CohereClient {
  if (!process.env.COHERE_API_KEY) {
    throw new Error('COHERE_API_KEY is not set. Please add it to your environment variables.');
  }
  if (!cohereClient) {
    cohereClient = new CohereClient({
      token: process.env.COHERE_API_KEY,
    });
  }
  return cohereClient;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Cohere has a 512 token limit per text, so truncate if needed
    const truncatedText = text.slice(0, 2000);
    
    console.log('Generating embedding with Cohere...');
    
    const response = await getCohere().embed({
      texts: [truncatedText],
      model: 'embed-english-v3.0',
      inputType: 'search_document',
    });

    const embeddings = response.embeddings;
    
    if (Array.isArray(embeddings)) {
      // Direct array format: number[][]
      return embeddings[0] as number[];
    } else if (embeddings && 'float' in embeddings) {
      // Object format with float property
      return (embeddings as any).float[0];
    }
    //console.log(`✓ Embedding generated: ${embedding.length} dimensions`);
    throw new Error('Unexpected embeddings format from Cohere API');
    
  } catch (error: any) {
    console.error('Cohere embedding error:', error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

export async function generateAnswer(query: string, context: string[]): Promise<string> {
  try {
    console.log('Generating answer with Cohere...');
    
    const prompt = `You are a helpful customer service assistant for a fintech trading platform.

Context from knowledge base:
${context.slice(0, 3).join('\n\n---\n\n')}

Question: ${query}

Instructions:
- Answer based ONLY on the context above
- Cite the source document titles
- Be concise and helpful
- If the answer is not in the context, say "I don't have that information in my knowledge base"

Answer:`;

    const response = await getCohere().generate({
      prompt: prompt,
      model: 'command',
      maxTokens: 500,
      temperature: 0.7,
      stopSequences: [],
    });

    const answer = response.generations[0].text.trim();
    console.log('✓ Answer generated');
    
    return answer || 'Unable to generate answer.';
  } catch (error: any) {
    console.error('Cohere generation error:', error);
    
    // Fallback answer
    const fallback = `Based on the knowledge base:\n\n${context[0].slice(0, 400)}...\n\n(See sources below for more details)`;
    return fallback;
  }
}
