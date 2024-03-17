import React from 'react';
import { View } from 'react-native';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { _COLORS } from '../../misc/colors';
import { TRouteStackParamList } from '../../types/INavigation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Cam from '../../screens/Cam';
import Archive from '../../screens/Archive';
import Profile from '../../screens/Profile';
import Chats from '../../screens/Chats/Chats';
import { IChatsProps } from '../../screens/Chats/Chats';

interface TabBarItem {
    icon: JSX.Element;
    label: string;
    screen: React.FC | React.FC<IChatsProps>;
}

const labelToRouteMap: Record<string, keyof TRouteStackParamList> = {
    Cam: 'Cam',
    Chat: 'Chats',
    Archive: 'Archive',
    Profile: 'Profile',
};

const TabBarItems: TabBarItem[] = [
    { icon: <FontAwesome name="video-camera" size={28} color={_COLORS._PRIMARY} />, label: 'Cam', screen: Cam },
    { icon: <FontAwesome name="wechat" size={28} color={_COLORS._PRIMARY} />, label: 'Chat', screen: Chats },
    { icon: <MaterialCommunityIcons name="chat-remove" size={28} color={_COLORS._PRIMARY} />, label: 'Archive', screen: Archive },
    { icon: <FontAwesome5 name="user-alt" size={28} color={_COLORS._PRIMARY} />, label: 'Profile', screen: Profile },
];

const Tab = createBottomTabNavigator<TRouteStackParamList>();

const TabBar: React.FC = () => {
    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                initialRouteName='Chats'
                screenOptions={{
                    tabBarActiveTintColor: _COLORS._PRIMARY,
                    tabBarInactiveTintColor: _COLORS._ICONS._INACTIVE,
                    tabBarLabelStyle: {
                        fontSize: 12,
                    },
                    tabBarItemStyle: {
                        height: 50,
                        marginTop: 5,
                    },
                }}
            >
                {TabBarItems.map((item, index) => (
                    <Tab.Screen
                        key={index}
                        name={labelToRouteMap[item.label]}
                        component={item.screen}
                        options={{
                            headerShown: false,
                            tabBarIcon: ({ color }) => React.cloneElement(item.icon, { color }),
                        }}
                    />
                ))}
            </Tab.Navigator>
        </View>
    );
}

export default TabBar;
