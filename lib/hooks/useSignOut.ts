import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export const useSignOut = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auth-status"] });
      qc.invalidateQueries({ queryKey: ["self"] });
      qc.invalidateQueries({ queryKey: ["scripts"] });
    },
  });
};

export default useSignOut;
