import { DocumentSnapshot, Timestamp } from "firebase/firestore";

export interface IMessage {
    uid?: string;
    message: string;
    createdAt: Timestamp;
    userId: string;
} 