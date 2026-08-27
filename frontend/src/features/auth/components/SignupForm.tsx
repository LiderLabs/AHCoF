import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { FormLayout } from "@/src/components/ui/FormLayout";
import { SignupFormValues, signupFormSchema } from "../validation";

export function SignupForm() {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormValues, string>>
  >({});
  const router = useRouter();

  function updateField(field: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  const handleSignup = () => {
    const result = signupFormSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignupFormValues, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SignupFormValues;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    const { confirmPassword, ...signupPayload } = result.data;
    router.replace("/portfolio");
  };

  return (
    <FormLayout title="Create Account">
      <Input
        label="First Name"
        value={values.firstName}
        onChangeText={(text) => updateField("firstName", text)}
        error={errors.firstName}
      />
      <Input
        label="Last Name"
        value={values.lastName}
        onChangeText={(text) => updateField("lastName", text)}
        error={errors.lastName}
      />
      <Input
        label="Email (optional)"
        type="email"
        value={values.email}
        onChangeText={(text) => updateField("email", text)}
        error={errors.email}
      />
      <Input
        label="Phone Number"
        type="number"
        value={values.phoneNumber}
        onChangeText={(text) => updateField("phoneNumber", text)}
        error={errors.phoneNumber}
      />

      <Input
        label="Password"
        type="password"
        value={values.password}
        onChangeText={(text) => updateField("password", text)}
         error={errors.password}
      />
      <Input
        label="Confirm Password"
        type="password"
        value={values.confirmPassword}
        onChangeText={(text) => updateField("confirmPassword", text)}
         error={errors.confirmPassword}
      />

      <View className="mt-2">
        <Button label="Sign Up" onPress={handleSignup} />
      </View>
    </FormLayout>
  );
}
