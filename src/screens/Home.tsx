import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { IChat } from '../types/IChat'
import { useData } from '../contexts/Data'

interface INavigation {
    navigate: (name: string, params: any) => void
}

const Home = () => {

    const navigation = useNavigation<INavigation>()
    const { data, getData, addData } = useData()

    useEffect(() => {
        getData()
    }, [])

    const onRefresh = () => {
        addData()
    }

    const renderItem = ({ item, index }: { item: IChat; index: number }) => {
        return (
            <TouchableOpacity
                className='my-2'
                onPress={() => navigation.navigate('Chat', { uid: item.uid, messages: item.messages })}>
                <View className='p-4 border border-gray-200 rounded-lg flex-row justify-between'>
                    <View className='my-auto'>
                        <Text className={`font-bold text-lg`}>Channel {index}</Text>
                    </View>
                    {item.users && item.users.length < 2 && <View>
                        <ActivityIndicator size="small" color="#0000ff" className='my-auto' />
                    </View>
                    }
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className={`flex-1 bg-white p-4`}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.uid!}
                onRefresh={onRefresh}
                refreshing={false}
            />
        </View>
    );
}


export default Home