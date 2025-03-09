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
    id: number;
    quizID: number;
    text: string;
    imageURL: string;
    choices: Choice[];
}

export interface Choice {
    id: number;
    questionID: number;
    text: string;
    imageURL: string;
    isCorrect: boolean;
}

export interface Category {
    ID: number;
    Name: string;
    description: string;
}