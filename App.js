import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from './components/Footer';
import Login from './page/Login';
import "./global.css"

export default function App() {
  return (
    <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
    <View style={styles.container}>
      <Login/>
      <Text>
        test
      </Text>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
