import { useState } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import { colors } from "@/src/constants/colors";

interface DateFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  minimumDate?: Date;
}

export function DateField({ label, value, onChange, minimumDate }: DateFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const formatted = value
    ? value.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "Select date";

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (event.type === "dismissed") return;
    if (selectedDate) onChange(selectedDate);
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold mb-2 ml-2" style={{ color: colors.primary }}>
        {label}
      </Text>
      <Pressable
        onPress={() => setShowPicker(true)}
        className="flex-row items-center justify-between rounded-xl px-4 py-3.5"
        style={{ borderWidth: 1, borderColor: colors.textPrimary, backgroundColor: "#FFFFFF" }}
      >
        <Text className="text-base" style={{ color: value ? colors.textPrimary : "#9CA3AF" }}>
          {formatted}
        </Text>
        <Calendar size={18} color={colors.primary} />
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
}