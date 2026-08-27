import { Home, Compass, Grid3x3, User } from "lucide-react-native";
import { colors } from "@/src/constants/colors";

export const navItems = [
  {
    key: "portfolio",
    label: "Portfolio",
    route: "/portfolio",
    icon: (active: boolean) => (
      <Home size={22} color={active ? colors.primary : "#9CA3AF"} />
    ),
  },
  {
    key: "explore",
    label: "Explore",
    route: "/explore",
    icon: (active: boolean) => (
      <Compass size={22} color={active ? colors.primary : "#9CA3AF"} />
    ),
  },
  {
    key: "more",
    label: "More",
    route: "/more",
    icon: (active: boolean) => (
      <Grid3x3 size={22} color={active ? colors.primary : "#9CA3AF"} />
    ),
  },
  {
    key: "profile",
    label: "Profile",
    route: "/profile",
    icon: (active: boolean) => (
      <User size={22} color={active ? colors.primary : "#9CA3AF"} />
    ),
  },
];