import React from 'react';
import { FlatList, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, interpolate, FadeInDown, PinwheelIn, SlideInDown, BounceInRight, ZoomIn, ZoomInRight, SlideInRight } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSession } from '../contexts/Session';
import { useData } from '../contexts/Data';
import { IMessage } from '../types/IMessage';
import { TChatNavigationProp } from '../types/INavigation';
import Message from '../components/Message';
import { _COLORS } from '../misc/colors';
import { Foundation } from '@expo/vector-icons';

interface IChatProps {
    route: TChatNavigationProp;
}

const Chat: React.FC<IChatProps> = ({ route }) => {

    const self = route.params;
    const { sendData, listenData } = useData();

    const [messagesView, setMessagesView] = React.useState<IMessage[]>([]);
    const [newMessage, setNewMessage] = React.useState<string>('');

    const opacity = useSharedValue(0);

    React.useEffect(() => {
        return listenData(self, setMessagesView)
    }, [])

    React.useEffect(() => {
        opacity.value = interpolate(messagesView.length, [0, messagesView.length], [0, 1]);
    }, [messagesView]);

    const onSend = () => {
        sendData(self, newMessage, messagesView);
        setNewMessage('');
    }

    const renderItem = ({ item, index }: { item: IMessage, index: number }) => {
        return <Message item={item} index={index} />;
    }

    return (
        <KeyboardAvoidingView
            enabled={true}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 75 : 0}
            style={styles.container}
        >
            <FlatList
                style={styles.flatList}
                data={messagesView}
                renderItem={renderItem}
                keyExtractor={item => item.uid!}
                inverted
            />
            <View style={styles.inputContainer}>
                <Animated.View
                    entering={SlideInDown.springify().damping(20).mass(0.5)}
                    style={{ flex: 1, height: 40 }}>
                    <TextInput
                        style={styles.input}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type a message..."
                    />
                </Animated.View>
                <Animated.View
                    entering={SlideInRight.springify().damping(20).mass(0.5).delay(200)}
                    style={styles.sendButton}>
                    <TouchableOpacity onPress={onSend}>
                        {newMessage.length === 0 ?
                            <Foundation name="microphone" size={35} color={_COLORS._BORDER} />
                            :
                            <MaterialCommunityIcons name="send-circle" size={40} color='#FF6600' />
                        }
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: _COLORS._BACKGROUND._WHITE,
    },
    flatList: {
        flex: 1,
        padding: 10,

    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        marginRight: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: _COLORS._BORDER,
        height: 30,
    },
    sendButton: {
        padding: 3,
        width: 50,
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});


export default Chat;
