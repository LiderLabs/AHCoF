import { AuthProvider } from '@/src/features/auth/context/AuthContext';
import '../global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />;
    </AuthProvider>
  )
}