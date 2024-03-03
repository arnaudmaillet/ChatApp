import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { DocumentData, DocumentReference, DocumentSnapshot, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { FIREBASE_DB } from '../../config'
import { useSession } from '../contexts/Session'
import { useNavigation } from '@react-navigation/native'
import { IChat } from '../types/IChat'
import { IMessage } from '../types/IMessage'

interface INavigation {
    navigate: (name: string, params: any) => void
}

const Home = () => {

    const { session } = useSession();
    const navigation = useNavigation<INavigation>()

    const [data, setData] = React.useState<IChat[]>([])

    const getData = async () => {
        if (!session) {
            return;
        } else {
            const userRef = doc(FIREBASE_DB, 'users', session!.id) as DocumentReference<DocumentData, DocumentData>;
            const userSnapshot = await getDoc(userRef);
            const response = query(collection(FIREBASE_DB, 'chats'), where('users', 'array-contains', userSnapshot.ref));
            const chatSnapshot = await getDocs(response);
            const chatsData: IChat[] = [];

            await Promise.all(chatSnapshot.docs.map(async (chatDoc) => {
                const chatData = chatDoc.data() as IChat;
                const messagesRef = collection(chatDoc.ref, 'messages');
                const messagesSnapshot = await getDocs(messagesRef);
                const messagesData = messagesSnapshot.docs.map((messageDoc) => {
                    const messageData = messageDoc.data() as IMessage
                    messageData.uid = messageDoc.id;
                    return messageData;
                });
                messagesData.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
                chatData.uid = chatDoc.id;
                chatData.messages = messagesData;
                chatsData.push(chatData);
            }));

            setData(chatsData);
        }
    };

    useEffect(() => {
        getData()
    }, [])

    const renderItem = ({ item, index }: { item: IChat; index: number }) => {
        return (
            <TouchableOpacity
                className='my-2'
                onPress={() => navigation.navigate('Chat', { uid: item.uid, messages: item.messages })}>
                <View className='p-4 border border-gray-200 rounded-lg'>
                    <Text className={`font-bold text-lg`}>Channel {index}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className={`flex-1 bg-white p-4`}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.uid}
            />
        </View>
    );
}


export default Home