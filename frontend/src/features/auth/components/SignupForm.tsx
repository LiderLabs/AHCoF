import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { FormLayout } from "@/src/components/ui/FormLayout";
import { SignupFormValues, signupFormSchema } from "../validation";
import { sendOtp, signup } from "../api/auth";
import { saveToken } from "@/src/lib/storage";
import { AlertBanner } from "@/src/components/ui/AlertBanner";
import { useAuth } from "../context/AuthContext";

export function SignupForm() {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormValues, string>>
  >({});
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAuth } = useAuth();

  function updateField(field: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  const handleSignup = async () => {
    setFormError(null);
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
    //console.log("PAYLOAD:", JSON.stringify(signupPayload, null, 2));

    try {
      setIsSubmitting(true);
      const response = await signup(signupPayload);
      setAuth(response.member, response.accessToken, response.refreshToken);
      await saveToken(response.accessToken);

      const otpResponse = await sendOtp({
        phoneNumber: signupPayload.phoneNumber,
        emailAddress: signupPayload.emailAddress,
      });

      router.replace({
        pathname: "/otp",
        params: {
          channels: otpResponse.channelsSent.join(","),
          phoneNumber: signupPayload.phoneNumber,
          emailAddress: signupPayload.emailAddress,
        },
      });

    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Signup failed. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormLayout title="Create Account">
      <AlertBanner message={formError} />
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
        value={values.emailAddress}
        onChangeText={(text) => updateField("emailAddress", text)}
        error={errors.emailAddress}
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
        <Button
          label={isSubmitting ? "Signing up..." : "Sign Up"}
          onPress={handleSignup}
          disabled={isSubmitting}
        />
      </View>
    </FormLayout>
  );
}
