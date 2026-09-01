export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: "1",
    title: "Save, grow, and borrow the Adventist way",
    description:
      "AHCoF works like your everyday bank, built by and for Adventist church members. Save consistently, earn interest, and become a shareholder in a fund that gives back to the church.",
  },
  {
    id: "2",
    title: "From savings to loans, all in one place",
    description:
      "Once you've saved for a while, you can access loans at moderate rates, for church projects, a home, or personal needs.",
  },
  {
    id: "3",
    title: "Save for your child's future too",
    description:
      "Open a Kidi savings account for your child right from your own profile, and start building their financial future early.",
  },
];