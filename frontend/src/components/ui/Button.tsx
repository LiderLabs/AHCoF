import { Pressable, PressableProps, Text } from "react-native";
import {ReactNode} from "react";
import { colors} from "@/src/constants/colors"

interface ButtonProps extends PressableProps {
    label: string;
    variant?: 'primary' | 'secondary' ;
    onPress?: () => void;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
    className?: string;
}

export default function Button({label, variant = "primary", onPress, className = '', icon, iconPosition = 'left', ...rest} : ButtonProps) {

    const variantStyles = {
        primary: colors.primary,
        secondary: `${colors.buttonTransparent} border border-green-800`,
    }

    const textStyles = {
      primary:colors.buttonTextPrimary,
      secondary: colors.buttonTextSecondary,
    }


  return (
    <Pressable
      className={`${variantStyles[variant]} ${className} w-full rounded-xl py-3 items-center mb-4 ${icon ? "flex-row" : ""}` }
      onPress={onPress}
      {...rest}
    >
      {icon && iconPosition == 'left' && icon}
      <Text className={`${textStyles[variant]} text-white font-semibold py-2 text-2xl`}>
        {label}
      </Text>
      {icon && iconPosition === 'right' && icon}
    </Pressable>
  );
}
