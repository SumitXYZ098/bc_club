import axios from "axios";
import { ListingsApiResponse } from "./listing.types";

export async function getListings(): Promise<ListingsApiResponse> {
  try {
    const res = await axios.get(
      "https://api.bridgedataoutput.com/api/v2/test/listings?access_token=6baca547742c6f96a6ff71b138424f21",
    );

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error.message);
    }
    throw new Error("An unexpected error occurred");
  }
}
