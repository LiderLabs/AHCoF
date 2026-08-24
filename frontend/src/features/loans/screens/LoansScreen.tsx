import { ScrollView, View, Text } from "react-native";
import { useRouter } from "expo-router";
import {
  Landmark, PlusCircle, BarChart3, CalendarClock,
  Home, GraduationCap, Stethoscope, Rocket, PiggyBank,
  HelpCircle, Bell, MessageSquare,
} from "lucide-react-native";

import { Header } from "@/src/components/ui/Header";
import { NotificationBadgeIcon } from "@/src/components/ui/NotificationBadgeIcon";
import { HeroStatCard } from "../components/HeroStatCard";
import { QuickActionButton } from "../../dashbaord/components/QuickActionButton";
import { CategoryCard } from "../components/CategoryCard";
import { TipCard } from "../components/TipCard";
import { colors } from "@/src/constants/colors";

export default function LoansScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 40 }} className="bg-white flex-1 pt-6">
      <Header
        name="Elder Mensah"
        status="Achiever"
        avatar={require("@/assets/logo_icon.png")}
        actions={
          <>
            <HelpCircle size={24} color={colors.primary} />
            <NotificationBadgeIcon icon={<Bell size={24} color={colors.primary} />} count={1} />
            <MessageSquare size={24} color={colors.primary} />
          </>
        }
      />

      <HeroStatCard
        label="Eligible Amount"
        amount="GHS 250,000.00"
        icon={<Landmark size={20} color="white" />}
        backgroundColor={colors.primary}
        stats={[
          { label: "Outstanding", value: "GHS 12,450.00" },
          { label: "Interest Rate", value: "12.5% p.a." },
        ]}
        dueLabel="Next Due Date"
        dueValue="15 Oct, 2023"
        actionLabel="Pay Now"
        onActionPress={() => router.push("/loans/pay")}
      />

      <View className="flex-row justify-between">
        <QuickActionButton icon={<PlusCircle size={22} color={colors.primary} />} label="Apply Now" backgroundColor="#F0FDF4" onPress={() => router.push("/loans/apply")} />
        <QuickActionButton icon={<BarChart3 size={22} color="#92400E" />} label="Track App" backgroundColor="#FEF3C7" onPress={() => router.push("/loans/track")} />
        <QuickActionButton icon={<CalendarClock size={22} color="#374151" />} label="Schedule" backgroundColor="#F3F4F6" onPress={() => router.push("/loans/schedule")} />
      </View>

      <View>
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold">Loan Categories</Text>
          <Text className="text-sm font-semibold" style={{ color: colors.primary }} onPress={() => router.push("/loans/categories")}>
            View all
          </Text>
        </View>

        <View className="gap-3">
          <View className="flex-row gap-3">
            <CategoryCard label="Housing" icon={<Home size={18} color="white" />} image={require("@/assets/img-housing-loan.png")} onPress={() => router.push("/loans/housing")} />
            <CategoryCard label="Education" icon={<GraduationCap size={18} color="white" />} image={require("@/assets/img-education-loan.png")} onPress={() => router.push("/loans/education")} />
          </View>
          <View className="flex-row gap-3">
            <CategoryCard label="Medical" icon={<Stethoscope size={18} color="white" />} image={require("@/assets/img-medical-loan.png")} onPress={() => router.push("/loans/medical")} />
            <CategoryCard label="Personal" icon={<Rocket size={18} color="white" />} image={require("@/assets/img-personal-loan.png")} onPress={() => router.push("/loans/personal")} />
          </View>
        </View>
      </View>

      <TipCard
        icon={<PiggyBank size={20} color="#B45309" />}
        iconBackground="#FDE68A"
        title="Lower interest rates?"
        subtitle="Boost your savings to unlock premium loan tiers."
        onPress={() => router.push("/savings")}
      />
    </ScrollView>
  );
}