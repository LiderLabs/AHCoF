import { useState, useRef } from "react";
import { View, Text, FlatList, Dimensions, ViewToken } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/src/components/ui/Button";
import { onboardingSlides } from "../data";

const { width } = Dimensions.get("window");

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
          <View style={{ width }} className="flex-1 items-center justify-center px-8">
            <Text className="text-2xl font-bold text-center mb-4">
              {item.title}
            </Text>
            <Text className="text-base text-center text-gray-600">
              {item.description}
            </Text>
          </View>
        )}
      />

      <View className="flex-row justify-center gap-2 mb-6">
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
          label={isLastSlide ? "Get Started" : "Next"}
          onPress={handleNext}
        />
      </View>
    </View>
  );
}