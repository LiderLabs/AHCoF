import { View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { TransactionSuccessScreen } from "@/src/components/ui/TransactionSuccessScreen";

export function DepositSuccessScreen() {
  const router = useRouter();
  const { amount, referenceId } = useLocalSearchParams<{ amount: string; referenceId: string }>();
  const now = new Date();

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <TransactionSuccessScreen
        title="Deposit Successful"
        description={`GHS ${amount} has been added to your Regular Savings account.`}
        statusLabel="COMPLETED"
        detailRows={[
          { label: "Reference ID", value: referenceId },
          {
            label: "Date",
            value: now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          },
          {
            label: "Time",
            value: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          },
        ]}
        footerNote="Funds may take 5-10 minutes to reflect in balance."
        onBackToDashboard={() => router.replace("/dashboard")}
        onDownloadReceipt={() => {}}
      />
    </View>
  );
}