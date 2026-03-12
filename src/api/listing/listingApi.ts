import axios from "axios";
import { ListingsApiResponse } from "./listing.types";

export async function getListings(): Promise<ListingsApiResponse> {
  try {
    const res = await axios.get(
      "https://backendbcclub.xyzdemowebsites.com/api/properties",
    );

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
    const res = await axios.get(
      `https://backendbcclub.xyzdemowebsites.com/api/properties/${id}`,
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || "API error");
    }
    throw new Error("An unexpected error occurred");
  }
}
