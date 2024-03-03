import React from 'react';
import { SessionProvider } from './src/contexts/Session/Session';
import Router from './src/components/Router/Router';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function App() {
  return (
    <SessionProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Router />
      </SafeAreaView>
    </SessionProvider>
  );
}
