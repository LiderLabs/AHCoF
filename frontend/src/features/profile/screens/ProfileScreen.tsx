import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter, usePathname } from "expo-router";
import {
  Smartphone,
  Bell,
  Heart,
  ChevronRight,
  Award,
  ShieldCheck,
  FileText,
  Wallet,
  Headphones,
  LogOut,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Card } from "@/src/components/ui/Card";
import { ListItem } from "@/src/components/ui/ListItem";
import { InfoField } from "../components/InfoField";
import { BottomNavBar } from "@/src/components/ui/BottomNav";
import { navItems } from "@/src/constants/navItems";
import { colors } from "@/src/constants/colors";
import { ProfileHeader } from "../components/ProfileHeader";
import { ReferralBanner } from "../components/ReferralBanner";
import { ConfirmationModal } from "@/src/components/ui/ConfirmationModal";
import { useState } from "react";

export default function ProfileScreen() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const activeKey =
    navItems.find((item) => item.route === pathname)?.key ?? "profile";

  return (
    <View className="flex-1 pt-6" style={{ backgroundColor: "#F5F6FA" }}>
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
      >
        {/* Header */}
        <ProfileHeader
          name="Elder Mensah"
          memberId="#CUA-00921-GH"
          avatar={<Smartphone size={22} color="#374151" />}
          actions={<Bell size={22} color="#374151" onPress={() => {}} />}
        />

          {/* Confirmation modal here */}
        <ConfirmationModal
         visible={showLogoutConfirm}
         title="Sign Out?"
         message="You will need to sign in again to access your account."
         confirmLabel="Sign Out"
         cancelLabel="Stay Signed In"
         destructive
         onCancel={() => setShowLogoutConfirm(false)}
         onConfirm={() => {
          setShowLogoutConfirm(false);
          router.replace("/(auth)/login");
         }}
        />

        {/* Referral banner */}
        <ReferralBanner
          title="It's a win-win"
          subtitle="Earn free points for referring"
          onPress={() => {}}
        />

        {/* Membership status */}
        <Card className="mb-4" style={{ paddingVertical: 4 }}>
          <ListItem
            label="Membership status - Achiever"
            icon={<Award size={18} color="#92400E" />}
            iconBackgroundColor="#FDE9C8"
            onPress={() => {}}
          />
        </Card>

        {/* Personal information */}
        <View className="flex-row items-center justify-between mb-2">
          <Text
            className="text-base font-bold"
            style={{ color: colors.textPrimary }}
          >
            Personal Information
          </Text>
          <Pressable>
            <Text
              className="text-sm font-medium"
              style={{ color: colors.primary }}
            >
              Edit
            </Text>
          </Pressable>
        </View>
        <Card className="mb-4" style={{ paddingVertical: 4 }}>
          <InfoField
            label="Church & Conference"
            value="Bethany Central, Central Conference"
          />
          <Divider />
          <InfoField label="Phone Number" value="+233 24 555 0192" />
          <Divider />
          <InfoField label="Email Address" value="e.mensah@church-cua.org" />
          <Divider />
          <InfoField label="GPS Address" value="GA-183-9921, Accra, Ghana" />
        </Card>

        {/* Settings & actions */}
        <Text
          className="text-base font-bold mb-2"
          style={{ color: colors.textPrimary }}
        >
          Settings & Actions
        </Text>
        <Card className="mb-2" style={{ paddingVertical: 4 }}>
          <ListItem
            label="Security settings"
            icon={<ShieldCheck size={18} color="#166534" />}
            iconBackgroundColor="#DCFCE7"
            onPress={() => {}}
          />
        </Card>
        <Card className="mb-2" style={{ paddingVertical: 4 }}>
          <ListItem
            label="Download Statements"
            icon={<FileText size={18} color="#374151" />}
            onPress={() => {}}
          />
        </Card>
        <Card className="mb-2" style={{ paddingVertical: 4 }}>
          <ListItem
            label="Mobile Money Wallet"
            icon={<Wallet size={18} color="#374151" />}
            rightLabel="COMING SOON"
            disabled
          />
        </Card>
        <Card className="mb-4" style={{ paddingVertical: 4 }}>
          <ListItem
            label="Contact Support"
            icon={<Headphones size={18} color="#374151" />}
            onPress={() => {}}
          />
        </Card>

        {/* Sign out */}
        <Pressable
          className="flex-row items-center justify-center py-3"
          onPress={() => setShowLogoutConfirm(true)}
        >
          <LogOut size={18} color="#DC2626" style={{ marginRight: 6 }} />
          <Text className="font-semibold" style={{ color: "#DC2626" }}>
            Sign Out
          </Text>
        </Pressable>
      </ScrollView>

      <BottomNavBar
        items={navItems}
        activeKey={activeKey}
        onNavigate={(route) => router.push(route)}
      />
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: "#F1F1F1" }} />;
}
