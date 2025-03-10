export interface Quiz {
    ID: number;
    Title: string;
    Description: string;
    TimeLimit: number;
    IsPublished: boolean;
    ImageURL: string;
    CreatorID: number;
    CreatedAt: string;
    UpdatedAt: string;
    Questions: Question[];
    Categories: Category[];
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