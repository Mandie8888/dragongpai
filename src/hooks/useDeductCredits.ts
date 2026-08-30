// src/hooks/useDeductCredits.ts
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useDeductCredits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDeducting, setIsDeducting] = useState(false);

  const deductCredits = async (amount: number = 1): Promise<boolean> => {
    if (!user) {
      toast({ title: "Please log in to use this feature", variant: "destructive" });
      return false;
    }

    setIsDeducting(true);
    try {
      const { data, error } = await supabase.rpc('deduct_credits', {
        p_user_id: user.id,
        p_amount: amount
      });

      if (error) {
        toast({ title: "Failed to deduct credits", variant: "destructive" });
        return false;
      }

      return true;
    } catch (error) {
      toast({ title: "Failed to deduct credits", variant: "destructive" });
      return false;
    } finally {
      setIsDeducting(false);
    }
  };

  return { deductCredits, isDeducting };
};