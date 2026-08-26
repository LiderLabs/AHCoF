export const PROVIDERS = {
  mtn: {
    id: "mtn",
    name: "MTN MoMo",
    logo: require("@/assets/logo_mtn.jpeg"),
  },
  vodafone: {
    id: "vodafone",
    name: "Vodafone Cash",
    logo: require("@/assets/logo_vodafone.png"),
  },
  airteltigo: {
    id: "airteltigo",
    name: "AirtelTigo Money",
    logo: require("@/assets/logo_airteltigo.jpeg"),
  },
} as const;

export type ProviderId = keyof typeof PROVIDERS;