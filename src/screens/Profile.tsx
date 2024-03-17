import { View, Text, SafeAreaView, StyleSheet, Image } from 'react-native'
import React from 'react'
import { _COLORS } from '../misc/colors';
import { useSession } from '../contexts/Session';

const Profile = () => {
    const { session } = useSession();
    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../../assets/porsche-911-singer-dls-3.jpg')} style={styles.image} />
            <Text style={styles.email}>{session?.email}</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: _COLORS._BACKGROUND._WHITE,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    email: {
        fontSize: 20,
        fontWeight: 'bold',
        color: _COLORS._TEXT._BLACK,
        padding: 20,
    }
});

export default Profile