import { IMessage } from "./IMessage";
import { IUser } from "./IUser";

export interface IChat {
    uid?: string;
    users: IUser[];
    messages: IMessage[]
}

export const DefaultChat = {
    uid: '',
    users: [],
    messages: []
} as IChat