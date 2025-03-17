export interface GameSession {
  id: string;
  quizId: number;
  hostId: number;
  status: GameStatus;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
  quiz?: Quiz;
  Players?: Player[];
  ID?: string;
}

export type GameStatus = 'lobby' | 'in_progress' | 'completed';

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
  timeLimit?: number; // เวลาในการตอบคำถาม (วินาที)
  createdAt: string;
  updatedAt: string;
  choices?: Choice[];
}

export interface Choice {
  id: number;
  questionId: number;
  text: string;
  isCorrect: boolean;
  image?: string;
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
    displayName?: string;
  };
}

export interface PlayerAnswer {
  id: number;
  sessionId: string;
  quizId: number;
  questionId: number;
  playerId: number;
  choiceId: number;
  timeSpent: number; // เวลาที่ใช้ในการตอบคำถาม (วินาที)
  isCorrect: boolean;
  points: number; // คะแนนที่ได้จากการตอบคำถามนี้
  createdAt: string;
}

export interface ChatMessage {
  userID: number;
  message: string;
  timestamp?: string;
}

export interface SocketMessage {
  type: string;
  payload: any;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  session?: GameSession;
  player?: Player;
  players?: Player[];
}

export interface GameSessionCreate {
  quizId: number;
}

export interface GameSessionJoin {
  nickname: string;
}

export interface AnswerSubmit {
  questionId: number;
  choiceId: number;
  timeSpent: number;
}

export type GameEvent = 
  | 'player_joined'
  | 'game_started'
  | 'question_started'
  | 'answer_submitted'
  | 'question_ended'
  | 'game_ended'
  | 'chat_message';

// ข้อมูลสถานะเกมสำหรับแสดงในหน้าแดชบอร์ด
export interface GameStats {
  totalPlayers: number;
  averageScore: number;
  highestScore: {
    player: Player;
    score: number;
  };
  questionStats: {
    questionId: number;
    correctPercentage: number;
    averageTime: number;
  }[];
}