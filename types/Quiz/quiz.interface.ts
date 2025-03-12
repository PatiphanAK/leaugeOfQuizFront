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
    Categories: Category[];
    Questions: Question[];
}

export interface Question {
    ID: number;
    QuizID: number;
    Text: string;
    ImageURL: string;
    Choices: Choice[];
}

export interface Choice {
    ID: number;
    QuestionID: number;
    Text: string;
    ImageURL: string;
    IsCorrect: boolean;
}

export interface Category {
    ID: number;
    Name: string;
    description: string;
}

export interface CreateUpdateQuizData {
    Title: string;
    Description: string;
    TimeLimit: number;
    IsPublished: boolean;
    Categories: Category[];
    ImageURL?: File | string | null;
}

export interface CreateUpdateQuestionData {
    QuizID: number;
    Text: string;
    ImageURL?: File | string;
    Choices: CreateUpdateChoiceData[];
}

export interface CreateUpdateChoiceData {
    Text: string;
    ImageURL?: File | string;
    IsCorrect: boolean;
}
