import React from 'react'
import { FlatList, TextInput, TouchableOpacity, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSession } from '../contexts/Session';
import { useApp } from '../contexts/App';
import { IMessage } from '../types/IMessage';
import { useData } from '../contexts/Data';

interface IChatProps {
    route: {
        params: {
            uid: string,
            messages: IMessage[]
        }
    }
}

const Chat: React.FC<IChatProps> = ({ route }: IChatProps) => {

    const { uid, messages } = route.params;
    const { session } = useSession();
    const { generateUId } = useApp();
    const { sendData, listenData } = useData();

    const [messagesView, setMessagesView] = React.useState<IMessage[]>([]);
    const [newMessage, setNewMessage] = React.useState<string>('');

    const onSend = () => {
        sendData(uid, newMessage, messagesView);
        setNewMessage('');
    }

    React.useEffect(() => {
        return listenData(uid, messages, setMessagesView)
    }, [])

    const renderItem = ({ item }: { item: IMessage }) => {
        return (
            <View className='flex-1 bg-white mb-4'>
                {item.displayDate === true &&
                    <View className='flex-row justify-between my-2'>

                        <Text className='text-gray-500 text-xs mx-auto'>{new Date(item.createdAt.seconds * 1000).toLocaleString([], {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                        </Text>

                    </View>
                }
                <View className={`{flex-row justify-between ${item.userId === session?.id ? 'ml-auto' : 'mr-auto'}`}>
                    <View className={`p-3 rounded-xl ${item.userId === session?.id ? 'bg-blue-500' : 'bg-gray-200'}`}>
                        <Text className={`${item.userId === session?.id ? 'text-white' : 'text-gray-900'}`}>{item.message}</Text>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            enabled={true}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 75 : 0}
            className='flex-1 bg-white'
        >
            <FlatList
                className='flex-1 mx-3'
                data={messagesView}
                renderItem={renderItem}
                keyExtractor={item => generateUId()}
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