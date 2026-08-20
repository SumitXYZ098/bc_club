import {
  useQuery,
  UseQueryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getListings,
  getListingById,
  addRealEstateFavorite,
  removeRealEstateFavorite,
  getMyRealEstateFavorites,
  getNearbyRealEstatePlaces,
  getSimilarRealEstateProperties,
  getSimilarRealEstateSoldProperties,
  getRealEstatePropertiesListByAddress,
} from "@/src/api/listing/realEstateListing";
import { listingKeys } from "@/src/hooks/listing/useListingQueries";

export const realEstateListingKeys = {
  all: ["realEstateListings"] as const,
  lists: () => [...realEstateListingKeys.all, "list"] as const,
  list: (params: any) => [...realEstateListingKeys.lists(), params] as const,
  details: () => [...realEstateListingKeys.all, "detail"] as const,
  detail: (id: string) => [...realEstateListingKeys.details(), id] as const,
  favorites: () => [...realEstateListingKeys.all, "favorites"] as const,
  favorite: (params: any) => [...realEstateListingKeys.favorites(), params] as const,
};

export function useGetRealEstateListings<TData = any>(
  params?: any,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: realEstateListingKeys.list(params || {}),
    queryFn: () => getListings(params),
    ...options,
  });
}

export function useGetRealEstateListingById<TData = any>(
  id: string,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: realEstateListingKeys.detail(id),
    queryFn: () => getListingById(id),
    enabled: !!id,
    ...options,
  });
}

export function useGetMyRealEstateFavorites<TData = any>(
  params?: any,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: realEstateListingKeys.favorite(params),
    queryFn: () => getMyRealEstateFavorites(params),
    ...options,
  });
}

export function useToggleRealEstateFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addRealEstateFavorite(id),
    onMutate: async (newId) => {
      await queryClient.cancelQueries({ queryKey: listingKeys.me() });
      const previousMe = queryClient.getQueryData(listingKeys.me());

      queryClient.setQueryData(listingKeys.me(), (old: any) => {
        if (!old) return old;
        const favorites = old.favorites ? [...old.favorites] : [];
        const index = favorites.findIndex(
          (item: any) => (item.documentId || item.id || item) === newId,
        );

        if (index > -1) {
          favorites.splice(index, 1);
        } else {
          favorites.push({ documentId: newId });
        }

        return { ...old, favorites };
      });

      return { previousMe };
    },
    onError: (error: any, __, context: any) => {
      if (context?.previousMe) {
        queryClient.setQueryData(listingKeys.me(), context.previousMe);
      }
      toast.error(error.message || "Failed to update favorites");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: realEstateListingKeys.favorites(),
      });
    },
    onSuccess: (resp) => {
      if (resp) {
        toast.success(resp.message || "Favorites updated");
      }
    },
  });
}

export const useAddRealEstateFavorite = useToggleRealEstateFavorite;

export function useRemoveRealEstateFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeRealEstateFavorite(id),
    onMutate: async (newId) => {
      await queryClient.cancelQueries({ queryKey: listingKeys.me() });
      await queryClient.cancelQueries({
        queryKey: realEstateListingKeys.favorites(),
      });

      const previousMe = queryClient.getQueryData(listingKeys.me());
      const previousFavorites = queryClient.getQueryData(
        realEstateListingKeys.favorites(),
      );

      queryClient.setQueryData(listingKeys.me(), (old: any) => {
        if (!old) return old;
        const favorites = old.favorites ? [...old.favorites] : [];
        const newFavorites = favorites.filter(
          (item: any) => (item.documentId || item.id || item) !== newId,
        );
        return { ...old, favorites: newFavorites };
      });

      queryClient.setQueryData(
        realEstateListingKeys.favorites(),
        (old: any) => {
          if (!old || !old.data) return old;
          const newData = old.data.filter(
            (item: any) => (item.documentId || item.id) !== newId,
          );
          return { ...old, data: newData };
        },
      );

      return { previousMe, previousFavorites };
    },
    onError: (error: any, __, context: any) => {
      if (context?.previousMe) {
        queryClient.setQueryData(listingKeys.me(), context.previousMe);
      }
      if (context?.previousFavorites) {
        queryClient.setQueryData(
          realEstateListingKeys.favorites(),
          context.previousFavorites,
        );
      }
      toast.error(error.message || "Failed to remove from favorites");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: realEstateListingKeys.favorites(),
      });
    },
    onSuccess: () => {},
  });
}

export function useGetNearbyRealEstatePlaces<TData = any>(
  id: string,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["nearbyRealEstatePlaces", id],
    queryFn: () => getNearbyRealEstatePlaces(id),
    enabled: !!id,
    ...options,
  });
}

export function useGetSimilarRealEstateProperties<TData = any>(
  id: string,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["similarRealEstateProperties", id],
    queryFn: () => getSimilarRealEstateProperties(id),
    enabled: !!id,
    ...options,
  });
}

export function useGetSimilarRealEstateSoldProperties<TData = any>(
  id: string,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["similarRealEstateSoldProperties", id],
    queryFn: () => getSimilarRealEstateSoldProperties(id),
    enabled: !!id,
    ...options,
  });
}

export function useGetRealEstatePropertiesListByAddress<TData = any>(
  params?: { address?: string },
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["realEstatePropertiesListByAddress", params],
    queryFn: () => getRealEstatePropertiesListByAddress(params),
    enabled: !!params?.address && params.address.length > 1,
    ...options,
  });
}
