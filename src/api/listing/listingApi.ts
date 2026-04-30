import axios from "axios";
import { Endpoints } from "../endpoints";
import Cookies from "js-cookie";

export async function getListings(params: any): Promise<any> {
  try {
    // Explicitly request office_name along with existing populations
    const enhancedParams = { ...params };
    // Usually Strapi might need explicit fields if they are somehow excluded
    if (!enhancedParams.populate) enhancedParams.populate = "*";

    const res = await axios.get(Endpoints.getListing, {
      params: enhancedParams,
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
    const enhancedParams = { ...params };
    if (!enhancedParams.populate) enhancedParams.populate = "*";

    const res = await axios.get(Endpoints.getActivePropertyLists, {
      params: enhancedParams,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error.message);
    }
    throw new Error("An unexpected error occurred");
  }
}

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
    console.log("Listing API Response:", res.data);
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

  console.log("DDF Favorite Payload:", { DocumentID: id, userId: userId });

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
    console.log("DDF Favorite Response:", res.data);
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
