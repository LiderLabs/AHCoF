import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { getRefreshToken } from "@/src/lib/storage";
import { Button } from "@/src/components/ui/Button";
import { FormLayout } from "@/src/components/ui/FormLayout";
import { AlertBanner } from "@/src/components/ui/AlertBanner";
import { refreshAccessToken } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export function BiometricUnlockScreen() {
  const [error, setError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuth();

  const attemptUnlock = async () => {
    setError(null);
    setIsUnlocking(true);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Scan to continue",
      });

      if (!result.success) {
        setError("Authentication failed.");
        return;
      }

      const storedRefreshToken = await getRefreshToken();

      if (!storedRefreshToken) {
        router.replace("/login");
        return;
      }

      const response = await refreshAccessToken(storedRefreshToken);
      setAuth(response.member, response.accessToken, response.refreshToken);
      router.replace("/portfolio");
    } catch (err) {
      setError("Could not unlock. Try your password instead.");
    } finally {
      setIsUnlocking(false);
    }
  };

  useEffect(() => {
    attemptUnlock();
  }, []);

  return (
    <FormLayout title="Welcome back">
      <AlertBanner message={error} />
      <Button
        label={isUnlocking ? "Verifying..." : "Try Again"}
        onPress={attemptUnlock}
        disabled={isUnlocking}
      />
      <Button
        label="Use password instead"
        onPress={() => router.replace("/login")}
        disabled={isUnlocking}
      />
    </FormLayout>
  );
}