import { View, ImageBackground, Text } from "react-native";
import { Dot, CircleQuestionMark, Bell, MessageSquare } from "lucide-react-native";
import { colors } from "@/src/constants/colors";


export function Header(){

    return (
        <View className="flex-row items-center justify-between px-2">
           <View className="flex-row gap-2 items-center">
             {/* Profile image */}
            <ImageBackground style={{borderRadius: 50, borderWidth: 2, width: 60, height: 60, overflow: "hidden", }} source={require("@/assets/icon.png")}>

            </ImageBackground>
            {/* Name and status */}
            <View className="flex-col justify-center pt-3">
                <Text className="text-2xl -mb-4">Hi, Username</Text>
                <View className="flex-row items-center">
                    <Text className="text-lg">Achiever</Text>
                    <Dot size={50} color={colors.primary} style={{marginLeft: -15}}/>
                </View>
            </View>
           </View>

            {/* notification icons */}
            <View className="flex-row gap-6">
                <CircleQuestionMark size={27}/>
                <Bell size={27}/>
                <MessageSquare size={27}/>
            </View>
        </View>
    )
}