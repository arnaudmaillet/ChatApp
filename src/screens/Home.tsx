import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { DocumentData, DocumentReference, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { FIREBASE_DB } from '../../config'
import { useSession } from '../contexts/Session/Session'
import { useNavigation } from '@react-navigation/native'

interface INavigation {
    navigate: (name: string, params: any) => void
}

const Home = () => {

    const { session } = useSession();
    const navigation = useNavigation<INavigation>()

    const [data, setData] = React.useState<any[]>([])

    const getData = async () => {
        if (!session) {
            return
        } else {
            const userRef = doc(FIREBASE_DB, 'users', session!.id) as DocumentReference<DocumentData, DocumentData>
            const userSnapshot = await getDoc(userRef)
            const response = query(collection(FIREBASE_DB, 'chats'), where('users', 'array-contains', userSnapshot.ref));
            const result = await getDocs(response)
            setData(result.docs)
        }
    }


    useEffect(() => {
        getData()
    }, [])

    // useEffect(() => {
    //     setData([
    //         { id: 1, name: 'Channel 1' },
    //         { id: 2, name: 'Channel 2' },
    //         { id: 3, name: 'Channel 3' },
    //         { id: 4, name: 'Channel 4' },
    //         { id: 5, name: 'Channel 5' }
    //     ])
    // }, [])

    const renderItem = ({ item, index }: { item: any; index: number }) => (
        <TouchableOpacity
            className='my-2'
            onPress={() => navigation.navigate('Chat', { item })}>
            <View className='p-4 border border-gray-200 rounded-lg'>
                <Text className={`font-bold text-lg`}>Channel {index}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className={`flex-1 bg-white p-4`}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}


export default Home