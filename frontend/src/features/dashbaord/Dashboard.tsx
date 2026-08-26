import { ScrollView, View, Text } from "react-native";
import { useRouter } from "expo-router";
import {
  Wallet,
  BarChart3,
  Banknote,
  CalendarClock,
  PlusCircle,
  ClipboardList,
  CreditCard,
  TrendingUp,
  Smartphone,
  HeartHandshake,
  Share2,
  Home,
  Compass,
  Grid3x3,
  User,
  HelpCircle,
  MessageSquare,
  Bell
} from "lucide-react-native";

import { Header } from "@/src/components/ui/Header";
import { PromoBanner } from "./components/PromoBanner";
import { SummaryCard } from "./components/SummaryCard";
import { QuickActionButton } from "./components/QuickActionButton";
import { InfoCard } from "./components/InfoCard";
import { ActivityListItem } from "./components/ActivityListItem";
import { FeatureCard } from "./components/FeatureCard";
import { BottomNavBar } from "@/src/components/ui/BottomNav";
import { NotificationBadgeIcon } from "@/src/components/ui/NotificationBadgeIcon";
import { colors } from "@/src/constants/colors";
import { navItems } from "@/src/constants/navItems";

export function Dashboard() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white pt-6">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 18, gap: 20, paddingBottom: 100 }}
      >
        {/* Header */}
            <Header
        name="Elder Mensah"
        status="Achiever"
        avatar={require("@/assets/icon.png")}
        actions={
          <>
            <HelpCircle size={24} color={colors.primary} />
            <NotificationBadgeIcon icon={<Bell size={24} color={colors.primary} />} count={1} />
            <MessageSquare size={24} color={colors.primary} />
          </>
        }
      />

        {/* Promo banner */}
        <PromoBanner
          tag="New: Platinum Dividends"
          title="Unlock 12% annual growth with our new program."
          buttonLabel="View Details"
          image={require("@/assets/img_promo_shield.png")}
          onPress={() => router.push("/savings/platinum")}
        />

        {/* Portfolio Summary */}
        <View>
          <Text className="text-xl font-bold mb-3">Portfolio Summary</Text>

          <View className="flex-row gap-3 mb-3">
            <SummaryCard
              icon={<Wallet size={20} color="white" />}
              label="Total Savings"
              value="GHS 25,800.00"
              backgroundColor={colors.primary}
              textColor="#FFFFFF"
            />
            <SummaryCard
              icon={<BarChart3 size={20} color="white" />}
              label="Share Value"
              value="GHS 5,400.00"
              backgroundColor="#0F766E"
              textColor="#FFFFFF"
            />
          </View>

          <View className="flex-row gap-3">
            <SummaryCard
              icon={<Banknote size={20} color="#92400E" />}
              label="Active Loan"
              value="GHS 12,000.00"
              backgroundColor="#FDBA74"
              textColor="#78350F"
            />
            <SummaryCard
              icon={<CalendarClock size={20} color="#374151" />}
              label="Next Payment"
              value="GHS 350.00"
              subtext="Due in 4 days"
              backgroundColor="#F3F4F6"
              textColor="#111827"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View>
          <Text className="text-xl font-bold mb-3">Quick Actions</Text>
          <View className="flex-row justify-between">
            <QuickActionButton
              icon={<PlusCircle size={24} color="white" />}
              label="Save Money"
              backgroundColor={colors.primary}
              onPress={() => router.push("/savings/savingspage")}
            />
            <QuickActionButton
              icon={<ClipboardList size={24} color="white" />}
              label="Apply Loan"
              backgroundColor="#B45309"
              onPress={() => router.push("/loans/newloan")}
            />
            <QuickActionButton
              icon={<CreditCard size={24} color="white" />}
              label="Make Repay"
              backgroundColor="#134E4A"
              onPress={() => router.push("/loans/repay")}
            />
            <QuickActionButton
              icon={<TrendingUp size={24} color="#374151" />}
              label="Buy Shares"
              backgroundColor="#E5E7EB"
              onPress={() => router.push("/shares/sharespage")}
            />
          </View>
        </View>

        {/* Mobile Money */}
        <View>
          <Text className="text-xl font-bold mb-3">Mobile Money</Text>
          <View className="flex-row gap-3">
            <InfoCard
              icon={<Smartphone size={18} color={colors.primary} />}
              title="Deposit Funds"
              subtitle="Instant deposit via MoMo"
              onPress={() => router.push("/deposit/")}
            />
            <InfoCard
              icon={<Wallet size={18} color={colors.primary} />}
              title="Withdraw Funds"
              subtitle="Secure withdrawal to wallet"
              onPress={() => router.push("/withdraw")}
            />
          </View>
        </View>

        {/* Recent Activities */}
        <View>
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-xl font-bold px-1 pb-2">Recent Activities</Text>
            <Text
              className="text-sm font-semibold self-end pr-2"
              style={{ color: colors.primary }}
              onPress={() => router.push("/activities")}
            >
              View all
            </Text>
          </View>

          <View className="border rounded-2xl px-4" style={{ borderColor: "#E5E7EB" }}>
            <ActivityListItem
              icon={<Wallet size={18} color={colors.primary} />}
              iconBackground="#F0FDF4"
              title="Monthly Contribution"
              subtitle="Savings Account · Oct 15"
              amount="+ GHS 500.00"
              amountColor="#16A34A"
              status="Success"
            />
            <ActivityListItem
              icon={<Banknote size={18} color="#92400E" />}
              iconBackground="#FEF3C7"
              title="Loan Repayment"
              subtitle="Home Improvement Loan · Oct 12"
              amount="- GHS 350.00"
              amountColor="#DC2626"
              status="Success"
            />
            <ActivityListItem
              icon={<TrendingUp size={18} color="#0F766E" />}
              iconBackground="#F0FDFA"
              title="Dividend Received"
              subtitle="Share Equity · Oct 01"
              amount="+ GHS 1,240.00"
              amountColor="#16A34A"
              status="Credited"
            />
          </View>
        </View>

        {/* Bottom feature cards */}
        <View className="flex-row gap-3">
          <FeatureCard
            icon={<HeartHandshake size={32} color={colors.iconColorLight} />}
            title="Welfare Support"
            subtitle="Emergency community funds available."
            backgroundColor={colors.primary}
          />
          <FeatureCard
            icon={<Share2 size={32} color={colors.iconColorLight} />}
            title="Refer a Member"
            subtitle="Earn Points"
            backgroundColor="#134E4A"
          />
        </View>
      </ScrollView>

      {/* Bottom nav */}
      <BottomNavBar items={navItems} activeKey="portfolio" onNavigate={(route) => router.push(route)} />
    </View>
  );
}