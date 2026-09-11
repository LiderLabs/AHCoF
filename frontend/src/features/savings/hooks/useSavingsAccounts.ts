import { useState, useCallback, useEffect } from "react";
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
        const accountsList = (res as any).accounts || (res as any).data?.accounts || [];
        setAccounts(accountsList);
      }
    } catch (err) {
      console.warn("Failed to fetch savings accounts:", err);
      setAccounts([]); // fall back to empty so the empty state can render
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return { accounts, loading, refetch };
}