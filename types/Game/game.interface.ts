// types/Game/game.interface.ts

export type GameStatus = 'lobby' | 'starting' | 'in_progress' | 'ended';

export interface User {
  ID: number;
  GoogleID: string;
  Email: string;
  DisplayName: string;
  PictureURL?: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
}

export interface Quiz {
  ID: number;
  Title: string;
  Description: string;
  TimeLimit: number;
  IsPublished: boolean;
  ImageURL?: string;
  CreatorID: number;
  CreatedAt: string;
  UpdatedAt: string;
  Questions?: Question[];
  Categories?: Category[];
}

export interface Category {
  ID: number;
  Name: string;
}

export interface Question {
  ID: number;
  QuizID: number;
  Text: string;
  ImageURL?: string;
  Choices?: Choice[];
}

export interface Choice {
  ID: number;
  QuestionID: number;
  Text: string;
  IsCorrect: boolean;
  ImageURL?: string;
}

export interface GameSession {
  ID: string;
  QuizID: number;
  HostID: number;
  Status: GameStatus;
  CurrentQuestionIndex?: number;
  StartedAt?: string;
  FinishedAt?: string;
  CreatedAt: string;
  Quiz?: Quiz;
  Host?: User;
  Players?: GamePlayer[];
}

export interface GamePlayer {
  ID: number;
  SessionID: string;
  UserID: number;
  Nickname: string;
  Score: number;
  User?: User;
}

export interface PlayerAnswer {
  ID: number;
  SessionID: string;
  PlayerID: number;
  QuestionID: number;
  ChoiceID: number;
  IsCorrect: boolean;
  TimeSpent: number;
  Score: number;
}

// WebSocket messages และ payload
export interface JoinSessionPayload {
  sessionId: string; // ยังใช้ตัวพิมพ์เล็กตามข้อตกลงใน WebSocket API
  userId: number;
  nickname: string;
}

export interface GameActionPayload {
  sessionId: string;
  userId: number;
}

export interface SubmitAnswerPayload {
  sessionId: string;
  userId: number;
  questionId: number;
  choiceId: number;
  timeSpent: number;
}

export interface ChatMessagePayload {
  sessionId: string;
  userId: number;
  message: string;
}