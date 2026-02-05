export type Message = {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    title: string;
    category: string;
    score: number;
    text: string;
  }>;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};
