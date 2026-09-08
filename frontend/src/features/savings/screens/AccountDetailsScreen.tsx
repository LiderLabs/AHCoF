import { useEffect, useState } from "react";
import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { PiggyBank } from "lucide-react-native";

import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { BackButton } from "@/src/components/ui/BackButton";
import { colors } from "@/src/constants/colors";
import { getAccountById } from "@/src/features/savings/api/savingsApi";
import type { RegularSavingsAccount } from "@/src/features/savings/types";

interface AccountDetailsScreenProps {
  accountId: string;
}

export function AccountDetailsScreen({ accountId }: AccountDetailsScreenProps) {
  const router = useRouter();
  const [account, setAccount] = useState<RegularSavingsAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAccountById(accountId).then((res) => {
      if (res.status === "success") setAccount(res.data);
      setLoading(false);
    });
  }, [accountId]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!account) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-center" style={{ color: "#6B7280" }}>
          We couldn't find this account.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 20, paddingTop: 26 }} className="bg-white flex-1">
      <View className="pt-0 pb-1 -mb-5">
        <BackButton />
      </View>

      <View className="flex-row items-center gap-3">
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <PiggyBank size={22} color="white" />
        </View>
        <View>
          <Text className="text-xl font-bold" style={{ color: colors.primary }}>Regular Savings</Text>
          {account.accountDetails.isPrimary && (
            <Text className="text-xs" style={{ color: "#6B7280" }}>Primary Account</Text>
          )}
        </View>
      </View>

      <Card backgroundColor="#FFFFFF">
        <Text className="text-xs uppercase" style={{ color: "#6B7280" }}>Current Balance</Text>
        <Text className="text-3xl font-bold mt-1" style={{ color: colors.primary }}>
          GHS {(account.currentBalance / 100).toFixed(2)}
        </Text>

        <View className="flex-row justify-between mt-5">
          <View>
            <Text className="text-xs" style={{ color: "#6B7280" }}>This month</Text>
            <Text className="text-base font-semibold">
              GHS {(account.accountDetails.amountContributedThatMonth / 100).toFixed(2)}
            </Text>
          </View>
          <View>
            <Text className="text-xs" style={{ color: "#6B7280" }}>Interest earned</Text>
            <Text className="text-base font-semibold" style={{ color: colors.primary }}>
              GHS {(account.interestEarned / 100).toFixed(2)}
            </Text>
          </View>
        </View>
      </Card>

      <View className="flex-row gap-3">
        <Button
          label="Add Contribution"
          onPress={() => router.push(`/savings/account/${account.accountId}/contribute`)}
          fullWidth={false}
          className="flex-1"
        />
        <Button
          label="View History"
          variant="secondary"
          onPress={() => router.push(`/savings/account/${account.accountId}/history`)}
          fullWidth={false}
          className="flex-1"
        />
      </View>
    </ScrollView>
  );
}