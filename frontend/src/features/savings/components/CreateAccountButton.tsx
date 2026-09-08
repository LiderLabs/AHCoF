import { Pressable } from "react-native";
import { Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import { colors } from "@/src/constants/colors";
import { AccountTypePickerModal } from "./AccountTypePickerModal";
import type { AccountType } from "@/src/features/savings/types";

const ROUTES: Record<AccountType, string> = {
  regular_account: "/savings/create/regular",
  kidi_account: "/savings/create/kidi",
  education_fund: "/savings/create/education",
  purpose_driven: "/savings/create/purpose-driven",
};

interface CreateAccountButtonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAccountButton({ open, onOpenChange }: CreateAccountButtonProps) {
  const router = useRouter();

  const handleSelect = (type: AccountType) => {
    onOpenChange(false);
    router.push(ROUTES[type]);
  };

  return (
    <>
      <Pressable
        onPress={() => onOpenChange(true)}
        accessibilityLabel="Create savings account"
        className="absolute right-5 bottom-6 w-14 h-14 rounded-full items-center justify-center"
        style={{
          backgroundColor: colors.primary,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 6,
        }}
      >
        <Plus size={26} color={colors.buttonTextPrimary} strokeWidth={2} />
      </Pressable>

      <AccountTypePickerModal visible={open} onClose={() => onOpenChange(false)} onSelect={handleSelect} />
    </>
  );
}