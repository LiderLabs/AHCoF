import { ReactNode } from "react";
import { Image , Text, View} from "react-native";
import {colors} from "@/src/constants/colors";

interface LogoProps {
    type: 'green' | 'white';
}

export function Logo({type} : LogoProps) {

    return (
           <View className="flex flex-col items-center gap-4">
                  <Image
                    source={type === 'white' ? require("@/assets/logo_icon.png") : require("@/assets/logo_icon.png") }
                    style={{ width: 120, height: 120 }}
                    resizeMode="contain"
                  />
                  <Text
                    className="text-3xl font-bold mb-2"
                    style={{ color: colors.primary }}
                  >
                    AHCoF
                  </Text>
                  <Text 
                   className= "text-lg font-bold -mt-4"
                   style={{color: type === "green" ? colors.textInverted : colors.textSecondary}}
                   >
                    {type === 'white' ? "ADVENTIST HERITAGE" : "GROWTH & STEWARDSHIP"}
                  </Text>
                </View>
    )
}