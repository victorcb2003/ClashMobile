import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthProvider';
import ScreenProvider from './context/ScreenProvider';
import { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, View } from 'react-native';

export default function App() {

  useEffect(() => {
    NavigationBar.setButtonStyleAsync('light');
  }, []);

  return (
    <SafeAreaProvider>
      <Image source={require("./assets/Pelouse.png")} style={{ ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" }} />
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)" }} />
      <StatusBar style="light" backgroundColor="#11f0" />

      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#2220" }}
        edges={['bottom', 'top']}
      >
        <AuthProvider>
          <ScreenProvider />
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}