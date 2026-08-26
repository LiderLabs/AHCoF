import { View, Text } from "react-native";
import { Card } from "./Card";
import { colors } from "@/src/constants/colors";

interface SummaryRow {
  label: string;
  value: string;
  emphasis?: boolean;
  valueColor?: string;
}

interface SummaryCardProps {
  title?: string;
  rows: SummaryRow[];
}

export function SummaryCard({ title, rows }: SummaryCardProps) {
  return (
    <Card>
      {title && (
        <Text className="text-xs mb-2" style={{ color: "#9CA3AF" }}>
          {title}
        </Text>
      )}
      {rows.map((row, index) => (
        <View key={row.label}>
          {row.emphasis && <View style={{ height: 1, backgroundColor: "#F1F1F1", marginVertical: 8 }} />}
          <View className="flex-row items-center justify-between py-1">
            <Text
              className={row.emphasis ? "text-base font-bold" : "text-sm"}
              style={{ color: row.emphasis ? colors.textPrimary : "#6B7280" }}
            >
              {row.label}
            </Text>
            <Text
              className={row.emphasis ? "text-base font-bold" : "text-sm font-semibold"}
              style={{ color: row.valueColor ?? (row.emphasis ? colors.primary : colors.textPrimary) }}
            >
              {row.value}
            </Text>
          </View>
        </View>
      ))}
    </Card>
  );
}