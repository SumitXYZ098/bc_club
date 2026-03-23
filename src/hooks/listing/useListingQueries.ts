import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getListings, getListingById } from '@/src/api/listing/listingApi';

export const listingKeys = {
  all: ['listings'] as const,
  lists: () => [...listingKeys.all, 'list'] as const,
  list: (params: any) => [...listingKeys.lists(), params] as const,
  details: () => [...listingKeys.all, 'detail'] as const,
  detail: (id: string) => [...listingKeys.details(), id] as const,
};

export function useGetListings<TData = any>(
  params: any,
  options?: Omit<UseQueryOptions<any, Error, TData, any>, 'queryKey' | 'queryFn'>
) {
  return useQuery<any, Error, TData, any>({
    queryKey: listingKeys.list(params),
    queryFn: () => getListings(params),
    ...options,
  });
}

export function useGetListingById<TData = any>(
  id: string,
  options?: Omit<UseQueryOptions<any, Error, TData, any>, 'queryKey' | 'queryFn'>
) {
  return useQuery<any, Error, TData, any>({
    queryKey: listingKeys.detail(id),
    queryFn: () => getListingById(id),
    enabled: !!id,
    ...options,
  });
}
