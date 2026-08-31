import { useState } from "react";
import { useRouter } from "expo-router";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { FormLayout } from "@/src/components/ui/FormLayout";
import { LoginFormValues, loginFormSchema } from "../validation";
import { AlertBanner } from "@/src/components/ui/AlertBanner";
import { login } from "../api/auth";

export function LoginForm() {
  const [values, setValues] = useState({identifier: "", password: ""});
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  function updateField(field: keyof typeof values, value: string) {
    setValues((prev) => ({...prev, [field]: value}));
  }

  const handleLogin = async () => {
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
     
     try {
      setIsSubmitting(true);
      const response = await login(result.data);
      router.replace("/portfolio");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Login failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
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
      <Button 
      label={isSubmitting ? "Logging in..." : "Log In"} 
      onPress={handleLogin}
      disabled={isSubmitting} 
      />
    </FormLayout>
  );
}