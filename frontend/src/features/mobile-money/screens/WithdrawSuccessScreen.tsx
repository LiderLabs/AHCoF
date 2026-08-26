import { View, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Landmark } from "lucide-react-native";
import { TransactionSuccessScreen } from "@/src/components/ui/TransactionSuccessScreen";
import { PROVIDERS, ProviderId } from "@/src/constants/mobileMoneyProviders";

export function WithdrawSuccessScreen() {
  const router = useRouter();
  const { amount, providerId, referenceId } = useLocalSearchParams<{
    amount: string;
    providerId: ProviderId;
    referenceId: string;
  }>();
  const provider = PROVIDERS[providerId ?? "mtn"];
  const now = new Date();

  return (
    <View className="flex-1 bg-white px-4 pt-20 flex-col justify-center">
      <TransactionSuccessScreen
        title="Withdrawal Successful"
        description={`GHS ${amount} has been sent to your ${provider.name} wallet.`}
        checkmarkBackgroundColor="#6EE7A0"
        checkmarkColor="#064E3B"
        detailRows={[
          { label: "Status", value: "COMPLETED", valueBadge: true },
          { label: "Reference ID", value: referenceId, copyable: true },
          {
            label: "Date",
            value: now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          },
          {
            label: "Time",
            value: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          },
        ]}
        extraCard={
          <View
            className="flex-row items-center justify-between rounded-2xl p-4"
            style={{ backgroundColor: "#F3F4F6" }}
          >
            <View>
              <Text className="text-xs font-bold" style={{ color: "#166534" }}>
                SECURED BY AHCOF
              </Text>
              <Text className="text-base font-bold" style={{ color: "#111827" }}>
                Trust in Heritage
              </Text>
            </View>
            <Landmark size={28} color="#A7D0AE" />
          </View>
        }
        onBackToDashboard={() => router.replace("/portfolio")}
        onDownloadReceipt={() => {}}
      />
    </View>
  );
}