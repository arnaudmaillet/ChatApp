import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import { IChat } from '../../types/IChat'
import { useData } from '../../contexts/Data'
import { TChatsNavigationProp } from '../../types/INavigation'
import { useSession } from '../../contexts/Session'
import { _COLORS } from '../../misc/colors'

export interface IChatsProps {
    navigation: TChatsNavigationProp
}

const Chats: React.FC<IChatsProps> = ({ navigation }) => {

    const { localData, getData } = useData()
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
                style={styles.itemContainer}
                onPress={() => navigation.navigate('Chat', item)}>
                <View style={{ flex: 1, gap: 5 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#333333' }}>
                        Conversation
                    </Text>
                    <Text style={{ color: 'dimgray' }}>
                        1d 2h ago
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const headerList = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.subtitle}>Rating score</Text>
                    <View style={styles.scoreContainer}>
                        <Text style={styles.score}>4.7</Text>
                    </View>
                </View>
                <View style={styles.headerRow}>
                    <Text style={styles.subtitleBis}>Chats</Text>
                </View>
                {session?.isSearching && searchingItem()}
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                style={styles.listContainer}
                ListHeaderComponent={headerList}
                data={localData}
                renderItem={renderItem}
                keyExtractor={item => item.uid!}
                refreshing={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: _COLORS._BACKGROUND._WHITE,
        flex: 1,
    },
    listContainer: {
        padding: 10,
    },
    headerContainer: {
        marginBottom: 5,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '500',
        flex: 1,
        color: _COLORS._TEXT._SECONDARY
    },
    subtitleBis: {
        fontSize: 28,
        fontWeight: 'bold',
        flex: 1,
        color: _COLORS._TEXT._BLACK
    },
    scoreContainer: {
        backgroundColor: _COLORS._PRIMARY,
        width: 35,
        height: 35,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    score: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    },
    itemContainer: {
        backgroundColor: _COLORS._SECONDARY,
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
});


export default Chats