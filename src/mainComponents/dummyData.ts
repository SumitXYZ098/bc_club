import dayjs from "dayjs";
import { Images } from "../app/exports";
import { TableHeader } from "../components/common/dynamicTable/DynamicTable";
import { PropertyCardProps } from "../components/common/propertiesCard/PropertiesCard";
import { getTime } from "../utilities/utilities";

export const propertyData: PropertyCardProps[] = [
  {
    id: "1",
    title: "Apartment/Condo",
    price: 350000,
    daysAgo: 10,
    image: Images.apartment,
    address: "1056 Nicola St, Vancouver, BC V6G 2E1, Canada",
    sqft: "1200",
    beds: 2,
    baths: 2,
    priceDrop: 10,
    assessedDiff: -1,
    realtor: "Jane Smith / Smith Realty Group",
    mls: "R3059142",
  },
  {
    id: "2",
    title: "Townhouse",
    price: 450000,
    daysAgo: 10,
    image: Images.townHouse,
    address: "1690 Nelson St., Vancouver, BC V6G 1M5, Canada",
    sqft: "1500",
    beds: 4,
    baths: 3,
    priceDrop: 10,
    assessedDiff: 5,
    realtor: "Jane Smith / Smith Realty Group",
    mls: "R3059999",
  },
  {
    id: "3",
    title: "Single Family Residence ",
    price: 555000,
    daysAgo: 10,
    image: Images.singleFamily,
    address: "10941 141a St, Surrey, BC V3R 7R8, Canada",
    sqft: "1200",
    beds: 4,
    baths: 3,
    priceDrop: 10,
    assessedDiff: 3,
    realtor: "Jane Smith / Smith Realty Group",
    mls: "R3059999",
  },
  {
    id: "4",
    title: "Townhouse",
    price: 450000,
    daysAgo: 10,
    image: Images.condoTwo,
    address: "11021 136 St, Surrey, BC V3R 3B2, Canada",
    sqft: "1500",
    beds: 4,
    baths: 3,
    priceDrop: 10,
    assessedDiff: 5,
    realtor: "Jane Smith / Smith Realty Group",
    mls: "R3059999",
  },
  {
    id: "5",
    title: "Apartment/Condo",
    price: 350000,
    daysAgo: 10,
    image: Images.singleFamilyTwo,
    address: "519 Union St, Vancouver, BC V6A 2B7, Canada",
    sqft: "1200",
    beds: 2,
    baths: 2,
    priceDrop: 10,
    assessedDiff: -1,
    realtor: "Jane Smith / Smith Realty Group",
    mls: "R3059142",
  },
  {
    id: "6",
    title: "Single Family Residence ",
    price: 555000,
    daysAgo: 10,
    image: Images.singleFamilyThree,
    address: "4080 Littlewood Ave, Burnaby, BC V5G 3N4, Canada",
    sqft: "1200",
    beds: 4,
    baths: 3,
    priceDrop: 10,
    assessedDiff: 3,
    realtor: "Jane Smith / Smith Realty Group",
    mls: "R3059999",
  },
  {
    id: "7",
    title: "Apartment/Condo",
    price: 350000,
    daysAgo: 10,
    image: Images.condoTwo,
    address: "4805 Baytree Ct, Burnaby, BC V5G 4H1, Canada",
    sqft: "1200",
    beds: 2,
    baths: 2,
    priceDrop: 10,
    assessedDiff: -1,
    realtor: "Jane Smith / Smith Realty Group",
    mls: "R3059142",
  },
];

export const dummyListings = [
  {
    id: 1,
    address: "90 Highland Dr #W/Sea, Orangeville, Ontario, Canada",
    beds: 2,
    baths: 5,
  },
  {
    id: 2,
    address: "2185 11th Concession W/Se, Trent Hills, Ontario, Canada",
    beds: 2,
    baths: 1,
  },
  {
    id: 3,
    address: "32 Weston Rd, Toronto, Ontario, Canada",
    beds: 3,
    baths: 2,
  },
  {
    id: 4,
    address: "32 Weston Rd, Toronto, Canada",
    beds: 3,
    baths: 2,
  },
  {
    id: 6,
    address: "90 Highland Dr #W/Sea, , Ontario, Canada",
    beds: 5,
    baths: 4,
  },
  {
    id: 7,
    address: "90 12th Concession W/Se, Ontario, Canada",
    beds: 5,
    baths: 4,
  },
  {
    id: 8,
    address: "9045 Weston Rd, Concession W/Se, BC, Canada",
    beds: 5,
    baths: 4,
  },
  {
    id: 9,
    address: "113 13TH AVE S CRANBROOK V1C 2V6",
    beds: 5,
    baths: 4,
  },
];

