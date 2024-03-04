import { Timestamp } from "firebase/firestore";

export interface IMessage {
    uid?: string;
    message: string;
    createdAt: Timestamp;
    displayDate: boolean;
    userId: string;
} 