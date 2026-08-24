import {
  useQuery,
  UseQueryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getMe,
  getAssessmentPropertiesList,
  getSimilarAssignmentProperties,
  getSimilarAssignmentSoldProperties,
  getPropertiesAssignmentDetails,
  getDDFPropertiesListByAddress,
  getSalesReported,
  getSoldMarketSummary,
  getMapZoomAssignmentList,
  getMapZoomSoldList,
  getMapZoomSchools,
  getMapZoomWithClusters,
  getMapZoomProperties,
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

// Map Zoom With Clusters
export function useGetMapZoomWithClusters<TData = any>(
  params?: any,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["mapZoomWithClusters", params || {}],
    queryFn: () => getMapZoomWithClusters(params),
    ...options,
  });
}

// Map Zoom Properties
export function useGetMapZoomProperties<TData = any>(
  params?: any,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["mapZoomProperties", params || {}],
    queryFn: () => getMapZoomProperties(params),
    ...options,
  });
}

// Map Zoom Assignment List
export function useGetMapZoomAssignmentList<TData = any>(
  params?: any,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["mapZoomAssignmentList", params || {}],
    queryFn: () => getMapZoomAssignmentList(params),
    ...options,
  });
}

// Map Zoom Sold List
export function useGetMapZoomSoldList<TData = any>(
  params?: any,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["mapZoomSoldList", params || {}],
    queryFn: () => getMapZoomSoldList(params),
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

export function useGetAssessmentPropertiesList<TData = any>(
  params?: { address?: string },
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["assessmentPropertiesList", params],
    queryFn: () => getAssessmentPropertiesList(params),
    enabled: !!params?.address && params.address.length > 1,
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

// Properties Assignment Details
export function useGetPropertiesAssignmentDetails<TData = any>(
  id: string,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["propertiesAssignmentDetails", id],
    queryFn: () => getPropertiesAssignmentDetails(id),
    enabled: !!id,
    ...options,
  });
}

// Get DDF Properties List By Address
export function useGetDDFPropertiesListByAddress<TData = any>(
  params?: { address?: string },
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["ddfPropertiesListByAddress", params],
    queryFn: () => getDDFPropertiesListByAddress(params),
    enabled: !!params?.address && params.address.length > 1,
    ...options,
  });
}

// Sale Report
export function useGetSalesReported<TData = any>(
  params?: { location?: string; days?: string },
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["saleReported", params],
    queryFn: () => getSalesReported(params),
    ...options,
  });
}

// Sold Market Summary
export function useGetSoldMarketSummary<TData = any>(
  params?: { location?: string },
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["soldMarketSummary", params],
    queryFn: () => getSoldMarketSummary(params),
    ...options,
  });
}

// School MapZoom
export function useGetMapZoomSchools<TData = any>(
  params?: any,
  options?: Omit<
    UseQueryOptions<any, Error, TData, any>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<any, Error, TData, any>({
    queryKey: ["mapZoomSchools", params || {}],
    queryFn: () => getMapZoomSchools(params),
    ...options,
  });
}
