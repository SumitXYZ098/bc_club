import { Images } from "../app/exports";
import { TableHeader } from "../components/common/dynamicTable/DynamicTable";
import { PropertyCardProps } from "../components/common/propertiesCard/PropertiesCard";

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
  // Existing
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
  "https://images.unsplash.com/photo-1600585154154-0b0a3d06d3c4",
  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c",
  "https://images.unsplash.com/photo-1600047509358-9dc75507daeb",
  "https://images.unsplash.com/photo-1576941089067-2de3c901e126",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
  "https://images.unsplash.com/photo-1599423300746-b62533397364",
  "https://images.unsplash.com/photo-1600585152915-d208bec867a1",
  "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198",
  "https://images.unsplash.com/photo-1593696140826-c58b021acf8b",
  "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f1",
  "https://images.unsplash.com/photo-1600047509782-20b8f98a2f63",
  "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
  "https://images.unsplash.com/photo-1600585153780-ec9b8c8d3cde",
];

export const propertyDetailsHeaders: TableHeader[] = [
  { key: "label", label: "" },
  { key: "value", label: "", align: "right" },
];
export const propertyDetailsRows = [
  {
    data: {
      label: "Property Type",
      value: "Apartment/Condo",
    },
  },
  {
    data: {
      label: "Bedrooms",
      value: "1",
    },
  },
  {
    data: {
      label: "Bathrooms",
      value: "1",
    },
  },
  {
    data: {
      label: "Asking Price",
      value: "$594,900",
    },
  },
  {
    data: {
      label: "Maintenance Fee",
      value: "$410.5",
    },
  },
  {
    data: {
      label: "Listing Date",
      value: "2025/July/10",
    },
    subRows: [
      {
        data: {
          label: "Days at New Price",
          value: "93 days",
        },
      },
      {
        data: {
          label: "Days On Market",
          value: "153 days",
        },
      },
      {
        data: {
          label: "Cumulative Days On Market",
          value: "123 days",
        },
      },
    ],
  },
  {
    data: {
      label: "Previously Sold Date",
      value: "2015/Feb/24",
    },
  },
  {
    data: {
      label: "Floor Area",
      value: "629 sqft",
    },
    subRows: [
      {
        data: {
          label: "Price per SqFt",
          value: "$946",
        },
      },
      {
        data: {
          label: "Maint. Fee per SqFt",
          value: "$0.65",
        },
      },
    ],
  },
  {
    data: {
      label: "Age",
      value: "82 years (1943)",
    },
  },
  {
    data: {
      label: "Property Taxes",
      value: "$1,787",
    },
  },
  {
    data: {
      label: "Ownership Interest",
      value: "Freehold Strata",
    },
  },
  {
    data: {
      label: "PID",
      value: "003-263-932",
    },
  },
  {
    data: {
      label: "Seller’s Agent",
      value: "$5,823",
    },
  },
  {
    data: {
      label: "Storeys (Finished)",
      value: "4",
    },
  },
  {
    data: {
      label: "Basement Info",
      value: "None",
    },
  },
  {
    data: {
      label: "Seller’s Agent",
      value: "Century 21 Purcell Realty Ltd",
    },
  },
  {
    data: {
      label: "Roof",
      value: "Asphalt Shingle",
    },
  },
  {
    data: {
      label: "Heating",
      value: "Baseboard heaters, Electric",
    },
  },
  {
    data: {
      label: "Water Supply",
      value: "Community Water User Utility",
    },
  },
];

export const roomHeaders: TableHeader[] = [
  { key: "room", label: "Room" },
  { key: "level", label: "Level", align: "center" },
  { key: "dimensions", label: "Dimensions", align: "right" },
];

export const roomRows = [
  {
    data: {
      room: "Living Room",
      level: "Main",
      dimensions: "15'5 × 13'8",
    },
  },
  {
    data: {
      room: "Kitchen",
      level: "Main",
      dimensions: "12'0 × 10'5",
    },
  },
  {
    data: {
      room: "Bedroom 1",
      level: "Upper",
      dimensions: "14'2 × 12'0",
    },
  },
  {
    data: {
      room: "Bedroom 2",
      level: "Upper",
      dimensions: "13'0 × 11'0",
    },
  },
  {
    data: {
      room: "Bathroom",
      level: "Main",
      dimensions: "8'0 × 6'5",
    },
  },
];

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
