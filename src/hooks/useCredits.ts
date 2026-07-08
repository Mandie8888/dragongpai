import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isPromoActive, PROMO_CREDITS, STANDARD_CREDITS } from "@/lib/promo";

const getGiftCredits = () => isPromoActive() ? PROMO_CREDITS : STANDARD_CREDITS;

export const useCredits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const claimPendingBonuses = async (currentBalance: number): Promise<number> => {
    if (!user?.email) return currentBalance;
    const { data: pending } = await supabase
      .from("pending_bonus_credits")
      .select("id, bonus_credits")
      .eq("claimed", false);

    if (!pending || pending.length === 0) return currentBalance;

    let totalBonus = 0;
    for (const row of pending) {
      totalBonus += row.bonus_credits;
      await supabase
        .from("pending_bonus_credits")
        .update({ claimed: true })
        .eq("id", row.id);
    }

    if (totalBonus > 0) {
      const newBalance = currentBalance + totalBonus;
      await supabase
        .from("user_credits")
        .update({ credit_balance: newBalance, updated_at: new Date().toISOString() } as any)
        .eq("user_id", user.id);
      return newBalance;
    }
    return currentBalance;
  };

  const fetchCredits = async () => {
    if (!user) {
      setCredits(0);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("user_credits")
      .select("credit_balance")
      .eq("user_id", user.id)
      .maybeSingle();

    let balance: number;
    if (data) {
      balance = data.credit_balance;
    } else {
      // First time — grant gift credits (promo-aware)
      const gift = getGiftCredits();
      const { data: inserted } = await supabase
        .from("user_credits")
        .insert({ user_id: user.id, credit_balance: gift })
        .select("credit_balance")
        .single();
      balance = inserted?.credit_balance ?? gift;
    }

    // Auto-claim any pending bonus credits
    balance = await claimPendingBonuses(balance);
    setCredits(balance);
    setLoading(false);
  };

  useEffect(() => {
    fetchCredits();
  }, [user]);

  return { credits, loading, refetch: fetchCredits };
};
