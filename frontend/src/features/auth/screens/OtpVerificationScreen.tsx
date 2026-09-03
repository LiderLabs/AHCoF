import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { FormLayout } from "@/src/components/ui/FormLayout";
import { AlertBanner } from "@/src/components/ui/AlertBanner";
import { otpSchema } from "../validation";
import { verifyOtp } from "../api/auth";
import { OtpChannel } from "../types";

export function OtpVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    channels: string; // comma-separated list of channel such as "phone,email"
    phoneNumber: string;
    emailAddress?: string;
  }>();

  const channels = (params.channels?.split(",") ?? ["phone"]) as OtpChannel[];

  const [codes, setCodes] = useState<Record<OtpChannel, string>>({
    phone: "",
    email: "",
  });
  const [verified, setVerified] = useState<Record<OtpChannel, boolean>>({
    phone: false,
    email: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submittingChannel, setSubmittingChannel] = useState<OtpChannel | null>(null);

  const identifierFor = (channel: OtpChannel) =>
    channel === "phone" ? params.phoneNumber : params.emailAddress ?? "";

  const handleVerify = async (channel: OtpChannel) => {
    setFormError(null);
    const result = otpSchema.safeParse({ code: codes[channel] });

    if (!result.success) {
      setErrors((prev) => ({ ...prev, [channel]: result.error.issues[0].message }));
      return;
    }
    setErrors((prev) => ({ ...prev, [channel]: "" }));

    try {
      setSubmittingChannel(channel);
      const response = await verifyOtp({
        channel,
        identifier: identifierFor(channel),
        code: result.data.code,
      });

      if (response.verified) {
        setVerified((prev) => ({ ...prev, [channel]: true }));
      } else {
        setFormError(response.message || "Invalid code. Try again.");
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Verification failed. Try again.");
    } finally {
      setSubmittingChannel(null);
    }
  };

  const allVerified = channels.every((channel) => verified[channel]);

  useEffect(() => {
    if (allVerified) {
      router.replace("/complete-profile");
    }
  }, [allVerified]);

  return (
    <FormLayout title="Verify Your Account">
      <AlertBanner message={formError} />
      <Text className="text-gray-600 mb-4">
        We sent a verification code to {channels.length > 1 ? "your phone and email" : "your phone"}.
        Enter the code below to continue.
      </Text>

      {channels.map((channel) => (
        <View key={channel} className="mb-4">
          <Text className="font-semibold mb-1 capitalize">{channel} code</Text>
          <Text className="text-sm text-gray-500 mb-2">{identifierFor(channel)}</Text>
          <Input
            value={codes[channel]}
            onChangeText={(text) => setCodes((prev) => ({ ...prev, [channel]: text }))}
            error={errors[channel]}
            keyboardType="numeric"
            maxLength={6}
            editable={!verified[channel]}
          />
          <Button
            label={verified[channel] ? "Verified ✓" : submittingChannel === channel ? "Verifying..." : "Verify"}
            onPress={() => handleVerify(channel)}
            disabled={verified[channel] || submittingChannel === channel}
            variant={verified[channel] ? "secondary" : "primary"}
            fullWidth={false}
            className="mt-2 px-6 py-2"
          />
        </View>
      ))}
    </FormLayout>
  );
}