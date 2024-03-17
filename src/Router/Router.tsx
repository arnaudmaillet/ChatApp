import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { useSession } from '../contexts/Session';
import Login from '../screens/Login';
import { TRouteStackParamList } from '../types/INavigation';
import TabBar from '../components/TabBar/TabBar';
import Chat from '../screens/Chats/Chat';
import { _COLORS } from '../misc/colors';

const Stack = createNativeStackNavigator<TRouteStackParamList>();

const Router: React.FC = () => {
    const { session } = useSession();
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {session?.uid ? (
                    <>
                        <Stack.Screen name="TabBar" component={TabBar} options={{ headerShown: false }} />
                        <Stack.Screen name="Chat" component={Chat} options={
                            {
                                headerShown: true,
                                title: 'Chat',
                                headerTintColor: _COLORS._PRIMARY,
                                headerTitleStyle: {
                                    color: "black",
                                },
                            }

                        } />
                    </>
                ) : (
                    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Router;