import { useState } from "react";
import { View } from "react-native";
import { InputText } from "@/src/components/ui/InputText";
import { Button } from "@/src/components/ui/Button";

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="w-full">
      <InputText label="Email" value={email} onChangeText={setEmail} />
      <InputText label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button label="Log In" onPress={() => {/*later add login logic */}} />
    </View>
  );
}