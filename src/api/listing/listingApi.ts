import axios from "axios";
import { Endpoints } from "../endpoints";
import Cookies from "js-cookie";

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

// Sold Market Summary
export async function getSoldMarketSummary(params?: {
  location?: string;
}): Promise<any> {
  try {
    const res = await axios.get(Endpoints.getSoldSummary, {
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
