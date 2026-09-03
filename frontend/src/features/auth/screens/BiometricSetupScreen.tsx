import { useState } from "react";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { Button } from "@/src/components/ui/Button";
import { FormLayout } from "@/src/components/ui/FormLayout";
import { AlertBanner } from "@/src/components/ui/AlertBanner";
import { useAuth } from "../context/AuthContext";
import { setBiometricEnabled } from "@/src/lib/storage";

export function BiometricSetupScreen() {
  const [error, setError] = useState<string | null>(null);
  const [isEnabling, setIsEnabling] = useState(false);
  const router = useRouter();
  const { refreshToken } = useAuth();

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

      if (!refreshToken) {
         setError("Something went wrong. Please try logging in again.");
         return;
      }

      await setBiometricEnabled(true);
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