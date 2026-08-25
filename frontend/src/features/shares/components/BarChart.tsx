import { View, Text } from "react-native";
import { colors } from "@/src/constants/colors";

interface BarChartDataPoint {
  label: string;
  value: number;
  projected?: boolean;
}

interface BarChartProps {
  data: BarChartDataPoint[];
  height?: number;
  barColor?: string;
  projectedBarColor?: string;
}

export function BarChart({
  data,
  height = 160,
  barColor = colors.primary,
  projectedBarColor = "#A7D0AE",
}: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <View className="flex-row items-end justify-between" style={{ height, gap: 12 }}>
      {data.map((point) => {
        const barHeight = Math.max((point.value / maxValue) * height, 6);
        return (
          <View key={point.label} className="flex-1 items-center" style={{ gap: 8 }}>
            <View style={{ flex: 1, justifyContent: "flex-end", width: "100%" }}>
              <View
                style={{
                  height: barHeight,
                  width: "60%",
                  alignSelf: "center",
                  borderRadius: 8,
                  backgroundColor: point.projected ? projectedBarColor : barColor,
                  borderWidth: point.projected ? 1.5 : 0,
                  borderColor: barColor,
                  borderStyle: point.projected ? "dashed" : "solid",
                }}
              />
            </View>
            <Text
              className="text-xs"
              style={{
                color: point.projected ? colors.primary : "#6B7280",
                fontWeight: point.projected ? "700" : "400",
              }}
            >
              {point.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}