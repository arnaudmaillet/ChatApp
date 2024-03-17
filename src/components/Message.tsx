import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IMessage } from '../types/IMessage';
import { useSession } from '../contexts/Session';
import { _COLORS } from '../misc/colors';
import Animated, { FadeIn, FadeInLeft, FadeInRight } from 'react-native-reanimated';

interface IMessageProps {
    item: IMessage;
    index: number;
}

const Message: React.FC<IMessageProps> = ({ item, index }) => {

    const { session } = useSession();
    return (
        <View style={styles.container}>
            {item.displayDate &&
                <Animated.View
                    style={styles.dateContainer}
                    entering={FadeIn.delay(20 * index).duration(1000)}
                >
                    <Text style={styles.date}>
                        {new Date(item.createdAt.seconds * 1000).toLocaleString([], {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                </Animated.View>
            }
            <Animated.View
                style={[styles.messageContainer, { justifyContent: item.userId === session?.uid ? 'flex-end' : 'flex-start' }]}
                entering={item.userId === session?.uid ? FadeInRight.springify().damping(10).delay(20 * index) : FadeInLeft.springify().damping(10).delay(20 * index)}
            >
                <View style={[styles.message, { backgroundColor: item.userId === session?.uid ? _COLORS._PRIMARY : '#EDEDED' }]}>
                    <Text style={{ color: item.userId === session?.uid ? 'white' : 'black' }}>{item.message}</Text>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 5,
        backgroundColor: _COLORS._BACKGROUND._WHITE,
    },
    dateContainer: {
        flex: 1,
        alignItems: 'center',
    },
    date: {
        color: 'gray',
        fontSize: 12,
        marginHorizontal: 'auto'
    },
    messageContainer: {
        flexDirection: 'row',
        paddingVertical: 1,
    },
    message: {
        padding: 10,
        borderRadius: 12,
    }
});

export default Message;
