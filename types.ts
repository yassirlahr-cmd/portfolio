export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  client?: string;
  year?: number;
  duration?: string;
  tools?: string[];
}

export interface IncomeEntry {
  id: string;
  project: string;
  client: string;
  amount: number;
  date: string;
}
