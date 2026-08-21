import { Text, View } from "react-native";
import { ReactNode } from "react";

interface FormLayoutProps {
  title: string;
  children: ReactNode;
}

export function FormLayout({ title, children }: FormLayoutProps) {
  return (
    <View className="w-full ">
      <Text className="text-2xl font-bold mb-6 text-center">{title}</Text>
      {children}
    </View>
  );
}