const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const Endpoints = {
  getListing: `${BASE_URL}/api/properties`,
  getListingById: (id: string) => `${BASE_URL}/api/properties/${id}`,

};
