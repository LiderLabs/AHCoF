import { Pressable, PressableProps, Text } from "react-native";
import { ReactNode } from "react";
import { colors } from "@/src/constants/colors";

interface ButtonProps extends PressableProps {
  label: string;
  variant?: "primary" | "secondary";
  onPress?: () => void;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
}

export function Button({
  label,
  variant = "primary",
  onPress,
  className = "",
  icon,
  iconPosition = "left",
  ...rest
}: ButtonProps) {
  const variantStyles = {
    primary: { backgroundColor: colors.primary },
    secondary: {
      backgroundColor: colors.buttonTransparent,
      borderColor: colors.primary,
      borderWidth: 2,
    },
  };

  const textStyles = {
    primary: { color: colors.buttonTextPrimary },
    secondary: { color: colors.buttonTextSecondary },
  };

  return (
    <Pressable
      className={`${className} w-full rounded-xl py-3 items-center mb-4 ${icon ? "flex-row" : ""}`}
      style={variantStyles[variant]}
      onPress={onPress}
      {...rest}
    >
      {icon && iconPosition == "left" && icon}
      <Text
        className={`font-semibold py-2 text-2xl`}
        style={textStyles[variant]}
      >
        {label}
      </Text>
      {icon && iconPosition === "right" && icon}
    </Pressable>
  );
}
