export interface Resource {
    id: number;
    title: string;
    type: string;
    url: string;
    description: string;
    createdAt: string;
}

export type ResourceInput = {
    id: number;
    title: string;
}