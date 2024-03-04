import { DocumentReference } from "firebase/firestore";
import { IMessage } from "./IMessage";

export interface IChat {
    uid?: string;
    users: DocumentReference[];
    messages: IMessage[]
}