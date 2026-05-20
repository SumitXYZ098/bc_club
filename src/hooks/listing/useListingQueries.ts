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
  getFavouriteProperties,
  getMe,
  addToFavourite,
  getActiveListingById,
  getUnifiedListingById,
  addDdfFavorite,
  removeDdfFavorite,
  getMyDdfFavorites,
  removeFromFavourite,
  getActiveListings,
  getMapZoomListings,
  getImportPropertyList,
  getNearbyPlaces,
  getSimilarProperties,
  getSimilarSoldProperties,
  getSimilarAssignmentProperties,
  getSimilarAssignmentSoldProperties,
} from "@/src/api/listing/listingApi";
import Cookies from "js-cookie";

export const listingKeys = {
  all: ["listings"] as const,
  lists: () => [...listingKeys.all, "list"] as const,
  list: (params: any) => [...listingKeys.lists(), params] as const,
  details: () => [...listingKeys.all, "detail"] as const,
  detail: (id: string) => [...listingKeys.details(), id] as const,
  wishlists: () => [...listingKeys.all, "wishlist"] as const,
  wishlist: (params: any) => [...listingKeys.wishlists(), params] as const,
  favorites: () => [...listingKeys.all, "favorites"] as const,
  favorite: (params: any) => [...listingKeys.favorites(), params] as const,
  me: () => [...listingKeys.all, "me"] as const,
};

export function useGetListings<TData = any>(
  params: any,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: listingKeys.list(params),
    queryFn: () => getListings(params),
    ...options,
  });
}

export function useGetActiveListings<TData = any>(
  params?: any,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: listingKeys.list(params || {}),
    queryFn: () => getActiveListings(params),
    ...options,
  });
}

export function useGetMapZoomListings<TData = any>(
  params?: any,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["mapZoomListings", params || {}],
    queryFn: () => getMapZoomListings(params),
    ...options,
  });
}

export function useGetActiveListingById<TData = any>(
  id: string,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: listingKeys.detail(id),
    queryFn: () => getActiveListingById(id),
    enabled: !!id,
    ...options,
  });
}

export function useGetListingById<TData = any>(
  id: string,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: listingKeys.detail(id),
    queryFn: () => getListingById(id),
    enabled: !!id,
    ...options,
  });
}

export function useGetUnifiedListingById<TData = any>(
  id: string,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: listingKeys.detail(id),
    queryFn: () => getUnifiedListingById(id),
    enabled: !!id,
    ...options,
  });
}

export function useGetMe<TData = any>(
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  const token = Cookies.get("token");
  return useQuery<any, Error, TData, any>({
    queryKey: listingKeys.me(),
    queryFn: () => getMe(),
    enabled: !!token,
    ...options,
  });
}

// Wishlist properties

export function useGetWishlistProperties<TData = any>(
  params?: any,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: listingKeys.wishlist(params),
    queryFn: () => getFavouriteProperties(params),

    ...options,
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addToFavourite(id),
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
      toast.error(error.message || "Failed to update wishlist");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.wishlists() });
    },
    onSuccess: (resp) => {
      if (resp) {
        toast.success(resp.message || "Wishlist updated");
      }
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeFromFavourite(id),
    onMutate: async (newId) => {
      await queryClient.cancelQueries({ queryKey: listingKeys.me() });
      await queryClient.cancelQueries({ queryKey: listingKeys.wishlists() });

      const previousMe = queryClient.getQueryData(listingKeys.me());
      const previousWishlist = queryClient.getQueryData(
        listingKeys.wishlists(),
      );

      queryClient.setQueryData(listingKeys.me(), (old: any) => {
        if (!old) return old;
        const favorites = old.favorites ? [...old.favorites] : [];
        const newFavorites = favorites.filter(
          (item: any) => (item.documentId || item.id || item) !== newId,
        );
        return { ...old, favorites: newFavorites };
      });

      queryClient.setQueryData(listingKeys.wishlists(), (old: any) => {
        if (!old || !old.data) return old;
        const newData = old.data.filter(
          (item: any) => (item.documentId || item.id) !== newId,
        );
        return { ...old, data: newData };
      });

      return { previousMe, previousWishlist };
    },
    onError: (error: any, __, context: any) => {
      if (context?.previousMe) {
        queryClient.setQueryData(listingKeys.me(), context.previousMe);
      }
      if (context?.previousWishlist) {
        queryClient.setQueryData(
          listingKeys.wishlists(),
          context.previousWishlist,
        );
      }
      toast.error(error.message || "Failed to update wishlist");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.wishlists() });
    },
    onSuccess: () => { },
  });
}

