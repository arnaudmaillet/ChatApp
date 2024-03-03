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
import { GiftedChat } from 'react-native-gifted-chat'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config';
import { FlatList, TextInput, TouchableOpacity, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSession } from '../contexts/Session/Session';


const Chat = ({ route }: { route: any }) => {

    const { item } = route.params;

    const { session } = useSession();

    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = React.useState('');

    // useLayoutEffect(() => {
    //     const collectionRef = collection(FIREBASE_DB, 'messages');
    //     const q = query(collectionRef, orderBy('createdAt', 'desc'));

    //     const unsubscribe = onSnapshot(q, (snapshot) => {
    //         const messages = snapshot.docs.map((doc) => {
    //             return {
    //                 _id: doc.id,
    //                 text: doc.data().text,
    //                 createdAt: doc.data().createdAt.toDate(),
    //                 user: doc.data().user
    //             }
    //         });
    //         setMessages(messages);
    //     });

    //     return () => unsubscribe();
    // }, []);


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


    useEffect(() => {
        setMessages(item.data().messages);
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <View className='flex-1 bg-white mb-4'>
            <View className='flex-row justify-between my-2'>
                <Text className='text-gray-500 text-xs mx-auto'>{new Date(item.createdAt.seconds * 1000).toLocaleString()}</Text>
            </View>
            <View className={`{flex-row justify-between ${item.userId === session?.id ? 'ml-auto' : 'mr-auto'}`}>
                <View className={`p-3 rounded-xl ${item.userId === session?.id ? 'bg-blue-500' : 'bg-gray-200'}`}>
                    <Text className={`${item.userId === session?.id ? 'text-white' : 'text-gray-900'}`}>{item.content}</Text>
                </View>
            </View>
        </View>
    );

    return (
        // <GiftedChat
        //     messages={messages}
        //     onSend={(messages: never) => onSend(messages)}
        //     user={{
        //         _id: FIREBASE_AUTH?.currentUser?.email || '',
        //     }}
        //     messagesContainerStyle={{ backgroundColor: '#fff' }}
        // />
        <KeyboardAvoidingView
            enabled={true}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 75 : 0}
            className='flex-1 bg-white'
        >
            <FlatList
                className='flex-1 mx-3'
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                inverted
            />
            <View className='flex-row items-center p-3 mb-5'>
                <TextInput
                    className='flex-1 mr-2 py-2 px-4 bg-white rounded-full border border-gray-200'
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                />
                <TouchableOpacity onPress={() => onSend()}>
                    <MaterialCommunityIcons name="send-circle" size={36} color="#3b82f6" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default Chat