export const propertyDetails = {
  land: { label: "Land", value: 176000 },
  description: { label: "Description", value: 42400 },
  bedrooms: { label: "Bedrooms", value: 42400 },
  baths: { label: "Baths", value: 42400 },
  carports: { label: "Carports", value: 42400 },
  garages: { label: "Garages", value: 42400 },
  landSize: { label: "Land Size", value: 42400 },
  firstFloorArea: { label: "First Floor Area", value: 42400 },
  secondFloorArea: { label: "Second Floor Area", value: 198400 },
  basementFinishArea: { label: "Basement Finish Area", value: 156000 },
  buildingStoreys: { label: "Building Storeys", value: 42400 },
  grossLeasableArea: { label: "Gross Leasable Area", value: 42400 },
  netLeasableArea: { label: "Net Leasable Area", value: 42400 },
  numberOfApartmentUnits: { label: "No. of Apartment Units", value: 42400 },
};

export const propertyImages = [
  Images.apartment,
  Images.apartment,
  Images.apartment,
  Images.apartment,
  Images.apartment,
  Images.apartment,
];

export const propertyDetailsHeaders: TableHeader[] = [
  { key: "label", label: "" },
  { key: "value", label: "", align: "right" },
];

export const calculatePropertyAge = (yearBuilt: number | string) => {
  if (!yearBuilt) return null;

  const currentYear = new Date().getFullYear();
  return currentYear - Number(yearBuilt);
};

export const getPropertyDetailsRows = (property: any) => [
  {
    data: {
      label: "Property Type",
      value: property?.property_sub_type || "-",
    },
  },
  {
    data: {
      label: "Bedrooms",
      value: property?.bedrooms ?? "-",
    },
  },
  {
    data: {
      label: "Bathrooms",
      value: property?.bathrooms ?? "-",
    },
  },
  {
    data: {
      label: "Asking Price",
      value: property?.price
        ? `$${Number(property.price).toLocaleString()}`
        : "-",
    },
  },
  {
    data: {
      label: "Maintenance Fee",
      value: property?.raw_data?.AssociationFee
        ? `$${property.raw_data.AssociationFee}`
        : "-",
    },
  },
  {
    data: {
      label: "Listing Date",
      value: property?.ModificationTimestamp
        ? dayjs(property.ModificationTimestamp).format("DD MMM, YYYY")
        : "-",
    },
    subRows: [
      {
        data: {
          label: "Days On Market",
          value: property?.ModificationTimestamp
            ? `${getTime(property.ModificationTimestamp)}`
            : "-",
        },
      },
      {
        data: {
          label: "Status",
          value: property?.standard_status || "-",
        },
      },
    ],
  },
  {
    data: {
      label: "Floor Area",
      value:
        property?.Living_area || property?.area
          ? `${property?.Living_area || property?.area} sqft`
          : "-",
    },
    subRows: [
      {
        data: {
          label: "Price per SqFt",
          value:
            property?.price && property?.area
              ? `$${Math.round(property.price / property.area)}`
              : "-",
        },
      },
    ],
  },
  {
    data: {
      label: "Year Built",
      value: property?.raw_data?.YearBuilt || "-",
    },
  },
  {
    data: {
      label: "Age",
      value: property?.raw_data?.YearBuilt
        ? `${calculatePropertyAge(property.raw_data.YearBuilt)} Years Old`
        : "-",
    },
  },
  {
    data: {
      label: "Property Taxes",
      value: property?.annual_tax ? `$${property.annual_tax}` : "-",
    },
  },
  {
    data: {
      label: "Ownership",
      value: property?.raw_data?.CommonInterest || "-",
    },
  },
  {
    data: {
      label: "MLS Number",
      value: property?.listing_id || property?.mls_number || "-",
    },
  },
  {
    data: {
      label: "Address",
      value: `${property?.address}`,
    },
  },
  {
    data: {
      label: "Parking",
      value: property?.raw_data?.ParkingTotal ?? "-",
    },
  },
  {
    data: {
      label: "Heating",
      value: property?.raw_data?.Heating?.join(", ") || "-",
    },
  },
  {
    data: {
      label: "Water Supply",
      value: property?.raw_data?.WaterSource?.join(", ") || "-",
    },
  },
];

export const roomHeaders: TableHeader[] = [
  { key: "room", label: "Room" },
  { key: "level", label: "Level", align: "center" },
  { key: "dimensions", label: "Dimensions", align: "right" },
];

export const getRoomRows = (property: any) => {
  const raw = property?.raw_data || {};
  const rooms: Record<string, any> = {};

  // Step 1: Group keys by room index
  Object.keys(raw).forEach((key) => {
    const match = key.match(/^BCRES_Room(\d+)(.*)$/);
    if (!match) return;

    const index = match[1]; // room number
    const field = match[2]; // RoomType, RoomLevel...

    if (!rooms[index]) rooms[index] = {};

    rooms[index][field] = raw[key];
  });

  // Step 2: Convert to rows (skip null values)
  return Object.values(rooms)
    .filter(
      (room: any) =>
        room.RoomType && room.RoomLevel && room.RoomWidth && room.RoomLength,
    )
    .map((room: any) => {
      return {
        data: {
          room: room.RoomType,
          level: room.RoomLevel,
          dimensions: `${room.RoomWidth} × ${room.RoomLength}`,
        },
      };
    });
};

