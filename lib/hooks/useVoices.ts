import { useInfiniteQuery } from "@tanstack/react-query";
import { getVoices } from "../apiclient/voices";

export const useVoices = () => {
  return useInfiniteQuery({
    queryKey: ["voices"],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getVoices(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.has_more ? lastPage.next_page_token : undefined;
    },
    initialPageParam: undefined,
  });
};

