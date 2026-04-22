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
  removeFromFavourite,
  getActiveListings,
  getActiveListingById,
} from "@/src/api/listing/listingApi";
import Cookies from "js-cookie";

export const listingKeys = {
  all: ["listings"] as const,
  lists: () => [...listingKeys.all, "list"] as const,
  list: (params: any) => [...listingKeys.lists(), params] as const,
  details: () => [...listingKeys.all, "detail"] as const,
  detail: (id: string) => [...listingKeys.details(), id] as const,
  wishlist: () => [...listingKeys.all, "wishlist"] as const,
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
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: listingKeys.lists(),
    queryFn: () => getActiveListings(),
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

export function useGetWishlistProperties<TData = any>(
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: listingKeys.wishlist(),
    queryFn: () => getFavouriteProperties(),
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

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addToFavourite(id),
    onMutate: async (newId) => {
      await queryClient.cancelQueries({ queryKey: listingKeys.me() });
      const previousMe = queryClient.getQueryData(listingKeys.me());

      queryClient.setQueryData(listingKeys.me(), (old: any) => {
        if (!old || !old.favorites) return old;
        const favorites = [...old.favorites];
        const index = favorites.findIndex(
          (item: any) => item.documentId === newId,
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
      queryClient.invalidateQueries({ queryKey: listingKeys.me() });
      queryClient.invalidateQueries({ queryKey: listingKeys.wishlist() });
    },
    onSuccess: (resp) => {
      if (resp) {
        console.log(
          `Property ${resp.message === "Added to Favorites" ? "added to" : "removed from"} wishlist`,
        );
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
      await queryClient.cancelQueries({ queryKey: listingKeys.wishlist() });

      const previousMe = queryClient.getQueryData(listingKeys.me());
      const previousWishlist = queryClient.getQueryData(listingKeys.wishlist());

      queryClient.setQueryData(listingKeys.me(), (old: any) => {
        if (!old || !old.favorites) return old;
        const favorites = [...old.favorites];
        const index = favorites.findIndex(
          (item: any) => item.documentId === newId,
        );

        if (index > -1) {
          favorites.splice(index, 1);
        }

        return { ...old, favorites };
      });

      queryClient.setQueryData(listingKeys.wishlist(), (old: any) => {
        if (!old || !old.data) return old;
        const newData = old.data.filter(
          (item: any) => item.documentId !== newId,
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
          listingKeys.wishlist(),
          context.previousWishlist,
        );
      }
      toast.error(error.message || "Failed to update wishlist");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.me() });
      queryClient.invalidateQueries({ queryKey: listingKeys.wishlist() });
    },
    onSuccess: (resp) => {
      if (resp) {
        console.log(
          `Property ${resp.message === "Removed from favorites" ? "removed from" : "added to"} wishlist`,
        );
      }
    },
  });
}
