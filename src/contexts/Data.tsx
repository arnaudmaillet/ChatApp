import React from "react";
import { DefaultChat, IChat } from "../types/IChat";
import { useSession } from "./Session";
import { DocumentData, DocumentReference, Timestamp, Unsubscribe, addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { FIREBASE_DB, dbCollections } from "../../config";
import { IMessage } from "../types/IMessage";
import { IUser } from "../types/IUser";

enum DataSort {
    ASC = 'asc',
    DESC = 'desc'
}

interface IDataContext {
    localData: IChat[];
    getData: () => Promise<void>;
    sendData: (chat: IChat, message: string, messages: IMessage[]) => void;
    findChat(): Promise<void>;
    listenData: (chat: IChat, setView: React.Dispatch<React.SetStateAction<IMessage[]>>) => Unsubscribe;
}

interface IDataProps {
    children: React.ReactNode;
};

const DataContext = React.createContext<IDataContext | null>(null);

const DataProvider: React.FC<IDataProps> = ({ children }: IDataProps) => {

    const { session, setSession } = useSession();
    const [localData, setLocalData] = React.useState<IChat[]>([])

    const sortData = (data: IMessage[], sort: DataSort) => {
        return data.sort((a, b) => {
            if (sort === DataSort.ASC) {
                return a.createdAt.seconds - b.createdAt.seconds;
            } else {
                return b.createdAt.seconds - a.createdAt.seconds;
            }
        });
    }

    const sendData = (chat: IChat, message: string, messages: IMessage[]) => {
        if (message.trim() === '') {
            return;
        } else {
            sortData(messages, DataSort.DESC);
            addDoc(collection(FIREBASE_DB, dbCollections._CHAT_COLLECTION, chat.uid!, dbCollections._MESSAGE_COLLECTION), {
                message: message,
                createdAt: Timestamp.now(),
                userId: session!.uid,
                displayDate: messages[0] ? messages[0].createdAt.seconds * 1000 > Timestamp.now().seconds * 1000 - (60 * 30) : true
            } as IMessage);
        }
    }

    const listenData = (chat: IChat, setView: React.Dispatch<React.SetStateAction<IMessage[]>>): Unsubscribe => {
        const chatRef = doc(FIREBASE_DB, dbCollections._CHAT_COLLECTION, chat.uid!);
        const messagesRef = collection(chatRef, dbCollections._MESSAGE_COLLECTION);

        setView(chat.messages);
        const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
            const updatedMessages: IMessage[] = snapshot.docs.map((doc) => {
                const messageData = doc.data() as IMessage;
                messageData.uid = doc.id;
                return messageData;
            });
            updateLocalData({ ...chat, messages: updatedMessages });
            setView(updatedMessages);
        });
        return () => unsubscribe()
    }

    const getData = async () => {
        if (session === null) {
            return;
        } else {
            const userSnapshot = await getDoc(doc(FIREBASE_DB, dbCollections._USER_COLLECTION, session!.uid) as DocumentReference<DocumentData, DocumentData>);
            const chatQuery = query(collection(FIREBASE_DB, dbCollections._CHAT_COLLECTION), where(dbCollections._USER_COLLECTION, 'array-contains', userSnapshot.ref));
            const chatSnapshot = await getDocs(chatQuery);
            const chatsData: IChat[] = [];

            await Promise.all(chatSnapshot.docs.map(async (chatDoc) => {
                let i = 0;
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
                const usersData: IUser[] = [];

                await Promise.all(usersDocs.map(async (userRef) => {
                    const userSnapshot = await getDoc(userRef);
                    const userData = userSnapshot.data() as IUser;
                    userData.uid = userSnapshot.id;
                    usersData.push(userData);
                    i++;
                }));

                sortData(messagesData, DataSort.DESC);
                chatData.uid = chatDoc.id as string;
                chatData.messages = messagesData;
                chatData.users = usersData;
                chatsData.push(chatData);
            }));
            setLocalData(chatsData);
        }
    }

    const updateLocalData = (chat: IChat) => {
        const index = localData.findIndex((c) => c.uid === chat.uid);
        const newData = [...localData];
        newData[index] = chat;
        sortData(newData[index].messages, DataSort.DESC);
        setLocalData(newData);
    }

    const findChat = async () => {
        try {
            await updateData({
                uid: session!.uid,
                email: session!.email,
                isSearching: true
            } as IUser);

            console.log('Searching for users');
        } catch (error) {
            console.error('Error while updating user data:', error);
        }

        await new Promise(resolve => setTimeout(resolve, 3000)); // wait 3 seconds

        const searchingUserQuery = query(collection(FIREBASE_DB, dbCollections._USER_COLLECTION), where('isSearching', '==', true));
        const searchingUserSnapshot = await getDocs(searchingUserQuery);
        const searchingUsers = searchingUserSnapshot.docs.filter(doc => doc.id !== session!.uid).map(doc => doc.ref);
        console.log('Searching for users')
        console.log('Searching for users ----> ' + searchingUsers);
        if (searchingUsers.length > 0) {
            try {
                await updateData({
                    uid: session!.uid,
                    email: session!.email,
                    isSearching: false
                } as IUser);

                console.log('Searching for users');
            } catch (error) {
                console.error('Error while updating user data:', error);
            }
            const matchedUser = searchingUsers[Math.floor(Math.random() * searchingUsers.length)];
            const thisUser = doc(FIREBASE_DB, dbCollections._USER_COLLECTION, session!.uid!);
            addData([thisUser, matchedUser]);
        } else {
            console.log('No user found, retrying in 3 seconds');
            //await new Promise(resolve => setTimeout(resolve, 60000)); // wait 1 minute
            //useData().findChat();
        }
    }

    const updateData = async (user: IUser) => {
        const userRef = doc(FIREBASE_DB, dbCollections._USER_COLLECTION, user.uid!);
        try {
            await updateDoc(userRef, {
                email: user.email,
                isSearching: user.isSearching
            });
        } catch (error) {
            console.error('Error while updating user data:', error);
        } finally {
            setSession(user);
        }

    }

    const addData = async (user: DocumentReference<DocumentData, DocumentData>[]) => {
        const chatRef = await addDoc(collection(FIREBASE_DB, dbCollections._CHAT_COLLECTION), { users: user });
        await setDoc(doc(chatRef, dbCollections._MESSAGE_COLLECTION, chatRef.id), {});
        getData();
    }

    return (
        <DataContext.Provider value={{ localData, getData, sendData, findChat, listenData }}>
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