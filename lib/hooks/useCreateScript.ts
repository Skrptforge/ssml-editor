import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createScript } from "@/lib/apiclient/script/script";

export const useCreateScript = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      const res = await createScript(title);
      if (!res.success) throw new Error(res.error || "Failed to create script");
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scripts"] });
    },
  });
};

export default useCreateScript;
