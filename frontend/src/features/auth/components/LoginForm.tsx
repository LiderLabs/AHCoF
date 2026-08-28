import { useState } from "react";
import { useRouter } from "expo-router";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { FormLayout } from "@/src/components/ui/FormLayout";
import { LoginFormValues, loginFormSchema } from "../validation";
import { AlertBanner } from "@/src/components/ui/AlertBanner";

export function LoginForm() {
  const [values, setValues] = useState({identifier: "", password: ""});
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  function updateField(field: keyof typeof values, value: string) {
    setValues((prev) => ({...prev, [field]: value}));
  }

  const handleLogin = () => {
    setFormError(null);
    const result = loginFormSchema.safeParse(values);

    if(!result.success) {
        const fieldErrors: Partial<Record<keyof LoginFormValues, string>> = {};
        result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginFormValues;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

     setErrors({});
    //i will call login func here later
    router.replace("/portfolio");
  };

  return (
    <FormLayout title="AHCoF Login">
      <AlertBanner message={formError}/>
      <Input 
      label="Email or Phone Number" 
      type="text" 
      value={values.identifier} 
      onChangeText={(text) => updateField("identifier", text)}
      error={errors.identifier}
       />
      <Input 
      label="Password" 
      type="password" 
      value={values.password} 
      onChangeText={(text) => updateField("password", text)}
      error={errors.password}
       />
      <Button label="Log In" onPress={handleLogin} />
    </FormLayout>
  );
}