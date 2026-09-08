import { useLocalSearchParams } from "expo-router";
import { AccountDetailsScreen } from "@/src/features/savings/screens/AccountDetailsScreen";

export default function Page() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <AccountDetailsScreen accountId={id} />;
}