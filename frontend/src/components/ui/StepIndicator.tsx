import { View, Text } from "react-native";
import { colors } from "@/src/constants/colors";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <View className="items-center py-4" style={{ gap: 8 }}>
      <View className="flex-row" style={{ gap: 6 }}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isDone = step < currentStep;
          return (
            <View
              key={step}
              style={{
                height: 6,
                width: isActive ? 28 : 6,
                borderRadius: 3,
                backgroundColor: isActive || isDone ? colors.primary : "#E5E7EB",
              }}
            />
          );
        })}
      </View>
      <Text className="text-xs" style={{ color: "#9CA3AF" }}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );
}