import { useState } from "react";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { FormLayout } from "@/src/components/ui/FormLayout";

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <FormLayout title="AHCoF Login">
      <Input label="Email" type="email" value={email} onChangeText={setEmail} />
      <Input label="Password" type="password" value={password} onChangeText={setPassword} />
      <Button label="Log In" onPress={() => {/*later add login logic */}} />
    </FormLayout>
  );
}