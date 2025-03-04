export interface Quiz {
    id: number;
    title: string;
    description: string;
    questions: Question[];
}

export interface Question {
    id: number;
    image: string;
    question: string;
    answers: Answer[];
}

export interface Answer {
    id: number;
    answer: string;
    isCorrect: boolean;
}
