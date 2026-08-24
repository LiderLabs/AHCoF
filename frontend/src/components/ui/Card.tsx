import { View, ViewProps } from "react-native";
import { ReactNode } from "react";
import { colors } from "@/src/constants/colors";

interface CardProps extends ViewProps {
  children: ReactNode;
  backgroundColor?: string;
  className?: string;
}

export function Card({
  children,
  backgroundColor = colors.background,
  className = "",
  style,
  ...rest
}: CardProps) {
  return (
    <View
      className={`rounded-2xl p-4 ${className}`}
      style={[{ backgroundColor }, style]}
      {...rest}
    >
      {children}
    </View>
  );
}