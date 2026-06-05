export interface CityStatRow {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export interface CityStats {
  month: string;
  year: number;
  propertyType: string;
  stats: CityStatRow[];
}

export const propertyTypes = ["Detached", "Condo", "Townhouse"];
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const cityMockData: Record<string, Record<string, CityStats[]>> = {
  Langley: {
    Detached: [
      {
        month: "November",
        year: 2025,
        propertyType: "Detached",
        stats: [
          {
            label: "Median Sold Price",
            value: "$2,055,000",
            change: "14.0%",
            trend: "up",
          },
          {
            label: "Median Price per SqFt",
            value: "$610",
            change: "14.0%",
            trend: "down",
          },
          { label: "Sales", value: "12", change: "14.0%", trend: "down" },
          { label: "Inventory", value: "122", change: "14.0%", trend: "up" },
          { label: "New Listings", value: "58", change: "14.0%", trend: "up" },
          {
            label: "Median Days on Market",
            value: "16",
            change: "14.0%",
            trend: "down",
          },
        ],
      },
      {
        month: "October",
        year: 2025,
        propertyType: "Detached",
        stats: [
          {
            label: "Median Sold Price",
            value: "$1,980,000",
            change: "5.0%",
            trend: "up",
          },
          {
            label: "Median Price per SqFt",
            value: "$595",
            change: "2.1%",
            trend: "up",
          },
          { label: "Sales", value: "15", change: "10.0%", trend: "up" },
          { label: "Inventory", value: "110", change: "4.0%", trend: "down" },
          { label: "New Listings", value: "45", change: "12.0%", trend: "up" },
          {
            label: "Median Days on Market",
            value: "14",
            change: "8.0%",
            trend: "up",
          },
        ],
      },
    ],
    Condo: [
      {
        month: "November",
        year: 2025,
        propertyType: "Condo",
        stats: [
          {
            label: "Median Sold Price",
            value: "$650,000",
            change: "2.0%",
            trend: "up",
          },
          {
            label: "Median Price per SqFt",
            value: "$710",
            change: "1.0%",
            trend: "down",
          },
          { label: "Sales", value: "45", change: "15.0%", trend: "up" },
          { label: "Inventory", value: "220", change: "5.0%", trend: "up" },
          { label: "New Listings", value: "80", change: "10.0%", trend: "up" },
          {
            label: "Median Days on Market",
            value: "22",
            change: "4.0%",
            trend: "down",
          },
        ],
      },
    ],
    Townhouse: [
      {
        month: "November",
        year: 2025,
        propertyType: "Townhouse",
        stats: [
          {
            label: "Median Sold Price",
            value: "$1,980,000",
            change: "5.0%",
            trend: "up",
          },
          {
            label: "Median Price per SqFt",
            value: "$595",
            change: "2.1%",
            trend: "up",
          },
          { label: "Sales", value: "15", change: "10.0%", trend: "up" },
          { label: "Inventory", value: "110", change: "4.0%", trend: "down" },
          { label: "New Listings", value: "45", change: "12.0%", trend: "up" },
          {
            label: "Median Days on Market",
            value: "14",
            change: "8.0%",
            trend: "up",
          },
        ],
      },
    ],
  },
  Surrey: {
    Detached: [
      {
        month: "November",
        year: 2025,
        propertyType: "Detached",
        stats: [
          {
            label: "Median Sold Price",
            value: "$1,750,000",
            change: "8.0%",
            trend: "up",
          },
          {
            label: "Median Price per SqFt",
            value: "$540",
            change: "3.0%",
            trend: "up",
          },
          { label: "Sales", value: "24", change: "5.0%", trend: "down" },
          { label: "Inventory", value: "180", change: "10.0%", trend: "up" },
          { label: "New Listings", value: "65", change: "2.0%", trend: "down" },
          {
            label: "Median Days on Market",
            value: "19",
            change: "2.0%",
            trend: "up",
          },
        ],
      },
    ],
  },
  Vancouver: {
    Detached: [
      {
        month: "November",
        year: 2025,
        propertyType: "Detached",
        stats: [
          {
            label: "Median Sold Price",
            value: "$2,850,000",
            change: "12.0%",
            trend: "up",
          },
          {
            label: "Median Price per SqFt",
            value: "$1,240",
            change: "5.0%",
            trend: "up",
          },
          { label: "Sales", value: "32", change: "8.0%", trend: "up" },
          { label: "Inventory", value: "210", change: "2.0%", trend: "down" },
          { label: "New Listings", value: "95", change: "15.0%", trend: "up" },
          {
            label: "Median Days on Market",
            value: "25",
            change: "10.0%",
            trend: "down",
          },
        ],
      },
    ],
  },
};
