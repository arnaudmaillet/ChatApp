import React from "react";
import { DefaultChat, IChat } from "../types/IChat";
import { useSession } from "./Session";
import { DocumentData, DocumentReference, Timestamp, Unsubscribe, addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { FIREBASE_DB, dbCollections } from "../../config";
import { IMessage } from "../types/IMessage";
import { IUser } from "../types/IUser";

enum DataSort {
    ASC = 'asc',
    DESC = 'desc'
}

interface IDataContext {
    data: IChat[];
    getData: () => Promise<void>;
    updateData: (chat: IChat) => void;
    sendData: (chatUid: string, message: string, messages: IMessage[]) => void;
    addData: () => void;
    listenData: (chatUid: string, messages: IMessage[], setView: React.Dispatch<React.SetStateAction<IMessage[]>>) => Unsubscribe;
}

interface IDataProps {
    children: React.ReactNode;
};

const DataContext = React.createContext<IDataContext | null>(null);

const DataProvider: React.FC<IDataProps> = ({ children }: IDataProps) => {

    const { session } = useSession();
    const [data, setData] = React.useState<IChat[]>([])

    const sortData = (data: IMessage[], sort: DataSort) => {
        return data.sort((a, b) => {
            if (sort === DataSort.ASC) {
                return a.createdAt.seconds - b.createdAt.seconds;
            } else {
                return b.createdAt.seconds - a.createdAt.seconds;
            }
        });
    }

    const sendData = (chatUid: string, message: string, messages: IMessage[]) => {
        if (message.trim() === '') {
            return;
        } else {
            sortData(messages, DataSort.DESC);
            addDoc(collection(FIREBASE_DB, dbCollections._CHAT_COLLECTION, chatUid, dbCollections._MESSAGE_COLLECTION), {
                message: message,
                createdAt: Timestamp.now(),
                userId: session!.uid,
                displayDate: messages[0].createdAt.seconds * 1000 > Timestamp.now().seconds * 1000 - (60 * 30)
            } as IMessage);
        }
    }

    const listenData = (chatUid: string, messages: IMessage[], setView: React.Dispatch<React.SetStateAction<IMessage[]>>): Unsubscribe => {
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
            const userSnapshot = await getDoc(doc(FIREBASE_DB, dbCollections._USER_COLLECTION, session!.uid) as DocumentReference<DocumentData, DocumentData>);
            const response = query(collection(FIREBASE_DB, dbCollections._CHAT_COLLECTION), where(dbCollections._USER_COLLECTION, 'array-contains', userSnapshot.ref));
            const chatSnapshot = await getDocs(response);
            const chatsData: IChat[] = [];

            await Promise.all(chatSnapshot.docs.map(async (chatDoc) => {
                const chatDocs = chatDoc.data()

                const messagesRef = collection(chatDoc.ref, dbCollections._MESSAGE_COLLECTION);
                const messagesSnapshot = await getDocs(messagesRef);
                const messagesData = messagesSnapshot.docs.map((messageDoc) => {
                    const messageData = messageDoc.data() as IMessage
                    messageData.uid = messageDoc.id;
                    messageData.displayDate = false;
                    return messageData;
                });

                const usersDocs = chatDocs.users as DocumentReference<DocumentData, DocumentData>[];
                const chatData: IChat = { ...DefaultChat };

                await Promise.all(usersDocs.map(async (userRef) => {
                    const userSnapshot = await getDoc(userRef);
                    const userData = userSnapshot.data() as IUser;
                    userData.uid = userSnapshot.id;
                    chatData.users.push(userData);
                }));

                sortData(messagesData, DataSort.DESC);
                chatData.uid = chatDoc.id as string;
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

    const addData = () => {
        addDoc(collection(FIREBASE_DB, dbCollections._CHAT_COLLECTION), {
            messages: [],
            users: [doc(FIREBASE_DB, dbCollections._USER_COLLECTION, session!.uid) as DocumentReference<DocumentData, DocumentData>]
        })
        getData();
    }

    return (
        <DataContext.Provider value={{ data, getData, updateData, sendData, addData, listenData }}>
            {children}
        </DataContext.Provider>
    )
}

const useData = (): IDataContext => {
    const context = React.useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}

export { DataProvider, DataContext, useData }