export const getPropertyRoomRows = (property: any) => {
  const rooms = property?.rooms || [];

  return rooms
    .filter(
      (room: any) =>
        room.RoomType && room.RoomLevel && room.RoomWidth && room.RoomLength,
    )
    .map((room: any) => {
      return {
        data: {
          room: room.RoomType,
          level: room.RoomLevel,
          dimensions: `${room.RoomWidth} × ${room.RoomLength}`,
        },
      };
    });
};

export const nearbySchoolsHeaders: TableHeader[] = [
  { key: "school", label: "School Name" },
  { key: "address", label: "Address", align: "center" },
  { key: "details", label: "Details", align: "right" },
];

export const nearbySchoolsRows = [
  {
    data: {
      school: "Blakeburn Elementary",
      address: "1040 Riverside Dr",
      details: "0.5 km Public • SD 39",
    },
  },
  {
    data: {
      school: "Terry Fox Secondary",
      address: "1260 Riverwood Gate",
      details: "0.3 km Public • SD 39",
    },
  },
  {
    data: {
      school: "Archbishop Carney Regional Secondary",
      address: "1335 Dominion Ave",
      details: "0.9 km Independent • SD 39",
    },
  },
  {
    data: {
      school: "Cedar Drive Elementary",
      address: "3150 Cedar Dr",
      details: "1.1 km Public • SD 39",
    },
  },
  {
    data: {
      school: "Birchland Elementary",
      address: "1331 Fraser Ave",
      details: "1.4 km Public • SD 39",
    },
  },
  {
    data: {
      school: "James Park Elementary",
      address: "1761 Westminster Ave",
      details: "1.9 km Public • SD 39",
    },
  },
  {
    data: {
      school: "Henry Hudson Elementary",
      address: "1551 Cypress St",
      details: "2.3 km Independent • SD 39",
    },
  },
];

export const buildingComplexHeaders: TableHeader[] = [
  { key: "label", label: "" },
  { key: "value", label: "", align: "right" },
];

export const buildingComplexRows = [
  {
    data: {
      label: "Building Name",
      value: "The Sea Breeze",
    },
  },
  {
    data: {
      label: "Active Listings",
      value: "1 listing",
    },
  },
  {
    data: {
      label: "Units",
      value: "61 units",
    },
  },
  {
    data: {
      label: "Storeys",
      value: "3 Storeys",
    },
  },
  {
    data: {
      label: "Year Built",
      value: "1967",
    },
  },
  {
    data: {
      label: "Neighborhood",
      value: "Kitsilano",
    },
  },
];

export const taxHistoryHeaders: TableHeader[] = [
  { key: "year", label: "Year" },
  { key: "land", label: "Land" },
  { key: "impr", label: "IMPR." },
  { key: "total", label: "TOTAL" },
  { key: "yoy", label: "YOY CHANGE", align: "center" },
];

export const taxHistoryRows = [
  {
    data: {
      year: "2025",
      land: "$586,000",
      impr: "$26,300",
      total: "$612,300",
      yoy: "+1.7%",
    },
  },
  {
    data: {
      year: "2024",
      land: "$586,000",
      impr: "$26,300",
      total: "$612,300",
      yoy: "+1.7%",
    },
  },
  {
    data: {
      year: "2023",
      land: "$600,000",
      impr: "$28,450",
      total: "$640,750",
      yoy: "+1.9%",
    },
  },
  {
    data: {
      year: "2022",
      land: "$640,000",
      impr: "$32,800",
      total: "$700,300",
      yoy: "+2.3%",
    },
  },
  {
    data: {
      year: "2021",
      land: "$660,000",
      impr: "$35,000",
      total: "$730,150",
      yoy: "+2.5%",
    },
  },
  {
    data: {
      year: "2020",
      land: "$620,000",
      impr: "$30,600",
      total: "$670,500",
      yoy: "+2.1%",
    },
  },
];

export const marketStatsHeaders: TableHeader[] = [
  { key: "type", label: "Apartment" },
  { key: "active", label: "All Active", align: "center" },
  { key: "price", label: "This Property", align: "right" },
];

export const marketStatsRows = [
  {
    data: {
      type: "Apartment",
      active: "1,250",
      price: "$594,900",
    },
  },
  {
    data: {
      type: "Apartment",
      active: "1,250",
      price: "$594,900",
    },
  },
  {
    data: {
      type: "Apartment",
      active: "1,250",
      price: "$594,900",
    },
  },
  {
    data: {
      type: "Apartment",
      active: "1,250",
      price: "$594,900",
    },
  },
  {
    data: {
      type: "Apartment",
      active: "1,250",
      price: "$594,900",
    },
  },
];
