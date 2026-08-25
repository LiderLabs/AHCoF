import { View, Text, Pressable } from "react-native";
import { ReactNode } from "react";
import { colors } from "@/src/constants/colors";

interface NavItem {
  key: string;
  label: string;
  icon: (isActive: boolean)=> ReactNode;
  route: string;
}

interface BottomNavBarProps {
  items: NavItem[];
  activeKey: string;
  onNavigate: (route: string) => void;
}

export function BottomNavBar({ items, activeKey, onNavigate }: BottomNavBarProps) {
  return (
    <View
      className="flex-row justify-around items-center border-t pt-2 pb-6 bg-white"
      style={{ borderColor: "#E5E7EB" }}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;
        return (
          <Pressable
            key={item.key}
            onPress={() => onNavigate(item.route)}
            className="items-center"
            style={{ gap: 2 }}
          >
            {item.icon(isActive)}
            <Text
              className="text-xs"
              style={{ color: isActive ? colors.primary : "#9CA3AF",
                       fontWeight: isActive ? "600" : "400",
               }}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}