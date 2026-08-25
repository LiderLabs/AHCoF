import { ScrollView, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { PiggyBank, Home, Bell } from "lucide-react-native";

import { Header } from "@/src/components/ui/Header";
import { NotificationBadgeIcon } from "@/src/components/ui/NotificationBadgeIcon";
import { AccountCard } from "../components/AccountCard";
import { GoalProgressCard } from "../components/GoalProgressCard";
import { BoostAccountCard } from "../components/BoostAccountCard";
import { ChallengeCard } from "../components/ChallengeCard";
import { Button } from "@/src/components/ui/Button";
import { colors } from "@/src/constants/colors";
import { BackButton } from "@/src/components/ui/BackButton";

export default function SavingsScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 40, paddingTop: 26,  }} className="bg-white flex-1">
         {/* Back button */}
              <View className="pt-0 pb-1 -mb-5">
                <BackButton />
              </View>
      <Header
        name="Elder Mensah"
        status="Achiever"
        avatar={require("@/assets/logo_icon.png")}
        actions={<NotificationBadgeIcon icon={<Bell size={24} color={colors.primary} />} count={1} />}
      />

      <View>
        <Text className="text-2xl font-bold" style={{ color: colors.primary }}>Savings Module</Text>
        <Text className="text-sm" style={{ color: "#6B7280" }}>Manage and track your wealth growth journey.</Text>
      </View>

      <AccountCard
        icon={<PiggyBank size={20} color="white" />}
        title="Regular Savings"
        tag="Primary Account"
        balance="GHS 12,450.00"
        monthlyContribution="GHS 1,200.00"
        interestEarned="GHS 425.10"
        refreshedLabel="Refreshed 2m ago"
      />

      <GoalProgressCard
        icon={<Home size={18} color="white" />}
        title="Purpose Driven: Housing"
        percentLabel="75% Achieved"
        currentValue="GHS 150,000"
        goalValue="GHS 200,000"
        progress={0.75}
        maturityDate="Oct 24, 2025"
        autoTransferStatus="Active"
      />

      <BoostAccountCard
        title="Kidi Account: Samuel"
        nextTransferLabel="Next transfer: Oct 01, 2023"
        balance="GHS 5,230.50"
        fundLabel="Education Fund"
        fundTier="Tier 1"
        onBoostPress={() => router.push("/savings/kidi/boost")}
      />

      <View className="flex-row gap-3">
        <Button label="Add Contribution" onPress={() => router.push("/savings/contribute")} className="flex-1" fullWidth={false} />
        <Button label="View History" variant="secondary" onPress={() => router.push("/savings/history")} className="flex-1" fullWidth={false} />
      </View>

      <View>
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold">Investment Challenges</Text>
          <Text className="text-sm font-semibold" style={{ color: colors.primary }} onPress={() => router.push("/savings/challenges")}>
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
  );
}