// DDF Wishlist properties

export function useGetMyDdfFavorites<TData = any>(
  params?: any,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: [...listingKeys.wishlist(params), "ddf"],
    queryFn: () => getMyDdfFavorites(params),
    ...options,
  });
}

export function useToggleDdfWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addDdfFavorite(id),
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
      toast.error(error.message || "Failed to update wishlist");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [...listingKeys.wishlists(), "ddf"],
      });
    },
    onSuccess: () => { },
  });
}

export function useRemoveDdfWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeDdfFavorite(id),
    onMutate: async (newId) => {
      await queryClient.cancelQueries({ queryKey: listingKeys.me() });
      await queryClient.cancelQueries({
        queryKey: [...listingKeys.wishlists(), "ddf"],
      });

      const previousMe = queryClient.getQueryData(listingKeys.me());
      const previousWishlist = queryClient.getQueryData([
        ...listingKeys.wishlists(),
        "ddf",
      ]);

      queryClient.setQueryData(listingKeys.me(), (old: any) => {
        if (!old) return old;
        const favorites = old.favorites ? [...old.favorites] : [];
        const newFavorites = favorites.filter(
          (item: any) => (item.documentId || item.id || item) !== newId,
        );
        return { ...old, favorites: newFavorites };
      });

      queryClient.setQueryData(
        [...listingKeys.wishlists(), "ddf"],
        (old: any) => {
          if (!old || !old.data) return old;
          const newData = old.data.filter(
            (item: any) => (item.documentId || item.id) !== newId,
          );
          return { ...old, data: newData };
        },
      );

      return { previousMe, previousWishlist };
    },
    onError: (error: any, __, context: any) => {
      if (context?.previousMe) {
        queryClient.setQueryData(listingKeys.me(), context.previousMe);
      }
      if (context?.previousWishlist) {
        queryClient.setQueryData(
          [...listingKeys.wishlists(), "ddf"],
          context.previousWishlist,
        );
      }
      toast.error(error.message || "Failed to remove from wishlist");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [...listingKeys.wishlists(), "ddf"],
      });
    },
    onSuccess: () => { },
  });
}

export function useGetImportPropertyList<TData = any>(
  params?: { address?: string;[key: string]: any },
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["importPropertyList", params],
    queryFn: () => getImportPropertyList(params),
    enabled: !!params?.address && params.address.length > 1,
    ...options,
  });
}

// Get nearby places
export function useGetNearbyPlaces<TData = any>(
  id: string,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["nearbyPlaces", id],
    queryFn: () => getNearbyPlaces(id),
    enabled: !!id,
    ...options,
  });
}

// Similar Properties
export function useGetSimilarProperties<TData = any>(
  id: string,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["similarProperties", id],
    queryFn: () => getSimilarProperties(id),
    enabled: !!id,
    ...options,
  });
}

// Similar Sold Properties
export function useGetSimilarSoldProperties<TData = any>(
  id: string,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["similarSoldProperties", id],
    queryFn: () => getSimilarSoldProperties(id),
    enabled: !!id,
    ...options,
  });
}


// Similar Assignment Properties
export function useGetSimilarAssignmentProperties<TData = any>(
  id: string,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["similarAssignmentProperties", id],
    queryFn: () => getSimilarAssignmentProperties(id),
    enabled: !!id,
    ...options,
  });
}

// Similar Assignment Sold Properties
export function useGetSimilarAssignmentSoldProperties<TData = any>(
  id: string,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["similarAssignmentSoldProperties", id],
    queryFn: () => getSimilarAssignmentSoldProperties(id),
    enabled: !!id,
    ...options,
  });
}
