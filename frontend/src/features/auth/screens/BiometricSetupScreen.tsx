import { useState } from "react";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { Button } from "@/src/components/ui/Button";
import { FormLayout } from "@/src/components/ui/FormLayout";
import { AlertBanner } from "@/src/components/ui/AlertBanner";
import { useAuth } from "../context/AuthContext";

export function BiometricSetupScreen() {
  const [error, setError] = useState<string | null>(null);
  const [isEnabling, setIsEnabling] = useState(false);
  const router = useRouter();
  const { accessToken } = useAuth();

  const handleEnable = async () => {
    setError(null);
    setIsEnabling(true);

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setError("Biometric authentication isn't set up on this device.");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirm to enable biometric login",
      });

      if (!result.success) {
        setError("Could not verify biometrics. Try again.");
        return;
      }

      if (refreshToken) {
        await SecureStore.setItemAsync("refreshToken", refreshToken);
        await SecureStore.setItemAsync("biometricEnabled", "true");
      }

      router.replace("/portfolio");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsEnabling(false);
    }
  };

  const handleSkip = () => {
    router.replace("/portfolio");
  };

  return (
    <FormLayout title="Enable Biometric Login">
      <AlertBanner message={error} />
      <Button
        label={isEnabling ? "Enabling..." : "Enable Face ID / Fingerprint"}
        onPress={handleEnable}
        disabled={isEnabling}
      />
      <Button label="Skip for now" onPress={handleSkip} disabled={isEnabling} />
    </FormLayout>
  );
}