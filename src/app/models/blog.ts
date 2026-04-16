export interface BlogModel {
    id: number;
    preview: string;
    title: string;
    exhibits: number[];
    content: BlogContent[];
    days: number;
    difficulty: number;
    distance: number;
    price: number;
    small_content: string;
    date: string;
}

export interface BlogContent {
    title: string;
    data: BlogContentText[];
}

export interface BlogContentText {
    text: string;
    exhibits: number[];
}