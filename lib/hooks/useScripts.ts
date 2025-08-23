import { useInfiniteQuery } from "@tanstack/react-query";
import { getScripts } from "@/lib/apiclient/script/script";

export const useScripts = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["scripts"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await getScripts(pageParam, limit);
      if (!res.success) throw new Error(res.error || "Failed to fetch scripts");
      return res.data ?? [];
    },
    getNextPageParam: (lastPage, pages) => {
      // lastPage is an array of scripts; if length < limit then no more
      if (!lastPage || lastPage.length < limit) return undefined;
      return pages.length; // next page index
    },
    initialPageParam: 0,
  });
};

export default useScripts;
