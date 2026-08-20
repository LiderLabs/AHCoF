import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';

export default function LoginScreen() {
  const [membershipId, setMembershipId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-2xl font-bold mb-8" style={{ color: '#1B5E20' }}>
        AHCoF Login
      </Text>

      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Membership ID"
        value={membershipId}
        onChangeText={setMembershipId}
        autoCapitalize="none"
      />

      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        className="w-full rounded-lg py-3 items-center"
        style={{ backgroundColor: '#1B5E20' }}
        onPress={() => console.log('Login pressed:', membershipId, password)}
      >
        <Text className="text-white font-semibold">Log In</Text>
      </Pressable>
    </View>
  );
}