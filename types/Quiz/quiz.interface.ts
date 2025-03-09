export interface Quiz {
    id: number;
    title: string;
    description: string;
    timeLimit: number;
    isPublished: boolean;
    imageURL: string;
    creatorID: number;
    createdAt: string;
    updatedAt: string;
    questions: Question[];
    categories: Category[];
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
    id: number;
    name: string;
    description: string;
}