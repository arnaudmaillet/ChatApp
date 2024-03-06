import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { IChat } from '../types/IChat'
import { useData } from '../contexts/Data'
import { THomeNavigationProp } from '../types/INavigation'

interface IHomeProps {
    navigation: THomeNavigationProp
}

const Home: React.FC<IHomeProps> = ({ navigation }) => {

    const { data, getData, addData } = useData()

    useEffect(() => {
        getData()
    }, [])

    const renderItem = ({ item }: { item: IChat }) => {
        return (
            <TouchableOpacity
                className='my-2'
                disabled={item.users?.length < 2}
                onPress={() => navigation.navigate('Chat', item)}>
                <View className='p-4 border border-gray-200 rounded-lg flex-row justify-between'>
                    <View className='my-auto'>
                        <Text className={`font-bold text-lg`}>Channel</Text>
                    </View>
                    {item.users?.length < 2 && <View>
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
                onRefresh={() => addData()}
                refreshing={false}
            />
        </View>
    );
}


export default Home