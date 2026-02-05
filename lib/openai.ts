import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  
  return response.data[0].embedding;
}

export async function generateAnswer(query: string, context: string[]): Promise<string> {
  const systemPrompt = `You are a helpful customer service assistant for a fintech trading platform. 
Answer questions based ONLY on the provided context. 
Always cite your sources by mentioning the document title.
If the answer is not in the context, say "I don't have information about that in my knowledge base."
Be concise but helpful.`;

  const userPrompt = `Context:\n${context.join('\n\n---\n\n')}\n\nQuestion: ${query}\n\nAnswer:`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return response.choices[0].message.content || 'Unable to generate answer.';
}