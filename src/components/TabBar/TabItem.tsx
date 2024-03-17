import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { _COLORS } from '../../misc/colors';

interface TabItemProps {
    icon: JSX.Element;
    label: string;
}

const TabItem: React.FC<TabItemProps> = ({ icon, label }) => {
    return (
        <View style={styles.item}>
            {icon}
            <Text style={styles.text}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        alignItems: 'center',
        height: 50,
        width: 50
    },
    text: {
        marginTop: 3,
        color: _COLORS._PRIMARY
    },
});

export default TabItem;
