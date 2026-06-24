import axios from "axios";
import { Endpoints } from "../endpoints";
import Cookies from "js-cookie";

export async function getListings(params: any): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getListing, {
      params,
    });

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error.message);
    }
    throw new Error("An unexpected error occurred");
  }
}

// GETACTIVELIST API

export async function getActiveListings(params?: any): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getActivePropertyLists, {
      params,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error.message);
    }
    throw new Error("An unexpected error occurred");
  }
}
// Map Zoom Listings
export async function getMapZoomListings(params?: any): Promise<any> {
  try {
    const res = await axios.get(Endpoints.mapZoom, { params });

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

// Map Zoom With Cluster
export async function getMapZoomWithClusters(params?: any): Promise<any> {
  try {
    const res = await axios.get(Endpoints.mapZoomWithClusters, { params });

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

// Map Zoom Properties
export async function getMapZoomProperties(params?: any): Promise<any> {
  try {
    const res = await axios.get(Endpoints.mapZoomProperties, { params });

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

// Map Zoom Assignment List
export async function getMapZoomAssignmentList(params?: any): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getMapZoomAssignmentList, {
      params,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error.message);
    }
    throw new Error("An unexpected error occurred");
  }
}

// Map Zoom Sold List
export async function getMapZoomSoldList(params?: any): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getMapZoomSold, {
      params,
    });

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error.message);
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function getActiveListingById(id: string): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getActiveListingById(id));

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function getListingById(id: string): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getListingById(id));
    return res.data;
  } catch (error) {
    console.error("Error fetching listing:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function getUnifiedListingById(id: string): Promise<any> {
  try {
    // Try active listing first
    const res = await getActiveListingById(id);
    return res;
  } catch (error) {
    // If it fails, try normal listing
    const res = await getListingById(id);
    return res;
  }
}

// Add to favourite property
export async function addToFavourite(id: string): Promise<any> {
  const token = Cookies.get("token");
  try {
    const res = await axios.post(
      Endpoints.addToFavourite(id),
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

// Remove from favourite property
export async function removeFromFavourite(id: string): Promise<any> {
  const token = Cookies.get("token");
  try {
    const res = await axios.delete(Endpoints.addToFavourite(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

// Get my favourite properties
export async function getFavouriteProperties(params?: any): Promise<any> {
  const token = Cookies.get("token");
  try {
    const res = await axios.get(Endpoints.getFavouriteProperties, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

// Get me
export async function getMe(): Promise<any> {
  const token = Cookies.get("token");
  try {
    const res = await axios.get(Endpoints.me, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

// DDF Favorites
export async function addDdfFavorite(id: string): Promise<any> {
  const token = Cookies.get("token");
  const userCookie = Cookies.get("username");
  let userId = null;

  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      userId = user.id || user.documentId;
    } catch (e) {
      console.error("Error parsing user cookie", e);
    }
  }

  try {
    const res = await axios.post(
      Endpoints.addDdfFavorite(id),
      {
        DocumentID: id,
        userId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function removeDdfFavorite(id: string): Promise<any> {
  const token = Cookies.get("token");
  try {
    const res = await axios.delete(Endpoints.removeDdfFavorite(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function getMyDdfFavorites(params?: any): Promise<any> {
  const token = Cookies.get("token");
  try {
    const res = await axios.get(Endpoints.getMyDdfFavorites, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

// Get nearby places
export async function getNearbyPlaces(id: string): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getNearbyPlaces(id));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

// Similar Properties
export async function getSimilarProperties(id: string): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getSimilarProperties(id));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

// Similar Sold Properties
export async function getSimilarSoldProperties(id: string): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getSimilarSoldProperties(id));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

// Similar Assignment Properties
export async function getSimilarAssignmentProperties(id: string): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getSimilarAssignmentProperties(id));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

// Similar Assignment Sold Properties
export async function getSimilarAssignmentSoldProperties(
  id: string,
): Promise<any> {
  try {
    const res = await axios.get(
      Endpoints.getSimilarAssignmentSoldProperties(id),
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

// Get import property list (address search)
export async function getAssessmentPropertiesList(params?: {
  address?: string;
}): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getAssessmentPropertiesList, {
      params,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function getPropertiesAssignmentDetails(id: string): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getPropertiesAssignmentDetails(id));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function getDDFPropertiesListByAddress(params?: {
  address?: string;
}): Promise<any> {
  try {
    const res = await axios.post(
      Endpoints.getDDFPropertiesListByAddress,
      null,
      { params },
    );

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

// Sale Report
export async function getSalesReported(params?: {
  location?: string;
  days?: string;
}): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getSaleReport, {
      params,
    });

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

// School List
export async function getMapZoomSchools(params?: any): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getMapZoomSchools, { params });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}
