import { useState } from "react";
import { ScrollView, View, Text , Pressable} from "react-native";
import { useRouter } from "expo-router";
import { PiggyBank, Home, Bell } from "lucide-react-native";

import { Header } from "@/src/components/ui/Header";
import { NotificationBadgeIcon } from "@/src/components/ui/NotificationBadgeIcon";
import { AccountCard } from "../components/AccountCard";
import { GoalProgressCard } from "../components/GoalProgressCard";
import { BoostAccountCard } from "../components/BoostAccountCard";
import { ChallengeCard } from "../components/ChallengeCard";
import { EmptyAccountsState } from "../components/EmptyAccountsState";
import { CreateAccountButton } from "../components/CreateAccountButton";
import { useSavingsAccounts } from "../hooks/useSavingsAccounts";
import { colors } from "@/src/constants/colors";
import { BackButton } from "@/src/components/ui/BackButton";
import { useAuth } from "../../auth/context/AuthContext";

export default function SavingsScreen() {
  const { member } = useAuth();
  const router = useRouter();
  const { accounts, loading } = useSavingsAccounts();
  //for create account button
  const [createButtonOpen, setCreateButtonOpen] = useState(false);

  const hasAccounts = accounts.length > 0;

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 100, paddingTop: 26 }} className="bg-white flex-1">
        <View className="pt-0 pb-1 -mb-5">
          <BackButton />
        </View>

        <Header
          name={member.firstName}
          status="Achiever"
          avatar={require("@/assets/logo_icon.png")}
          actions={<NotificationBadgeIcon icon={<Bell size={24} color={colors.primary} />} count={1} />}
        />

        <View>
          <Text className="text-2xl font-bold" style={{ color: colors.primary }}>Savings Module</Text>
          <Text className="text-lg" style={{ color: "#6B7280" }}>Manage and track your wealth growth journey.</Text>
        </View>

       {!loading && !hasAccounts && (
  <EmptyAccountsState onCreatePress={() => setCreateButtonOpen(true)} backgroundColor="#eeececff"/>
)}

{hasAccounts && accounts.map((account) => (
  <Pressable
    key={account.accountId}
    onPress={() => router.push(`/savings/account/${account.accountId}`)}
  >
    <AccountCard
      icon={<PiggyBank size={25} color="white" />}
      title="Regular Savings"
      tag={account.accountDetails.isPrimary ? "Primary Account" : undefined}
      balance={`GHS ${(account.currentBalance / 100).toFixed(2)}`}
      monthlyContribution={`GHS ${(account.accountDetails.amountContributedThatMonth / 100).toFixed(2)}`}
      interestEarned={`GHS ${(account.interestEarned / 100).toFixed(2)}`}
      refreshedLabel="Just now"
    />
  </Pressable>
))}

        <View>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold">Investment Challenges</Text>
            <Text className="text-md font-semibold self-end" style={{ color: colors.primary }} onPress={() => router.push("/savings/challenges")}>
              View all
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              <ChallengeCard
                image={require("@/assets/img_challenge_card1.png")}
                badge="2.5k+"
                title="50K Side Hustle Fund"
                subtitle="Ends 29 Apr, 27 · Tap for more"
                onPress={() => router.push("/savings/challenges/side-hustle")}
              />
              <ChallengeCard
                image={require("@/assets/img_challenge_card2.png")}
                badge="+458"
                title="Next Challenge"
                subtitle="Tap for more"
                onPress={() => router.push("/savings/challenges/second")}
              />
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <CreateAccountButton open={createButtonOpen} onOpenChange={setCreateButtonOpen} />
    </View>
  );
}