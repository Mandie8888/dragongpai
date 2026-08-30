// src/hooks/useCredits.ts
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isPromoActive, PROMO_CREDITS, STANDARD_CREDITS } from "@/lib/promo";
import { useToast } from "@/hooks/use-toast";

const getGiftCredits = () => isPromoActive() ? PROMO_CREDITS : STANDARD_CREDITS;

export const useCredits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isDeducting, setIsDeducting] = useState(false);

  const claimPendingBonuses = async (currentBalance: number): Promise<number> => {
    if (!user?.email) return currentBalance;
    try {
      const { data: pending, error } = await supabase
        .from("pending_bonus_credits")
        .select("id, bonus_credits")
        .eq("claimed", false);

      if (error || !pending || pending.length === 0) return currentBalance;

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
          .update({ credit_balance: newBalance, updated_at: new Date().toISOString() })
          .eq("user_id", user.id);
        return newBalance;
      }
      return currentBalance;
    } catch (error) {
      console.error("Error claiming bonuses:", error);
      return currentBalance;
    }
  };

  const fetchCredits = useCallback(async () => {
    if (!user) {
      setCredits(0);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
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
        const { data: inserted, error: insertError } = await supabase
          .from("user_credits")
          .insert({ user_id: user.id, credit_balance: gift })
          .select("credit_balance")
          .single();
        
        if (insertError) {
          console.error("Error creating credits:", insertError);
          balance = gift;
        } else {
          balance = inserted?.credit_balance ?? gift;
        }
      }

      // Auto-claim any pending bonus credits
      balance = await claimPendingBonuses(balance);
      setCredits(balance);
    } catch (error) {
      console.error("Error fetching credits:", error);
      setCredits(0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deductCredits = useCallback(async (amount: number = 1): Promise<boolean> => {
    if (!user) {
      toast?.({ 
        title: "Please log in to use this feature", 
        variant: "destructive" 
      });
      return false;
    }

    setIsDeducting(true);
    try {
      const { data, error } = await supabase.rpc('deduct_credits', {
        p_user_id: user.id,
        p_amount: amount
      });

      if (error) {
        console.error('Credit deduction error:', error);
        toast?.({ 
          title: "Failed to deduct credits", 
          description: error.message,
          variant: "destructive" 
        });
        return false;
      }

      // Update local credits
      setCredits(prev => Math.max(0, prev - amount));
      return data === true;
    } catch (error) {
      console.error('Credit deduction error:', error);
      toast?.({ 
        title: "Failed to deduct credits", 
        variant: "destructive" 
      });
      return false;
    } finally {
      setIsDeducting(false);
    }
  }, [user, toast]);

  const refreshCredits = useCallback(async () => {
    await fetchCredits();
  }, [fetchCredits]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return { 
    credits, 
    loading, 
    isDeducting,
    refetch: fetchCredits,
    deductCredits,
    refreshCredits
  };
};