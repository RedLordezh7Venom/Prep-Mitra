export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  examType: string[];
  progress: {
    [subject: string]: number;
  };
  streakDays: number;
  points: number;
  level: number;
}

export interface StudyMaterial {
  id: string;
  title: string;
  category: string;
  type: 'video' | 'document' | 'quiz' | 'flashcard';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  content: any;
} 