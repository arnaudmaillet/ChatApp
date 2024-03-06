import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Button } from 'react-native';
import { useSession } from '../../contexts/Session';
import Chat from '../../screens/Chat';
import Login from '../../screens/Login';
import Home from '../../screens/Home';
import { TRouteStackParamList } from '../../types/INavigation';

const Stack = createNativeStackNavigator<TRouteStackParamList>();

const Router: React.FC = () => {
    const { session, signOut } = useSession();
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {session?.uid ? (
                    <>
                        <Stack.Screen
                            name="Home"
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

export default Router;