import { useInfiniteQuery } from '@tanstack/react-query';
import { appsService } from '~/external/api/services';
import { APPS_QUERY_KEY } from './queryKeys';
import { useUser } from '@stackframe/react';

// fetch all apps with pagination
export function useAppsList() {
  const user = useUser();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: APPS_QUERY_KEY,
    enabled: !!user,
    queryFn: async ({ pageParam = 1 }) => {
      return await appsService.fetchApps(pageParam);
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const apps = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    apps,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoadingApps: isLoading,
    appsError: error,
  };
}
