import { Modal, Pressable, View, Text } from "react-native";
import { PiggyBank, Baby, GraduationCap, Target, ChevronRight, X } from "lucide-react-native";
import { Card } from "@/src/components/ui/Card";
import { colors } from "@/src/constants/colors";
import type { AccountType } from "@/src/features/savings/types";

const ACCOUNT_TYPES: {
  type: AccountType;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
}[] = [
  { type: "regular_account", label: "Regular Savings", description: "Flexible saving, no goal or deadline attached.", icon: PiggyBank },
  { type: "kidi_account", label: "Kidi Account", description: "Save toward a child's future, with scheduled transfers.", icon: Baby },
  { type: "education_fund", label: "Education Fund", description: "Track progress toward a specific tuition or school goal.", icon: GraduationCap },
  { type: "purpose_driven", label: "Purpose Driven", description: "Save toward anything — a target amount and a deadline.", icon: Target },
];

interface AccountTypePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: AccountType) => void;
}

export function AccountTypePickerModal({ visible, onClose, onSelect }: AccountTypePickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(27,42,34,0.45)" }}
        onPress={onClose}
      >
        {/* stopPropagation equivalent: swallow presses on the sheet itself */}
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View
            className="rounded-t-3xl px-5 pt-5 pb-8"
            style={{ backgroundColor: colors.background }}
          >
            <View className="flex-row items-start justify-between mb-1">
              <View>
                <Text className="text-xl font-semibold" style={{ color: colors.buttonTextPrimary }}>
                  Choose account type
                </Text>
                <Text className="text-sm mt-1 opacity-60" style={{ color: colors.buttonTextPrimary }}>
                  Pick what you're saving toward.
                </Text>
              </View>
              <Pressable
                onPress={onClose}
                accessibilityLabel="Close"
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.buttonTransparent, borderWidth: 1, borderColor: colors.primary }}
              >
                <X size={16} color={colors.textPrimary} />
              </Pressable>
            </View>

            <View className="mt-5" style={{ gap: 12 }}>
              {ACCOUNT_TYPES.map(({ type, label, description, icon: Icon }) => (
                <Pressable key={type} onPress={() => onSelect(type)}>
                  <Card className="flex-row items-center border border-gray-300" >
                    <View
                      className="w-11 h-11 rounded-xl items-center justify-center mr-4"
                      style={{ backgroundColor: colors.backgroundLime }}
                    >
                      <Icon size={20} color={colors.primary} strokeWidth={1.75} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                        {label}
                      </Text>
                      <Text className="text-sm mt-0.5 opacity-60" style={{ color: colors.textPrimary }}>
                        {description}
                      </Text>
                    </View>
                    <ChevronRight size={18} color={colors.textPrimary} style={{ opacity: 0.5 }} />
                  </Card>
                </Pressable>
              ))}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}