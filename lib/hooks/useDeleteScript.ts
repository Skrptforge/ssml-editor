import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteScript } from "@/lib/apiclient/script/script";

export const useDeleteScript = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteScript(id);
      if (!res.success) throw new Error(res.error || "Failed to delete script");
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scripts"] });
    },
  });
};

export default useDeleteScript;
