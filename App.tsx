import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';

import Login from './src/screens/Login';
import { FIREBASE_AUTH } from './config';
import Chat from './src/screens/Chat';

import { Button } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log(user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{
              headerRight: () => (
                <Button
                  onPress={() => FIREBASE_AUTH.signOut()}
                  title="Logout"
                  color="#000"
                />
              )
            }}
          />
        ) : (
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
