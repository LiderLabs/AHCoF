import { View, Text, ScrollView } from "react-native";
import { useRouter, usePathname } from "expo-router";
import {
  HelpCircle,
  Bell,
  MessageSquare,
  UserPlus,
  Banknote,
  Wallet,
  Ban,
  Church,
  Building2,
  Info,
} from "lucide-react-native";

import { Header } from "@/src/components/ui/Header";
import { NotificationBadgeIcon } from "@/src/components/ui/NotificationBadgeIcon";
import { Card } from "@/src/components/ui/Card";
import { ListItem } from "../components/ListItem";
import { HelpCard } from "../components/HelpCard";
import { BottomNavBar } from "@/src/components/ui/BottomNav";
import { navItems } from "@/src/constants/navItems";
import { colors } from "@/src/constants/colors";
import { FeaturePromoCard } from "../components/FeaturePromoCard";
import { useAuth } from "../../auth/context/AuthContext";

const forms = [
  {
    key: "membership",
    title: "Membership Form",
    subtitle: "Register a new member",
    icon: <UserPlus size={20} color="#166534" />,
    iconBackgroundColor: "#DCFCE7",
  },
  {
    key: "loan",
    title: "Loan Application",
    subtitle: "Apply for personal or business credit",
    icon: <Banknote size={20} color="#92400E" />,
    iconBackgroundColor: "#FEF3C7",
  },
  {
    key: "withdrawal",
    title: "Withdrawal Request",
    subtitle: "Request funds from your account",
    icon: <Wallet size={20} color="#0F766E" />,
    iconBackgroundColor: "#F0FDFA",
  },
  {
    key: "closure",
    title: "Account Closure Request",
    subtitle: "Terminate your current plan",
    icon: <Ban size={20} color="#B91C1C" />,
    iconBackgroundColor: "#FEE2E2",
  },
  {
    key: "church-entity",
    title: "Church Entity Registration",
    subtitle: "Official stewardship for ministries",
    icon: <Church size={20} color="#166534" />,
    iconBackgroundColor: "#DCFCE7",
  },
  {
    key: "institution",
    title: "Institution Registration",
    subtitle: "Corporate and NGO fund management",
    icon: <Building2 size={20} color="#92400E" />,
    iconBackgroundColor: "#FEF3C7",
  },
];

export function FormsCenterScreen() {
  const {member} = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const activeKey = navItems.find((item) => item.route === pathname)?.key ?? "explore";

  return (
    <View className="flex-1 bg-white pt-6">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 18, gap: 20, paddingBottom: 100 }}
      >
        <Header
          name={member.firstName}
          status="Achiever"
          avatar={require("@/assets/icon.png")}
          actions={
            <>
              <HelpCircle size={24} color={colors.primary} />
              <NotificationBadgeIcon
                icon={<Bell size={24} color={colors.primary} />}
                count={1}
              />
              <MessageSquare size={24} color={colors.primary} />
            </>
          }
        />

        {/* Page heading */}
        <View>
          <Text className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            Digital Forms Center
          </Text>
          <Text className="text-base" style={{ color: "#6B7280" }}>
            Submit and manage your applications efficiently through our secure portal.
          </Text>
        </View>

        {/* Feature promo */}
        <FeaturePromoCard
          title="Streamlined Submissions"
          description="Fast-track your requests with our paperless workflow."
          buttonLabel="Learn about E-Sign"
          image={require("@/assets/img_forms_center.png")}
          onPress={() => router.push("/forms/e-sign")}
        />

        {/* Available forms */}
        <View>
          <Text
            className="text-xs font-semibold mb-2 px-1"
            style={{ color: "#9CA3AF", letterSpacing: 0.5 }}
          >
            AVAILABLE FORMS
          </Text>
          <Card style={{ paddingVertical: 4 }}>
            {forms.map((form, index) => (
              <View key={form.key}>
                <ListItem
                  label={form.title}
                  subtitle={form.subtitle}
                  icon={form.icon}
                  iconBackgroundColor={form.iconBackgroundColor}
                  iconShape="square"
                  iconSize={44}
                  onPress={() => router.push(`/forms/${form.key}`)}
                />
                {index < forms.length - 1 && (
                  <View style={{ height: 1, backgroundColor: "#F1F1F1" }} />
                )}
              </View>
            ))}
          </Card>
        </View>

        {/* Help card */}
        <HelpCard
          icon={<Info size={20} color={colors.primary} />}
          title="Need help with a form?"
          description="Our support team can guide you through the digital signature process and document verification."
          linkLabel="Contact Specialist"
          onPress={() => router.push("/support/contact")}
        />
      </ScrollView>

      <BottomNavBar items={navItems} activeKey={activeKey} onNavigate={(route) => router.push(route)} />
    </View>
  );
}