export interface Project {
  id: string;
  name: string;
  createdAt: string;
}

export interface HistoryItem {
  id: string;
  projectId: string;
  step: 'original' | 'B1' | 'B2' | 'B3';
  title: string;
  subtitle: string;
  imageUrl: string;
  timestamp: string;
  prompt?: string;
  settings?: {
    model?: 'Flash' | 'Pro';
    mood?: string;
    styleRef?: string;
    opacity?: number;
    brushSize?: number;
    feather?: number;
    edgeBlend?: string;
  };
  maskUrl?: string;
}

export interface User {
  loggedIn: boolean;
  email: string;
  name: string;
  role: string;
  credits: number;
}
