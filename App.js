import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthProvider';
import ScreenProvider from './context/ScreenProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ScreenProvider />
      </AuthProvider>
    </SafeAreaProvider>
  )
}