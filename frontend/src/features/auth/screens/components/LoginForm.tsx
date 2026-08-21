import { useState } from "react";
import { View } from "react-native";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="w-full">
      <Input label="Email" value={email} onChangeText={setEmail} />
      <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button label="Log In" onPress={() => {/*later add login logic */}} />
    </View>
  );
}