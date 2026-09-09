import { useState } from "react";
import { ScrollView, View, Text, TextInput, Switch } from "react-native";
import { useRouter } from "expo-router";
import { Baby } from "lucide-react-native";

import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { BackButton } from "@/src/components/ui/BackButton";
import { AmountInput } from "@/src/components/ui/AmountInput";
import { DateField } from "@/src/components/ui/DateField";
import { colors } from "@/src/constants/colors";
import { createKidiAccount } from "@/src/features/savings/api/savingsApi";
import type { CreateKidiAccountPayload } from "@/src/features/savings/types";

export function CreateKidiAccountScreen() {
  const router = useRouter();
  const [childName, setChildName] = useState("");
  const [nextTransferDate, setNextTransferDate] = useState<Date | null>(null);
  const [nextTransferAmount, setNextTransferAmount] = useState("");
  const [maturityDate, setMaturityDate] = useState<Date | null>(null);
  const [autoTransfer, setAutoTransfer] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const nextTransferAmountValue = parseFloat(nextTransferAmount) || 0;
  const isValid = childName.trim().length > 0 && nextTransferDate && maturityDate && nextTransferAmountValue > 0;

  const handleSubmit = async () => {
    if (!isValid || !nextTransferDate || !maturityDate) return;
    setSubmitting(true);
    try {
      const payload: CreateKidiAccountPayload = {
        childName: childName.trim(),
        nextTransferDate: nextTransferDate.toISOString(),
        nextTransferAmount:Math.round(parseFloat(nextTransferAmount) * 100),
        maturityDate: maturityDate.toISOString(),
        autoTransfer,
      };
      const res = await createKidiAccount(payload);
      if (res.status === "success") {
        router.replace("/savings/savingspage");
      } else {
        console.error("Account creation failed:", res);
      }
    } catch (err) {
      console.error("Failed to create Kidi account:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 20, paddingTop: 26 }} className="bg-white flex-1">
      <View className="pt-4 pb-1 -mb-5 flex-row items-center">
        <BackButton />
        <Text className="m-auto text-2xl font-bold" style={{ color: colors.primary }}>Kidi Account</Text>
      </View>

      <View className="ml-5 pt-2">
        <Text className="text-xl font-semibold" style={{ color: colors.textPrimary }}>Open a Kidi account</Text>
        <Text className="text-md mt-1" style={{ color: "#6B7280" }}>
          Save toward a child's future, with scheduled transfers.
        </Text>
      </View>

      <Card backgroundColor={colors.backgroundForm}>
        <Text className="text-sm font-semibold mb-2 ml-2" style={{ color: colors.primary }}>Child's name</Text>
        <TextInput
          value={childName}
          onChangeText={setChildName}
          placeholder="e.g. Samuel"
          placeholderTextColor="#9CA3AF"
          className="rounded-xl px-4 py-3.5 text-base mb-4"
          style={{ borderWidth: 1, borderColor: colors.primary, color: colors.textPrimary, backgroundColor: colors.background }}
        />

        <AmountInput
          label="Transfer amount"
          value={nextTransferAmount}
          onChangeValue={setNextTransferAmount}
        />

        <DateField label="Next transfer date" value={nextTransferDate} onChange={setNextTransferDate} minimumDate={new Date()} />
        <DateField label="Maturity date" value={maturityDate} onChange={setMaturityDate} minimumDate={new Date()} />

        <View className="flex-row items-center justify-between pt-2">
          <View className="flex-1 pr-4">
            <Text className="text-base font-semibold" style={{ color: colors.primary }}>Enable auto-transfer</Text>
            <Text className="text-sm mt-0.5 opacity-60" style={{ color: colors.textPrimary }}>
              Automatically move funds on the scheduled date.
            </Text>
          </View>
          <Switch value={autoTransfer} onValueChange={setAutoTransfer} trackColor={{ false: "#D1D5DB", true: colors.primary }} thumbColor="#FFFFFF" />
        </View>
      </Card>

      <Button label={submitting ? "Creating account…" : "Create Kidi account"} onPress={handleSubmit} disabled={submitting || !isValid} />
    </ScrollView>
  );
}