import { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  ViewToken,
  Pressable,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Button } from "@/src/components/ui/Button";
import { onboardingSlides } from "../data";
import { colors } from "@/src/constants/colors";
import { ArrowBigRight } from "lucide-react-native";

const { width, height } = Dimensions.get("window");
const IMAGE_HEIGHT = height * 0.6; // top 60% of screen — adjust to taste

export function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  const isLastSlide = activeIndex === onboardingSlides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      router.replace("/signup");
      return;
    }
    flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
  };

  const handleSkip = () => {
    router.replace("/signup");
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        ref={flatListRef}
        data={onboardingSlides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <ImageBackground
              source={item.image}
              style={{ width, height: IMAGE_HEIGHT }}
              resizeMode="cover"
            >
              {/* Dark overlay with fading to solid white at the bottom */}
              <LinearGradient
                colors={[
                  "rgba(0,0,0,0.35)",
                  "rgba(0,0,0,0.15)",
                  "rgba(255,255,255,0)",
                  "#FFFFFF",
                ]}
                locations={[0, 0.4, 0.75, 1]}
                style={{ flex: 1 }}
              >
                {!isLastSlide && (
                  <Pressable onPress={handleSkip} className="self-end mx-6 mt-14 rounded-2xl" style={{borderColor: colors.textInverted, borderWidth: 1}}>
                    <Text className="text-white font-medium text-md px-2 py-1">Skip</Text>
                  </Pressable>
                )}
              </LinearGradient>
            </ImageBackground>

            <View className=" px-7 justify-center items-center" style={{height: height * 0.22}}>
              <Text className="text-2xl font-bold text-center mb-4">
                {item.title}
              </Text>
              <Text className="text-base text-lg text-center text-gray-600">
                {item.description}
              </Text>
            </View>
          </View>
        )}
      />

      <View className="flex-row justify-center gap-2 mt-4 mb-6">
        {onboardingSlides.map((_, index) => (
          <View
            key={index}
            className="rounded-full"
            style={{
              width: index === activeIndex ? 24 : 8,
              height: 8,
              backgroundColor: index === activeIndex ? "#059669" : "#D1D5DB",
            }}
          />
        ))}
      </View>

      <View className="px-6 mb-8">
        <Button
          icon={isLastSlide ?  <ArrowBigRight size={22} style={{color: colors.textInverted, marginLeft: 6}}/> : undefined}
          iconPosition="right"
          label={isLastSlide ? "Continue to Signup" : "Next"}
          onPress={handleNext}
        />
      </View>
    </View>
  );
}