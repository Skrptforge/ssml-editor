import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export const useAuthStatus = () => {
  return useQuery({
    queryKey: ["auth-status"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session;
    },
    refetchInterval: 30000,
  });
};

export const useUser = () => {
  const { data: session } = useAuthStatus();
  return useQuery({
    queryKey: ["self"],
    queryFn: async () => {
      const supabase = createClient();
      const user = await supabase.auth.getUser();
      return user.data.user?.user_metadata ?? null;
    },
    enabled: Boolean(session),
    placeholderData: null,
  });
};

export default useAuthStatus;
