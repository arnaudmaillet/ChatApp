import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Button } from 'react-native';
import { useSession } from '../../contexts/Session';
import Chat from '../../screens/Chat';
import Login from '../../screens/Login';
import Home from '../../screens/Home';

const Stack = createNativeStackNavigator();

export default function Router() {
    const { session, signOut } = useSession();
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="AppLoading">
                {session?.id ? (
                    <>
                        <Stack.Screen
                            name="我们爱你"
                            component={Home}
                            options={{
                                headerRight: () => (
                                    <Button
                                        onPress={() => signOut()}
                                        title="Logout"
                                        color="#000"
                                    />
                                )
                            }}
                        />

                        <Stack.Screen
                            name="Chat"
                            component={Chat}
                        />
                    </>
                ) : (
                    <>
                        {/* <Stack.Screen name="AppLoading" component={AppLoading} options={{ headerShown: false }} /> */}
                        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
