import axios from "axios";
import { Endpoints } from "../endpoints";
import Cookies from "js-cookie";

export async function getListings(params?: any): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getRealEstatePropertiesList, {
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

export async function getListingById(id: string): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getRealEstatePropertiesListById(id));

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

// Real Estate Favorites
export async function addRealEstateFavorite(id: string): Promise<any> {
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
      Endpoints.addRealEstateFavorite(id),
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

export async function removeRealEstateFavorite(id: string): Promise<any> {
  const token = Cookies.get("token");
  try {
    const res = await axios.delete(Endpoints.removeRealEstateFavorite(id), {
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

export async function getMyRealEstateFavorites(params?: any): Promise<any> {
  const token = Cookies.get("token");
  try {
    const res = await axios.get(Endpoints.getMyRealEstateFavorites, {
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
export async function getNearbyRealEstatePlaces(id: string): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getNearbyRealEstatePlaces(id));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

// Similar Properties
export async function getSimilarRealEstateProperties(id: string): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getSimilarRealEstateProperties(id));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

// Similar Sold Properties
export async function getSimilarRealEstateSoldProperties(
  id: string,
): Promise<any> {
  try {
    const res = await axios.get(
      Endpoints.getSimilarRealEstateSoldProperties(id),
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function getRealEstatePropertiesListByAddress(params?: {
  address?: string;
}): Promise<any> {
  try {
    const res = await axios.post(
      Endpoints.getRealEstatePropertiesListByAddress,
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
