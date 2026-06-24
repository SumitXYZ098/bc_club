const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const Endpoints = {
  getListing: `${BASE_URL}/api/properties`,
  getListingById: (id: string) => `${BASE_URL}/api/properties/${id}`,
  login: `${BASE_URL}/api/auth/login`,
  signup: `${BASE_URL}/api/register-with-role`,
  forgotPassword: `${BASE_URL}/api/password/forgot`,
  verifyOtp: `${BASE_URL}/api/password/verify-otp`,
  resetPassword: `${BASE_URL}/api/password/reset`,
  addToFavourite: (id: string) => `${BASE_URL}/api/properties/${id}/favorite`,
  getFavouriteProperties: `${BASE_URL}/api/my-favorites`,
  me: `${BASE_URL}/api/users/me`,
  getActivePropertyLists: `${BASE_URL}/api/ddf-listings`,
  mapZoom: `${BASE_URL}/api/map-zoom`,
  mapZoomWithClusters: `${BASE_URL}/api/ddf-listings/map-zoom-clusters`,
  getActiveListingById: (id: string) => `${BASE_URL}/api/ddf-listings/${id}`,
  addDdfFavorite: (id: string) =>
    `${BASE_URL}/api/ddf-listings/add-favorite/${id}`,
  removeDdfFavorite: (id: string) =>
    `${BASE_URL}/api/ddf-listings/remove-favorite/${id}`,
  getMyDdfFavorites: `${BASE_URL}/api/ddf-listings/my-favorites`,
  getNearbyPlaces: (id: string) =>
    `${BASE_URL}/api/ddf-listings/${id}/neighborhood?radius=16000&limit=6`,
  getSimilarProperties: (id: string) =>
    `${BASE_URL}/api/ddf-listings/${id}/similar?radiusKm=5&limit=20`,
  getSimilarSoldProperties: (id: string) =>
    `${BASE_URL}/api/properties/${id}/similar-sold?radiusKm=5&limit=20`,

  getAssessmentPropertiesList: `${BASE_URL}/api/property-assignment-lists`,
  getPropertiesAssignmentDetails: (id: string) =>
    `${BASE_URL}/api/property-assignment-lists/${id}`,
  getSimilarAssignmentProperties: (id: string) =>
    `${BASE_URL}/api/property-assignment-lists/${id}/similar?radius=10&limit=20`,
  getSimilarAssignmentSoldProperties: (id: string) =>
    `${BASE_URL}/api/property-assignment-lists/${id}/similar-sold?radiusKm=10&limit=20`,
  getDDFPropertiesListByAddress: `${BASE_URL}/api/ddf-listings/search-by-address`,

  // Sale Report
  getSaleReport: `${BASE_URL}/api/sales-reported`,

  // MapZoom
  getMapZoomAssignmentList: `${BASE_URL}/api/property-assignment-lists/map-zoom`,
  getMapZoomSold: `${BASE_URL}/api/properties/sold/map-zoom`,
  getMapZoomSchools: `${BASE_URL}/api/schools/map-zoom`,

  // Flood Province
  getFloodProvinceGeoJSON: `${BASE_URL}/api/flood-province/findGeoJSON`,
};
