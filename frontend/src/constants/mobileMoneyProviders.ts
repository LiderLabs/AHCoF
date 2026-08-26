export const PROVIDERS = {
  mtn: {
    id: "mtn",
    name: "MTN MoMo",
    logo: require("@/assets/logos/mtn.png"),
  },
  vodafone: {
    id: "vodafone",
    name: "Vodafone Cash",
    logo: require("@/assets/logos/vodafone.png"),
  },
  airteltigo: {
    id: "airteltigo",
    name: "AirtelTigo Money",
    logo: require("@/assets/logos/airteltigo.png"),
  },
} as const;

export type ProviderId = keyof typeof PROVIDERS;