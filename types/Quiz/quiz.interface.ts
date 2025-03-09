export interface Quiz {
    id: number;
    title: string;
    imageURL: string;
    description: string;
    questions: Question[];
    timeLimit: number;
    isPublished: boolean;
    categories: string[];
}

export interface Question {
    id: number;
    image: string;
    question: string;
    answers: Choice[];
}

export interface Choice {
    id: number;
    image: string;
    answer: string;
    isCorrect: boolean;
}

export interface Answer {
    id: number;
    answer: string;
    isCorrect: boolean;
    image: string;
}