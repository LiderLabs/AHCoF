import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Info, Lock } from "lucide-react-native";

import { TransactionHeader } from "@/src/components/ui/TransactionHeader";
import { StepIndicator } from "@/src/components/ui/StepIndicator";
import { Card } from "@/src/components/ui/Card";
import { SummaryCard } from "@/src/components/ui/SummaryCard";
import { TipBanner } from "@/src/components/ui/TipBanner";
import { Button } from "@/src/components/ui/Button";
import { PROVIDERS, ProviderId } from "@/src/constants/mobileMoneyProviders";
import { colors } from "@/src/constants/colors";

export function DepositConfirmScreen() {
  const router = useRouter();
  const { amount, providerId } = useLocalSearchParams<{ amount: string; providerId: ProviderId }>();
  const provider = PROVIDERS[providerId ?? "mtn"];
  const total = Number(amount).toFixed(2);

  return (
    <View className="flex-1 bg-white px-4">
      <TransactionHeader title="Confirm Deposit" />
      <StepIndicator currentStep={2} totalSteps={3} />

      <ScrollView contentContainerStyle={{ gap: 20, paddingBottom: 24 }}>
        <View className="items-center" style={{ gap: 4 }}>
          <Text className="text-xs" style={{ color: "#9CA3AF" }}>
            Deposit Amount
          </Text>
          <Text className="text-3xl font-bold" style={{ color: colors.primary }}>
            GHS {total}
          </Text>
        </View>

        <Card>
          <View className="flex-row items-center" style={{ gap: 12 }}>
            <Image source={provider.logo} style={{ width: 44, height: 44, borderRadius: 10 }} />
            <View className="flex-row flex-1 justify-between">
              <View>
                <Text className="text-xs" style={{ color: "#9CA3AF" }}>
                  Provider
                </Text>
                <Text className="text-base font-bold" style={{ color: colors.textPrimary }}>
                  {provider.name}
                </Text>
              </View>
              <View>
                <Text className="text-xs" style={{ color: "#9CA3AF" }}>
                  Phone Number
                </Text>
                <Text className="text-base font-bold" style={{ color: colors.textPrimary }}>
                  024 555 0192
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <SummaryCard
          rows={[
            { label: "Subtotal", value: `GHS ${total}` },
            { label: "Transaction Fee", value: "GHS 0.00" },
            { label: "Total Charge", value: `GHS ${total}`, emphasis: true },
          ]}
        />

        <TipBanner
          icon={<Info size={16} color="#fff" />}
          message="You will receive a prompt on your phone to authorize this transaction. Please keep your app open until the confirmation is received."
          backgroundColor="#D1FAE5"
          iconBackgroundColor={colors.primary}
        />
      </ScrollView>

      <View className="pb-4">
        <Button
          label="Confirm & Pay"
          variant="primary"
          icon={<Lock size={16} color="#fff" style={{ marginRight: 8 }} />}
          onPress={() =>
            router.push({
              pathname: "/mobile-money/deposit/success",
              params: {
                amount: total,
                referenceId: `#AH-${Math.floor(100000 + Math.random() * 900000)}`,
              },
            })
          }
        />
        <Pressable onPress={() => router.back()} className="items-center py-2">
          <Text className="font-medium" style={{ color: "#6B7280" }}>
            Cancel
          </Text>
        </Pressable>
      </View>
    </View>
  );
}