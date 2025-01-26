export interface Agent {
    id: string;  // or UUID if you have a specific UUID type
    name: string;
    role?: string; // Optional field, if it exists
}