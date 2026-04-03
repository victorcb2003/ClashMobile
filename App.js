import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthProvider';
import ScreenProvider from './context/ScreenProvider';
import { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';

export default function App() {

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#111d');
    NavigationBar.setButtonStyleAsync('light');
    NavigationBar.setBehaviorAsync('inset-swipe'); // 🔥 important
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#111d" />

      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#111d" }} // 🔥 PAS transparent
        edges={['bottom', 'top']}
      >
        <AuthProvider>
          <ScreenProvider />
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}