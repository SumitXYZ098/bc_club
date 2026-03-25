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

export async function getListingById(id: string): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getListingById(id));
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
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
export async function getFavouriteProperties(): Promise<any> {
  const token = Cookies.get("token");
  try {
    const res = await axios.get(Endpoints.getFavouriteProperties, {
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
