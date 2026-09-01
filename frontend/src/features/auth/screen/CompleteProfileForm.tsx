import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { FormLayout } from "@/src/components/ui/FormLayout";
import { AlertBanner } from "@/src/components/ui/AlertBanner";
import { completeProfileSchema, CompleteProfileFormValues } from "../validation";
import { completeProfile } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export function CompleteProfileForm() {
  const router = useRouter();
  const { accessToken, setAuth } = useAuth();
  const [values, setValues] = useState({
    gender: "" as "male" | "female" | "",
    churchBranch: "",
    conference: "",
    gpsAddress: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CompleteProfileFormValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  const handleSubmit = async () => {
    setFormError(null);
    const result = completeProfileSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CompleteProfileFormValues, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CompleteProfileFormValues;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      setIsSubmitting(true);
      const updatedMember = await completeProfile({
        ...result.data,
        membershipType: "church_member",
      });
      if (accessToken) setAuth(updatedMember, accessToken);
      router.replace("/portfolio");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not save profile. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormLayout title="Complete Your Profile">
      <AlertBanner message={formError} />

      <Text className="mb-1 font-semibold">Gender</Text>
      <View className="flex-row gap-3 mb-4">
        {(["male", "female"] as const).map((g) => (
          <Pressable
            key={g}
            onPress={() => updateField("gender", g)}
            className="flex-1 rounded-xl py-3 items-center border"
            style={{
              borderColor: values.gender === g ? "#059669" : "#D1D5DB",
              backgroundColor: values.gender === g ? "#D1FAE5" : "transparent",
            }}
          >
            <Text className="capitalize font-medium">{g}</Text>
          </Pressable>
        ))}
      </View>
      {errors.gender && <Text className="text-red-500 text-sm mb-4">{errors.gender}</Text>}

      <Input
        label="Church Branch"
        value={values.churchBranch}
        onChangeText={(text) => updateField("churchBranch", text)}
        error={errors.churchBranch}
      />
      <Input
        label="Conference"
        value={values.conference}
        onChangeText={(text) => updateField("conference", text)}
        error={errors.conference}
      />
      <Input
        label="GPS Address"
        value={values.gpsAddress}
        onChangeText={(text) => updateField("gpsAddress", text)}
        error={errors.gpsAddress}
      />

      <Button
        label={isSubmitting ? "Saving..." : "Finish Setup"}
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </FormLayout>
  );
}