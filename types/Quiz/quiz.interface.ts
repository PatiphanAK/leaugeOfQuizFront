export interface Quiz {
    id: number;
    title: string;
    image: string;
    description: string;
    questions: Question[];
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
