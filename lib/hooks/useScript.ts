import { useQuery } from "@tanstack/react-query";
import { getScriptById } from "@/lib/apiclient/script/script";

export const useScript = (id?: string) => {
  return useQuery({
    queryKey: ["script", id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (typeof id !== "number") throw new Error("Missing script id");
      const res = await getScriptById(id);
      if (!res.success) throw new Error(res.error || "Failed to fetch script");
      return res.data;
    },
  });
};

export default useScript;
