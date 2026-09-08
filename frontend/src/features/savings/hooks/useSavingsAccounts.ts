import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import type { RegularSavingsAccount } from "@/src/features/savings/types";
import { getSavingsAccounts } from "@/src/features/savings/api/savingsApi";

export function useSavingsAccounts() {
  const [accounts, setAccounts] = useState<RegularSavingsAccount[]>([]);
  const [loading, setLoading] = useState(true);


  const refetch = useCallback(async () => {
  setLoading(true);
  try {
    const res = await getSavingsAccounts();
    if (res.status === "success") {
      setAccounts(res.data.accounts);
    }
  } catch (err) {
    console.error("Failed to fetch savings accounts:", err);
    setAccounts([]); // fall back to empty so the empty state can render
  } finally {
    setLoading(false);
  }
}, []);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return { accounts, loading, refetch };
}