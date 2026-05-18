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
  importPropertyList: `${BASE_URL}/api/property-assignment-lists`,
  getActivePropertyLists: `${BASE_URL}/api/ddf-listings`,
  mapZoom: `${BASE_URL}/api/map-zoom`,
  getActiveListingById: (id: string) => `${BASE_URL}/api/ddf-listings/${id}`,
  addDdfFavorite: (id: string) =>
    `${BASE_URL}/api/ddf-listings/add-favorite/${id}`,
  removeDdfFavorite: (id: string) =>
    `${BASE_URL}/api/ddf-listings/remove-favorite/${id}`,
  getMyDdfFavorites: `${BASE_URL}/api/ddf-listings/my-favorites`,
  getNearbyPlaces: (id: string) =>
    `${BASE_URL}/api/ddf-listings/${id}/neighbourhood?radius=16000&limit=4`,
};
