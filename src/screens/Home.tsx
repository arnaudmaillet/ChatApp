import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { IChat } from '../types/IChat'
import { useData } from '../contexts/Data'

interface INavigation {
    navigate: (name: string, params: any) => void
}

const Home = () => {

    const navigation = useNavigation<INavigation>()
    const { data, getData } = useData()

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