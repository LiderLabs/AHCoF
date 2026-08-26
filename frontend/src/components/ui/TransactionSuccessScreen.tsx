import { View, Text } from "react-native";
import { ReactNode } from "react";
import { CheckCircle2, Download } from "lucide-react-native";
import { Card } from "./Card";
import { Button } from "./Button";
import { colors } from "@/src/constants/colors";

interface DetailRow {
  label: string;
  value: string;
  valueBadge?: boolean;
  copyable?: boolean;  
}

interface TransactionSuccessScreenProps {
  title: string;
  description: string;
  detailRows: DetailRow[];
  statusLabel?: string;
  footerNote?: string;
  extraCard?: ReactNode;
  onBackToDashboard?: () => void;
  onDownloadReceipt?: () => void;
  checkmarkBackgroundColor?: string;
  checkmarkColor?: string;
}

export function TransactionSuccessScreen({
  title,
  description,
  detailRows,
  statusLabel,
  footerNote,
  extraCard,
  onBackToDashboard,
  onDownloadReceipt,
  checkmarkBackgroundColor = "#D1FAE5",
  checkmarkColor = colors.primary,
}: TransactionSuccessScreenProps) {
  return (
    <View className="flex-1 justify-between px-1">
      <View className="items-center" style={{ gap: 8 }}>
        <View
          className="items-center justify-center rounded-full mb-2"
          style={{ width: 90, height: 90, backgroundColor: checkmarkBackgroundColor }}
        >
          <CheckCircle2 size={44} color={checkmarkColor} />
        </View>
        <Text className="text-xl font-bold text-center" style={{ color: colors.textPrimary }}>
          {title}
        </Text>
        <Text className="text-sm text-center px-4" style={{ color: "#6B7280" }}>
          {description}
        </Text>

        <View className="w-full mt-4">
          <Card>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xs" style={{ color: "#9CA3AF" }}>
                TRANSACTION DETAILS
              </Text>
              {statusLabel && (
                <View className="rounded-full px-3 py-1" style={{ backgroundColor: "#DCFCE7" }}>
                  <Text className="text-xs font-bold" style={{ color: "#166534" }}>
                    {statusLabel}
                  </Text>
                </View>
              )}
            </View>
            {detailRows.map((row) => (
              <View key={row.label} className="flex-row justify-between py-1.5">
                <Text className="text-sm" style={{ color: "#9CA3AF" }}>
                  {row.label}
                </Text>
                <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  {row.value}
                </Text>
              </View>
            ))}
          </Card>
        </View>

        {extraCard && <View className="w-full mt-3">{extraCard}</View>}
      </View>

      <View className="mb-2">
        <Button label="Back to Dashboard" variant="primary" onPress={onBackToDashboard} />
        <Button
          label="Download Receipt"
          variant="secondary"
          icon={<Download size={16} color={colors.primary} style={{ marginRight: 8 }} />}
          onPress={onDownloadReceipt}
        />
        {footerNote && (
          <Text className="text-xs text-center mt-1" style={{ color: "#9CA3AF" }}>
            {footerNote}
          </Text>
        )}
      </View>
    </View>
  );
}