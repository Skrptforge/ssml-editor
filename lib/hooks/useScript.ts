import { useQuery } from "@tanstack/react-query";
import { getScriptById } from "@/lib/apiclient/script/script";

export const useScript = (id?: string | undefined) => {
  return useQuery({
    queryKey: ["script", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await getScriptById(id as string);
      if (!res.success) throw new Error(res.error || "Failed to fetch script");
      return res.data;
    },
    staleTime: 2000,
  });
};

export default useScript;
