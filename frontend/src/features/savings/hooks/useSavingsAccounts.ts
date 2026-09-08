import { useState, useEffect, useCallback } from "react";
import type { RegularSavingsAccount } from "@/src/features/savings/types";

// will replace with real fetch once GET /members/{memberId}/savings-accounts exists
export function useSavingsAccounts() {
  const [accounts, setAccounts] = useState<RegularSavingsAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    // TODO: real fetch call
    setAccounts([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { accounts, loading, refetch };
}