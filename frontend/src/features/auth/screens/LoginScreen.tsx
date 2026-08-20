import { View, Text, TextInput, Pressable, ImageBackground } from 'react-native';
import { useState } from 'react';
import { colors } from '@/src/constants/colors';
import { Logo } from '@/src/components/ui/Logo';


export default function LoginScreen() {
  const [membershipId, setMembershipId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="flex-1 gap-4 justify-center items-center bg-white px-6">
      {/* Logo section */}
      <ImageBackground 
      source={require("@/assets/img-security-message.png")} 
      style={{ width: "100%", paddingTop: 10, paddingBottom: 10}}
      imageStyle={{resizeMode: 'cover', borderRadius: 24,}}
      >
        <Logo type="green"/>
      </ImageBackground>
  
      <Text className="text-3xl font-bold my-8 " style={{ color: colors.textPrimary }}>
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