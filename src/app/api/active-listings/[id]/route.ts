import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const response = await axios.get(`${BASE_URL}/api/ddf-listings/${id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching active listing:", error?.response?.data || error.message);
    return NextResponse.json(
      { error: error?.response?.data?.error?.message || "Failed to fetch listing" },
      { status: error?.response?.status || 500 }
    );
  }
}
