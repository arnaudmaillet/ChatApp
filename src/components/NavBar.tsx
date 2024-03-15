import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { _COLORS } from '../misc/colors';

const NavBar = () => {
    return (
        <View style={styles.container}>
            <View style={styles.navBar}>
                <View style={styles.item}>
                    <Octicons name="globe" size={28} color='#FF6600' />
                    <Text style={styles.navBarText}>Explore</Text>
                </View>
                <View style={styles.item}>
                    <Octicons name="diff-added" size={28} color='#FF6600' />
                    <Text style={styles.navBarText}>New chat</Text>
                </View>
                <View style={styles.item}>
                    <Octicons name="person" size={28} color='#FF6600' />
                    <Text style={styles.navBarText}>Profile</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        borderTopWidth: 1,
        borderTopColor: _COLORS._BORDER,
    },
    navBar: {
        marginTop: 10,
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    item: {
        alignItems: 'center',
    },
    navBarText: {
        color: _COLORS._PRIMARY
    },
});

export default NavBar;
