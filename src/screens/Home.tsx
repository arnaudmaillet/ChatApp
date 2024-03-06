import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { IChat } from '../types/IChat'
import { useData } from '../contexts/Data'
import { THomeNavigationProp } from '../types/INavigation'
import { useSession } from '../contexts/Session'

interface IHomeProps {
    navigation: THomeNavigationProp
}

const Home: React.FC<IHomeProps> = ({ navigation }) => {

    const { localData, getData, updateData } = useData()
    const { session } = useSession()

    useEffect(() => {
        getData()
    }, [])

    const searchingItem = () => {
        return (
            <TouchableOpacity
                className='my-2'
                disabled>
                <View className='p-4 border border-gray-200 rounded-lg flex-row justify-between'>
                    <View className='my-auto'>
                        <Text className={`font-bold text-lg`}>Searching ...</Text>
                    </View>
                    <View>
                        <ActivityIndicator size="small" color="#0000ff" className='my-auto' />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    const renderItem = ({ item }: { item: IChat }) => {
        return (
            <TouchableOpacity
                className='my-2'
                onPress={() => navigation.navigate('Chat', item)}>
                <View className='p-4 border border-gray-200 rounded-lg flex-row justify-between'>
                    <View className='my-auto'>
                        <Text className={`font-bold text-lg`}>Channel</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className={`flex-1 bg-white p-4`}>
            {session?.isSearching && searchingItem()}
            <FlatList
                data={localData}
                renderItem={renderItem}
                keyExtractor={item => item.uid!}
                onRefresh={() => session?.isSearching && updateData({ uid: session!.uid, email: session!.email, isSearching: true })}
                refreshing={false}
            />
        </View>
    );
}


export default Home