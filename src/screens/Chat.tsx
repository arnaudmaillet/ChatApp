import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback
} from 'react'
import {
    collection,
    query,
    orderBy,
    addDoc,
    onSnapshot,
} from 'firebase/firestore'
import { Button, Text } from 'react-native';
import { NavigationProp } from '@react-navigation/native'
import { GiftedChat } from 'react-native-gifted-chat'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config';


interface Props {
    navigation: NavigationProp<any, any>;
}

const Chat = () => {

    const [messages, setMessages] = useState<any[]>([]);

    useLayoutEffect(() => {
        const collectionRef = collection(FIREBASE_DB, 'messages');
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map((doc) => {
                return {
                    _id: doc.id,
                    text: doc.data().text,
                    createdAt: doc.data().createdAt.toDate(),
                    user: doc.data().user
                }
            });
            setMessages(messages);
        });

        return () => unsubscribe();
    }, []);


    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))

        const { _id, text, createdAt, user } = messages[0];
        addDoc(collection(FIREBASE_DB, 'messages'), {
            _id,
            text,
            createdAt,
            user
        });
    }, []);

    return (
        <GiftedChat
            messages={messages}
            onSend={(messages: never) => onSend(messages)}
            user={{
                _id: FIREBASE_AUTH?.currentUser?.email || '',
            }}
            messagesContainerStyle={{ backgroundColor: '#fff' }}
        />
    )
}

export default Chat