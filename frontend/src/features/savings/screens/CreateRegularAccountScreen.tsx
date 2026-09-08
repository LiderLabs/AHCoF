import { useState } from "react";
import { ScrollView, View, Text, Switch } from "react-native";
import { useRouter } from "expo-router";
import { PiggyBank } from "lucide-react-native";

import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { BackButton } from "@/src/components/ui/BackButton";
import { colors } from "@/src/constants/colors";
import { createRegularAccount } from "@/src/features/savings/api/savingsApi";
import type { CreateRegularAccountPayload } from "@/src/features/savings/types";

function ToggleRow({
  label,
  description,
  value,
  onValueChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between py-4">
      <View className="flex-1 pr-4">
        <Text className="text-base font-semibold" style={{ color: colors.buttonTextPrimary }}>
          {label}
        </Text>
        <Text className="text-sm mt-0.5 opacity-60" style={{ color: colors.buttonTextPrimary }}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#D1D5DB", true: colors.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

export function CreateRegularAccountScreen() {
  const router = useRouter();
  const [isPrimary, setIsPrimary] = useState(false);
  const [autoTransfer, setAutoTransfer] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload: CreateRegularAccountPayload = { isPrimary, autoTransfer };
      await createRegularAccount(payload);
      router.replace("/savings");
    } catch (err) {
      // add a real error state once the API is wired up
      console.error("Failed to create account:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 20, paddingTop: 26 }} className="bg-white flex-1">
      <View className="pt-0 pb-1 -mb-5">
        <BackButton />
      </View>

      <View>
        <View
          className="w-12 h-12 rounded-full items-center justify-center mb-3"
          style={{ backgroundColor: colors.buttonTransparent }}
        >
          <PiggyBank size={22} color={colors.primary} strokeWidth={1.75} />
        </View>
        <Text className="text-2xl font-bold" style={{ color: colors.primary }}>
          Open a regular savings account
        </Text>
        <Text className="text-md mt-1" style={{ color: "#6B7280" }}>
          Your everyday account for flexible saving - no goal or deadline attached.
        </Text>
      </View>

      <Card backgroundColor="#FFFFFF">
        <ToggleRow
          label="Set as primary account"
          description="Your primary account is shown first and used by default."
          value={isPrimary}
          onValueChange={setIsPrimary}
        />
        <View style={{ height: 1, backgroundColor: "#F0EDE4" }} />
        <ToggleRow
          label="Enable auto-transfer"
          description="Automatically move a set amount into this account each month."
          value={autoTransfer}
          onValueChange={setAutoTransfer}
        />
      </Card>

      <Button
        label={submitting ? "Creating account…" : "Create savings account"}
        onPress={handleSubmit}
        disabled={submitting}
      />
    </ScrollView>
  );
}