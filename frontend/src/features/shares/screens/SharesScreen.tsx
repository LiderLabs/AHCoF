import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import {
  Bell,
  Landmark,
  TrendingUp,
  Banknote,
  PlusCircle,
  FileText,
  Lightbulb,
} from "lucide-react-native";

import { Header } from "@/src/components/ui/Header";
import { Button } from "@/src/components/ui/Button";
import { ListItem } from "@/src/components/ui/ListItem";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { SplitStatCard } from "@/src/components/ui/SplitStatCard";
import { TipBanner } from "@/src/components/ui/TipBanner";
import { BarChart } from "../components/BarChart";
import { Card } from "@/src/components/ui/Card";
import { colors } from "@/src/constants/colors";
import { BackButton } from "@/src/components/ui/BackButton";
import { useAuth } from "../../auth/context/AuthContext";

const dividendProjectionData = [
  { label: "2021", value: 1250 },
  { label: "2022", value: 1480 },
  { label: "2023", value: 1840 },
  { label: "2024 (P)", value: 2090, projected: true },
];

export default function SharesScreen() {
  const {member} = useAuth();
  const router = useRouter();

  return (
    <View className="flex-1 bg-white pt-6">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 18, gap: 20, paddingBottom: 100 }}
      >
        {/* Back button */}
        <View className="pt-0 pb-1 -mb-5">
          <BackButton />
        </View>
        
        {/* Header */}
        <Header
          name={member.firstName}
          status="Achiever"
          avatar={require("@/assets/logo_icon.png")}
          actions={<Bell size={24} color={colors.primary} />}
        />

        <View>
          <Text
            className="text-2xl font-bold mb-2"
            style={{ color: colors.primary }}
          >
            Shares & Dividends
          </Text>
          <Text className="text-base" style={{ color: "#6B7280" }}>
            Track your equity growth and annual returns.
          </Text>
        </View>

        <SplitStatCard
          left={{
            icon: <Landmark size={22} color={colors.primary} />,
            label: "Total Shares",
            value: "12,450",
            badge: "+2.4%",
          }}
          right={{
            icon: <TrendingUp size={22} color="#B45309" />,
            label: "Share Value",
            value: "GHS 24,900",
          }}
        />

        <Card style={{ paddingVertical: 4 }}>
          <View className="pt-2">
            <SectionHeader
              title="Dividend History"
              actionLabel="View History"
              onActionPress={() => router.push("/shares/dividend-history")}
            />
          </View>
          <ListItem
            label="Last Payout (Dec 2023)"
            rightValue="GHS 1,840.50"
            icon={<Banknote size={18} color="#0F766E" />}
            iconBackgroundColor="#CCFBF1"
            showChevron={false}
          />
        </Card>

        <Card>
          <Text
            className="text-lg font-bold mb-1"
            style={{ color: colors.textPrimary }}
          >
            Annual Dividend Projection
          </Text>
          <Text className="text-sm mb-4" style={{ color: "#6B7280" }}>
            Based on historical 8.5% yield performance.
          </Text>
          <BarChart data={dividendProjectionData} />
        </Card>

        <View className="flex-row" style={{ gap: 12 }}>
          <Button
            label="Purchase Shares"
            variant="primary"
            fullWidth={false}
            className="flex-1"
            icon={
              <PlusCircle size={18} color="#fff" style={{ marginRight: 8 }} />
            }
            onPress={() => router.push("/shares/purchase")}
          />
          <Button
            label="Prospectus"
            variant="secondary"
            fullWidth={false}
            className="flex-1"
            icon={
              <FileText
                size={18}
                color={colors.primary}
                style={{ marginRight: 8 }}
              />
            }
            onPress={() => router.push("/shares/prospectus")}
          />
        </View>

        <TipBanner
          icon={<Lightbulb size={16} color="#fff" />}
          message="Did you know? Increasing your holdings by 500 shares could boost your projected dividend by GHS 250."
        />
      </ScrollView>
    </View>
  );
}
