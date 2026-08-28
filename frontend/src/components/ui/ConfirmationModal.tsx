// src/components/ui/ConfirmationModal.tsx
import { Modal, View, Text, Pressable } from "react-native";
import { ReactNode } from "react";
import { Button } from "./Button";
import { colors } from "@/src/constants/colors";

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean; // turn confirm button to red instead of green colour
  icon?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  icon,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onPress={onCancel}
      >
        {/* to stop a tap on the card itself from closing the modal */}
        <Pressable
          className="w-full rounded-2xl p-5 bg-white"
          onPress={(e) => e.stopPropagation()}
        >
          {icon && <View className="items-center mb-3">{icon}</View>}

          <Text
            className="text-lg font-bold text-center mb-2"
            style={{ color: colors.textPrimary }}
          >
            {title}
          </Text>
          <Text
            className="text-sm text-center mb-5"
            style={{ color: "#6B7280" }}
          >
            {message}
          </Text>

          <View className="flex-row" style={{ gap: 12 }}>
            <Button
              label={cancelLabel}
              variant="secondary"
              fullWidth={false}
              className="flex-1"
              onPress={onCancel}
            />
            <Button
              label={confirmLabel}
              variant={destructive ? "danger" : "primary"}
              fullWidth={false}
              className="flex-1"
              onPress={onConfirm}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}