import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import {
  HelpCircle,
  Bell,
  MessageSquare,
  Megaphone,
  Banknote,
  AlertCircle,
  CheckCircle2,
  CalendarClock,
} from "lucide-react-native";

import { Header } from "@/src/components/ui/Header";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { NotificationCard } from "../components/NotificationCard";
import { AnnouncementBanner } from "../components/AnnouncementBanner";
import { BottomNavBar } from "@/src/components/ui/BottomNav";
import { navItems } from "@/src/constants/navItems";
import { colors } from "@/src/constants/colors";

// Placeholder — replace with real notifications from the API
const notifications = [
  {
    key: "agm",
    icon: <Megaphone size={18} color="#166534" />,
    iconBackgroundColor: "#DCFCE7",
    title: "Annual General Meeting",
    timestamp: "2h ago",
    description:
      "AHCoF general announcement: Join our virtual AGM this Saturday to discuss our 2024 growth strategy and community impacts.",
    actionLabel: "Register Now",
  },
  {
    key: "dividend",
    icon: <Banknote size={18} color="#92400E" />,
    iconBackgroundColor: "#FDE9C8",
    title: "Dividend Credited",
    timestamp: "5h ago",
    description:
      "Your share of the quarterly dividends (GHS 124.50) has been successfully credited to your portfolio.",
    unread: true,
  },
  {
    key: "repayment",
    icon: <AlertCircle size={18} color="#B91C1C" />,
    iconBackgroundColor: "#FEE2E2",
    title: "Repayment Due",
    timestamp: "1d ago",
    description:
      "Your loan repayment of GHS 500.00 is due in 3 days. Please ensure your wallet is sufficiently funded.",
  },
  {
    key: "approved",
    icon: <CheckCircle2 size={18} color="#166534" />,
    iconBackgroundColor: "#DCFCE7",
    title: "Application Approved",
    timestamp: "2d ago",
    description:
      'Great news! Your application for the "Business Expansion Loan" has been approved. Funds will be disbursed shortly.',
  },
  {
    key: "contribution",
    icon: <CalendarClock size={18} color="#0F766E" />,
    iconBackgroundColor: "#CCFBF1",
    title: "Monthly Contribution",
    timestamp: "3d ago",
    description:
      "Friendly reminder: Your monthly cooperative contribution of GHS 200.00 is scheduled for tomorrow.",
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white pt-6">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 18, paddingBottom: 100 }}
      >
        <Header
          name="Melchizedek"
          status="Achiever"
          avatar={require("@/assets/logo_icon.png")}
          actions={
            <>
              <HelpCircle size={24} color={colors.primary} />
              <Bell size={24} color={colors.primary} />
              <MessageSquare size={24} color={colors.primary} />
            </>
          }
        />

        <View className="mt-2 mb-4">
          <SectionHeader
            title="Notifications"
            actionLabel="Mark all as read"
            onActionPress={() => {}}
          />
        </View>

        {notifications.map((item) => (
          <NotificationCard
            key={item.key}
            icon={item.icon}
            iconBackgroundColor={item.iconBackgroundColor}
            title={item.title}
            timestamp={item.timestamp}
            description={item.description}
            unread={item.unread}
            actionLabel={item.actionLabel}
            onActionPress={
              item.actionLabel ? () => router.push(`/notifications/${item.key}`) : undefined
            }
          />
        ))}

        <View className="mt-1">
          <AnnouncementBanner
            title="Staying Informed"
            description="We notify you of every transaction and important community update to ensure your financial growth remains transparent."
            decorativeIcon={<Bell size={140} color="#fff" fill="#fff" />}
          />
        </View>
      </ScrollView>

      <BottomNavBar items={navItems} activeKey="more" onNavigate={(route) => router.push(route)} />
    </View>
  );
}