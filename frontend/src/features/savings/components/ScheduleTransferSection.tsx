import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { AmountInput } from "@/src/components/ui/AmountInput";
import { DateField } from "@/src/components/ui/DateField";
import { colors } from "@/src/constants/colors";
import { scheduleTransfer } from "@/src/features/savings/api/savingsApi";
import type { TransferScheduleType, TransferFrequency } from "@/src/features/savings/types";

interface ScheduleTransferSectionProps {
  accountId: string;
  onScheduled?: () => void;
}

function SegmentButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 py-2.5 rounded-lg items-center border-2"
      style={{ backgroundColor: active ? colors.primary : "transparent", borderColor: colors.primary }}
    >
      <Text
        className="text-md font-semibold"
        style={{ color: active ? "#FFFFFF" : colors.textPrimary }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function ScheduleTransferSection({ accountId, onScheduled }: ScheduleTransferSectionProps) {
  const [scheduleType, setScheduleType] = useState<TransferScheduleType>("one_time");
  const [frequency, setFrequency] = useState<TransferFrequency>("monthly");
  const [amount, setAmount] = useState("");
  const [transferDate, setTransferDate] = useState<Date | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const amountValue = parseFloat(amount) || 0;
  const isValid = amountValue > 0 && transferDate;

  const handleSubmit = async () => {
    if (!isValid || !transferDate) return;
    setSubmitting(true);
    try {
      const res = await scheduleTransfer(accountId, {
        amount: Math.round(amountValue * 100),
        scheduleType,
        transferDate: transferDate.toISOString(),
        frequency: scheduleType === "recurring" ? frequency : undefined,
      });
      if (res.status === "success") {
        setConfirmed(true);
        onScheduled?.();
      } else {
        console.warn("Failed to schedule transfer:", res);
      }
    } catch (err) {
      console.warn("Failed to schedule transfer:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <Card backgroundColor={colors.backgroundForm}>
        <Text className="text-base font-semibold" style={{ color: colors.primary }}>
          Transfer scheduled
        </Text>
        <Text className="text-sm mt-1" style={{ color: "#6B7280" }}>
          {scheduleType === "recurring"
            ? `GHS ${amount} will transfer ${frequency}, starting ${transferDate?.toLocaleDateString()}.`
            : `GHS ${amount} will transfer on ${transferDate?.toLocaleDateString()}.`}
        </Text>
        <Pressable onPress={() => setConfirmed(false)} className="mt-3">
          <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
            Schedule another
          </Text>
        </Pressable>
      </Card>
    );
  }

  return (
    <Card backgroundColor={colors.backgroundForm}>
      <Text className="text-base font-semibold mb-3" style={{ color: colors.primary }}>
        Schedule a transfer
      </Text>

      <View className="flex-row rounded-xl p-1 mb-4 gap-3" style={{ backgroundColor: "#F3F4F6" }}>
        <SegmentButton
          label="One-time"
          active={scheduleType === "one_time"}
          onPress={() => setScheduleType("one_time")}
        />
        <SegmentButton
          label="Recurring"
          active={scheduleType === "recurring"}
          onPress={() => setScheduleType("recurring")}
        />
      </View>

      <AmountInput label="Amount" value={amount} onChangeValue={setAmount} />

      {scheduleType === "recurring" && (
        <View className="flex-row rounded-xl p-1 mb-4" style={{ backgroundColor: "#F3F4F6" }}>
          <SegmentButton
            label="Weekly"
            active={frequency === "weekly"}
            onPress={() => setFrequency("weekly")}
          />
          <SegmentButton
            label="Monthly"
            active={frequency === "monthly"}
            onPress={() => setFrequency("monthly")}
          />
        </View>
      )}

      <DateField
        label={scheduleType === "recurring" ? "Start date" : "Transfer date"}
        value={transferDate}
        onChange={setTransferDate}
        minimumDate={new Date()}
      />

      <Button
        label={submitting ? "Scheduling…" : "Schedule transfer"}
        onPress={handleSubmit}
        disabled={submitting || !isValid}
      />
    </Card>
  );
}