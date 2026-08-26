import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Info, Lock, BadgeCheck } from "lucide-react-native";

import { TransactionHeader } from "@/src/components/ui/TransactionHeader";
import { StepIndicator } from "@/src/components/ui/StepIndicator";
import { Card } from "@/src/components/ui/Card";
import { SummaryCard } from "@/src/components/ui/SummaryCard";
import { TipBanner } from "@/src/components/ui/TipBanner";
import { Button } from "@/src/components/ui/Button";
import { PROVIDERS, ProviderId } from "@/src/constants/mobileMoneyProviders";
import { colors } from "@/src/constants/colors";

export function WithdrawConfirmScreen() {
  const router = useRouter();
  const { amount, providerId, phone } = useLocalSearchParams<{
    amount: string;
    providerId: ProviderId;
    phone: string;
  }>();
  const provider = PROVIDERS[providerId ?? "mtn"];
  const total = Number(amount).toFixed(2);

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <TransactionHeader title="Confirm Withdrawal" />
      <StepIndicator currentStep={2} totalSteps={3} />

      <ScrollView contentContainerStyle={{ gap: 20, paddingBottom: 24 }}>
        <View className="items-center" style={{ gap: 4 }}>
          <Text className="text-xs" style={{ color: "#9CA3AF" }}>
            WITHDRAWAL AMOUNT
          </Text>
          <Text className="text-3xl font-bold" style={{ color: colors.primary }}>
            GHS {total}
          </Text>
        </View>

        <View>
          <Text className="text-sm font-semibold mb-2" style={{ color: "#111827" }}>
            Destination
          </Text>
          <Card>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1" style={{ gap: 12 }}>
                <Image source={provider.logo} style={{ width: 40, height: 40, borderRadius: 10 }} />
                <View>
                  <Text className="text-base font-bold" style={{ color: colors.textPrimary }}>
                    {provider.name}
                  </Text>
                  <Text className="text-sm" style={{ color: "#9CA3AF" }}>
                    +233 {phone}
                  </Text>
                </View>
              </View>
              <BadgeCheck size={20} color="#9CA3AF" />
            </View>
          </Card>
        </View>

        <SummaryCard
          title="Summary"
          rows={[
            { label: "Subtotal", value: `GHS ${total}` },
            { label: "Transaction Fee", value: "GHS 0.00" },
            { label: "Total Amount", value: `GHS ${total}`, emphasis: true },
          ]}
        />

        <TipBanner
          icon={<Info size={16} color="#fff" />}
          message="Funds will be sent to your mobile money wallet instantly. Please ensure your registered number is correct before confirming."
          backgroundColor="#D1FAE5"
          iconBackgroundColor={colors.primary}
        />
      </ScrollView>

      <View className="pb-6">
        <Button
          label="Confirm & Withdraw"
          variant="primary"
          icon={<Lock size={16} color="#fff" style={{ marginRight: 8 }} />}
          onPress={() =>
            router.push({
              pathname: "/withdraw/success",
              params: {
                amount: total,
                providerId,
                referenceId: `#WH-${Math.floor(100000 + Math.random() * 900000)}`,
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