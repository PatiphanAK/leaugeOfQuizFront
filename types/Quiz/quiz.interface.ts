export interface Quiz {
    data: CreateUpdateQuizData | { Title: string; Description: string; TimeLimit: number; IsPublished: boolean; Categories: number[]; ImageURL?: string | { readonly lastModified: number; readonly name: string; readonly webkitRelativePath: string; readonly size: number; readonly type: string; arrayBuffer: { (): Promise<ArrayBuffer>; (): Promise<ArrayBuffer>; }; bytes: { (): Promise<Uint8Array>; (): Promise<Uint8Array>; }; slice: { (start?: number, end?: number, contentType?: string): Blob; (start?: number, end?: number, contentType?: string): Blob; }; stream: { (): ReadableStream<Uint8Array>; (): ReadableStream<Uint8Array>; }; text: { (): Promise<string>; (): Promise<string>; }; } | undefined; };
    ID: number;
    Title: string;
    Description: string;
    TimeLimit: number;
    IsPublished: boolean;
    ImageURL: string;
    CreatorID: number;
    CreatedAt: string;
    UpdatedAt: string;
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
