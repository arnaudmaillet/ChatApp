import React from "react";
import { IChat } from "../types/IChat";
import { useSession } from "./Session";
import { DocumentData, DocumentReference, Timestamp, Unsubscribe, addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { FIREBASE_DB, dbCollections } from "../../config";
import { IMessage } from "../types/IMessage";

enum DataSort {
    ASC = 'asc',
    DESC = 'desc'
}

interface IDataContext {
    data: IChat[];
    getData: () => Promise<void>;
    updateData: (chat: IChat) => void;
    sendData: (chatUid: string, message: string) => void;
    listenData: (chatUid: string, messages: IMessage[], setView: React.Dispatch<React.SetStateAction<IMessage[]>>) => Unsubscribe;
}

interface IDataProps {
    children: React.ReactNode;
};

export const DataContext = React.createContext<IDataContext | null>(null);

export const DataProvider: React.FC<IDataProps> = ({ children }: IDataProps) => {

    const { session } = useSession();
    const [data, setData] = React.useState<IChat[]>([])

    function sortData(data: IMessage[], sort: DataSort) {
        return data.sort((a, b) => {
            if (sort === DataSort.ASC) {
                return a.createdAt.seconds - b.createdAt.seconds;
            } else {
                return b.createdAt.seconds - a.createdAt.seconds;
            }
        });
    }

    function sendData(chatUid: string, message: string) {
        if (message.trim() === '') {
            return;
        } else {
            addDoc(collection(FIREBASE_DB, dbCollections._CHAT_COLLECTION, chatUid, dbCollections._MESSAGE_COLLECTION), {
                message: message,
                createdAt: Timestamp.now(),
                userId: session!.id
            } as IMessage);
        }
    }

    function listenData(chatUid: string, messages: IMessage[], setView: React.Dispatch<React.SetStateAction<IMessage[]>>): Unsubscribe {
        const chatRef = doc(FIREBASE_DB, dbCollections._CHAT_COLLECTION, chatUid);
        const messagesRef = collection(chatRef, dbCollections._MESSAGE_COLLECTION);

        setView(messages);
        const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
            const updatedMessages: IMessage[] = snapshot.docs.map((doc) => {
                const messageData = doc.data() as IMessage;
                messageData.uid = doc.id;
                return messageData;
            });
            updateData({ uid: chatUid, messages: updatedMessages } as IChat);
            setView(updatedMessages);
        });
        return () => unsubscribe()
    }

    const getData = async () => {
        if (session === null) {
            return;
        } else {
            const userRef = doc(FIREBASE_DB, dbCollections._USER_COLLECTION, session!.id) as DocumentReference<DocumentData, DocumentData>;
            const userSnapshot = await getDoc(userRef);
            const response = query(collection(FIREBASE_DB, dbCollections._CHAT_COLLECTION), where(dbCollections._USER_COLLECTION, 'array-contains', userSnapshot.ref));
            const chatSnapshot = await getDocs(response);
            const chatsData: IChat[] = [];

            await Promise.all(chatSnapshot.docs.map(async (chatDoc) => {
                const chatData = chatDoc.data() as IChat;
                const messagesRef = collection(chatDoc.ref, dbCollections._MESSAGE_COLLECTION);
                const messagesSnapshot = await getDocs(messagesRef);
                const messagesData = messagesSnapshot.docs.map((messageDoc) => {
                    const messageData = messageDoc.data() as IMessage
                    messageData.uid = messageDoc.id;
                    return messageData;
                });
                sortData(messagesData, DataSort.DESC);
                chatData.uid = chatDoc.id;
                chatData.messages = messagesData;
                chatsData.push(chatData);
            }));
            setData(chatsData);
        }
    }


    const updateData = (chat: IChat) => {
        const index = data.findIndex((c) => c.uid === chat.uid);
        const newData = [...data];
        newData[index] = chat;
        sortData(newData[index].messages, DataSort.DESC);
        setData(newData);
    }


    return (
        <DataContext.Provider value={{ data, getData, updateData, sendData, listenData }}>
            {children}
        </DataContext.Provider>
    )
}

export const useData = (): IDataContext => {
    const context = React.useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}