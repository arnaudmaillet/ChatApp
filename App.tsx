import React from 'react';
import { SessionProvider } from './src/contexts/Session';
import Router from './src/components/Router/Router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider } from './src/contexts/App';
import { DataProvider } from './src/contexts/Data';


export default function App() {
  return (
    <AppProvider>
      <SessionProvider>
        <DataProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <Router />
          </SafeAreaView>
        </DataProvider>
      </SessionProvider>
    </AppProvider>
  );
}
