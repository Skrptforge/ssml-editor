import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateScript } from "@/lib/apiclient/script/script";

type UpdateScriptParam = Parameters<typeof updateScript>[1];

export const useUpdateScript = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: UpdateScriptParam; }) => {
      const res = await updateScript(id, updates);
      if (!res.success) throw new Error(res.error || "Failed to update script");
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scripts"] });
    },
  });
};

export default useUpdateScript;
