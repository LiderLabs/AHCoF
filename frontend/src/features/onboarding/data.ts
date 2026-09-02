import { ImageSourcePropType } from "react-native";

export interface OnboardingSlide {
  id: string;
  image: ImageSourcePropType;
  title: string;
  description: string;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: "1",
    image: require("@/assets/onboarding/img_woman.jpeg"),
    title: "Save, grow, and borrow the Adventist way",
    description:
      "AHCoF works like your everyday bank, built by and for Adventist church members. Save consistently, earn interest, and become a shareholder in a fund that gives back to the church.",
  },
  {
    id: "2",
     image: require("@/assets/onboarding/img_man.png"),
    title: "From savings to loans, all in one place",
    description:
      "Once you've saved for a while, you can access loans at moderate rates, for church projects, a home, or personal needs.",
  },
  {
    id: "3",
     image: require("@/assets/onboarding/img_kid.jpeg"),
    title: "Save for your child's future too",
    description:
      "Open a Kidi savings account for your child right from your own profile, and start building their financial future early.",
  },
];