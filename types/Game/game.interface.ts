export interface GameSession {
    id: string;
    quizId: number;
    hostId: number;
    status: 'lobby' | 'in_progress' | 'completed';
    startedAt?: string;
    finishedAt?: string;
    createdAt: string;
    quiz?: Quiz;
    players?: Player[];
  }
  
  export interface Quiz {
    id: number;
    title: string;
    description: string;
    ownerId: number;
    categoryId?: number;
    coverImage?: string;
    createdAt: string;
    updatedAt: string;
    questions?: Question[];
  }
  
  export interface Question {
    id: number;
    quizId: number;
    text: string;
    image?: string;
    timeLimit?: number;
    createdAt: string;
    updatedAt: string;
    choices?: Choice[];
  }
  
  export interface Choice {
    id: number;
    questionId: number;
    text: string;
    isCorrect: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Player {
    id: number;
    sessionId: string;
    userId: number;
    nickname: string;
    score: number;
    joinedAt: string;
    user?: {
      id: number;
      username: string;
      avatar?: string;
    };
  }
  
  export interface PlayerAnswer {
    id: number;
    sessionId: string;
    quizId: number;
    questionId: number;
    playerId: number;
    choiceId: number;
    timeSpent: number;
    isCorrect: boolean;
    points: number;
    createdAt: string;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
  }
  
  export interface ChatMessage {
    userID: number;
    message: string;
  }
  
  export interface SocketMessage {
    type: string;
    payload: any;
  }