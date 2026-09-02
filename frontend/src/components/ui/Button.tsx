import { Pressable, PressableProps, Text } from "react-native";
import { ReactNode } from "react";
import { colors } from "@/src/constants/colors";

interface ButtonProps extends PressableProps {
  label: string;
  variant?: "primary" | "secondary" | "danger";
  onPress?: () => void;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  fullWidth?: boolean;
}

export function Button({
  label,
  variant = "primary",
  onPress,
  className = "",
  icon,
  iconPosition = "left",
  fullWidth = true,
  ...rest
}: ButtonProps) {
  const variantStyles = {
    primary: { backgroundColor: colors.primary },
    secondary: {
      backgroundColor: colors.buttonTransparent,
      borderColor: colors.primary,
      borderWidth: 2,
    },
    danger: {backgroundColor: "#DC2626"},
  };

  const textStyles = {
    primary: { color: colors.buttonTextPrimary },
    secondary: { color: colors.buttonTextSecondary },
  };

  return (
    <Pressable
      className={`rounded-xl items-center justify-center mb-4 ${icon ? "flex-row" : ""} ${fullWidth ? "w-full py-4" : ""} ${className} `}
      style={variantStyles[variant]}
      onPress={onPress}
      {...rest}
    >
      {icon && iconPosition == "left" && icon}
      <Text
        className={`font-semibold ${fullWidth ? "text-2xl" : "text-lg"}`}
        style={textStyles[variant]}
      >
        {label}
      </Text>
      {icon && iconPosition === "right" && icon}
    </Pressable>
  );
}
