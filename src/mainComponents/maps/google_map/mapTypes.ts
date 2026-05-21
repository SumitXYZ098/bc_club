export type MapBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
  zoom: number;
};

export type MapProperty = {
  id: string;
  image?: string;
  title: string;
  price: number;
  daysAgo: number;
  address: string;
  city: string;
  province: string;
  sqft: number;
  beds: number;
  baths: number;
  longitude: number;
  latitude: number;
  oldPrice?:number;
  mls?: string;
  realtor?: string;
  isLogin?: boolean;
  isFavourite?: boolean;
  likesCount?: number;
  isDdf?: boolean;
  priceDrop?: number;
  assessedDiff?: number;
};

export type ActiveFilterPill = {
  label: string;
  onRemove: () => void;
};
