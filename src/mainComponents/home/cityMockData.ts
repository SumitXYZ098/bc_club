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

// export const cityMockData: Record<string, Record<string, CityStats[]>> = {
//   Langley: {
//     Detached: [
//       {
//         month: "November",
//         year: 2025,
//         propertyType: "Detached",
//         stats: [
//           {
//             label: "Median Sold Price",
//             value: "$2,055,000",
//             change: "14.0%",
//             trend: "up",
//           },
//           {
//             label: "Median Price per SqFt",
//             value: "$610",
//             change: "14.0%",
//             trend: "down",
//           },
//           { label: "Sales", value: "12", change: "14.0%", trend: "down" },
//           { label: "Inventory", value: "122", change: "14.0%", trend: "up" },
//           { label: "New Listings", value: "58", change: "14.0%", trend: "up" },
//           {
//             label: "Median Days on Market",
//             value: "16",
//             change: "14.0%",
//             trend: "down",
//           },
//         ],
//       },
//       {
//         month: "October",
//         year: 2025,
//         propertyType: "Detached",
//         stats: [
//           {
//             label: "Median Sold Price",
//             value: "$1,980,000",
//             change: "5.0%",
//             trend: "up",
//           },
//           {
//             label: "Median Price per SqFt",
//             value: "$595",
//             change: "2.1%",
//             trend: "up",
//           },
//           { label: "Sales", value: "15", change: "10.0%", trend: "up" },
//           { label: "Inventory", value: "110", change: "4.0%", trend: "down" },
//           { label: "New Listings", value: "45", change: "12.0%", trend: "up" },
//           {
//             label: "Median Days on Market",
//             value: "14",
//             change: "8.0%",
//             trend: "up",
//           },
//         ],
//       },
//     ],
//     Condo: [
//       {
//         month: "November",
//         year: 2025,
//         propertyType: "Condo",
//         stats: [
//           {
//             label: "Median Sold Price",
//             value: "$650,000",
//             change: "2.0%",
//             trend: "up",
//           },
//           {
//             label: "Median Price per SqFt",
//             value: "$710",
//             change: "1.0%",
//             trend: "down",
//           },
//           { label: "Sales", value: "45", change: "15.0%", trend: "up" },
//           { label: "Inventory", value: "220", change: "5.0%", trend: "up" },
//           { label: "New Listings", value: "80", change: "10.0%", trend: "up" },
//           {
//             label: "Median Days on Market",
//             value: "22",
//             change: "4.0%",
//             trend: "down",
//           },
//         ],
//       },
//     ],
//     Townhouse: [
//       {
//         month: "November",
//         year: 2025,
//         propertyType: "Townhouse",
//         stats: [
//           {
//             label: "Median Sold Price",
//             value: "$1,980,000",
//             change: "5.0%",
//             trend: "up",
//           },
//           {
//             label: "Median Price per SqFt",
//             value: "$595",
//             change: "2.1%",
//             trend: "up",
//           },
//           { label: "Sales", value: "15", change: "10.0%", trend: "up" },
//           { label: "Inventory", value: "110", change: "4.0%", trend: "down" },
//           { label: "New Listings", value: "45", change: "12.0%", trend: "up" },
//           {
//             label: "Median Days on Market",
//             value: "14",
//             change: "8.0%",
//             trend: "up",
//           },
//         ],
//       },
//     ],
//   },
//   Surrey: {
//     Detached: [
//       {
//         month: "November",
//         year: 2025,
//         propertyType: "Detached",
//         stats: [
//           {
//             label: "Median Sold Price",
//             value: "$1,750,000",
//             change: "8.0%",
//             trend: "up",
//           },
//           {
//             label: "Median Price per SqFt",
//             value: "$540",
//             change: "3.0%",
//             trend: "up",
//           },
//           { label: "Sales", value: "24", change: "5.0%", trend: "down" },
//           { label: "Inventory", value: "180", change: "10.0%", trend: "up" },
//           { label: "New Listings", value: "65", change: "2.0%", trend: "down" },
//           {
//             label: "Median Days on Market",
//             value: "19",
//             change: "2.0%",
//             trend: "up",
//           },
//         ],
//       },
//     ],
//   },
//   Vancouver: {
//     Detached: [
//       {
//         month: "November",
//         year: 2025,
//         propertyType: "Detached",
//         stats: [
//           {
//             label: "Median Sold Price",
//             value: "$2,850,000",
//             change: "12.0%",
//             trend: "up",
//           },
//           {
//             label: "Median Price per SqFt",
//             value: "$1,240",
//             change: "5.0%",
//             trend: "up",
//           },
//           { label: "Sales", value: "32", change: "8.0%", trend: "up" },
//           { label: "Inventory", value: "210", change: "2.0%", trend: "down" },
//           { label: "New Listings", value: "95", change: "15.0%", trend: "up" },
//           {
//             label: "Median Days on Market",
//             value: "25",
//             change: "10.0%",
//             trend: "down",
//           },
//         ],
//       },
//     ],
//   },
// };

export const cityMockData: Record<string, Record<string, CityStats[]>> = {
  Whistler: createCityStats("$2,450,000", "$1,180", "8", "64", "22", "28"),
  Squamish: createCityStats("$1,420,000", "$780", "14", "92", "34", "21"),
  Vancouver: createCityStats("$2,850,000", "$1,240", "32", "210", "95", "25"),
  Burnaby: createCityStats("$2,120,000", "$930", "21", "155", "68", "23"),
  Coquitlam: createCityStats("$1,780,000", "$720", "18", "135", "54", "20"),
  "New Westminster": createCityStats(
    "$1,390,000",
    "$820",
    "16",
    "98",
    "41",
    "19",
  ),
  Surrey: createCityStats("$1,750,000", "$540", "24", "180", "65", "19"),
  "Maple Ridge": createCityStats("$1,290,000", "$520", "20", "145", "48", "18"),
  Langley: createCityStats("$2,055,000", "$610", "12", "122", "58", "16"),
  Abbotsford: createCityStats("$1,180,000", "$480", "22", "170", "62", "17"),
  Mission: createCityStats("$1,050,000", "$455", "13", "112", "37", "24"),
  Chilliwack: createCityStats("$940,000", "$430", "25", "190", "74", "20"),
  Hope: createCityStats("$765,000", "$390", "7", "58", "18", "31"),
  Richmond: createCityStats("$2,280,000", "$940", "19", "150", "52", "22"),
  Delta: createCityStats("$1,720,000", "$690", "15", "118", "44", "21"),
};

function createCityStats(
  detachedPrice: string,
  detachedPpsf: string,
  sales: string,
  inventory: string,
  newListings: string,
  dom: string,
): Record<string, CityStats[]> {
  return {
    Detached: [
      {
        month: "November",
        year: 2025,
        propertyType: "Detached",
        stats: [
          {
            label: "Median Sold Price",
            value: detachedPrice,
            change: "8.0%",
            trend: "up",
          },
          {
            label: "Median Price per SqFt",
            value: detachedPpsf,
            change: "3.0%",
            trend: "up",
          },
          { label: "Sales", value: sales, change: "5.0%", trend: "down" },
          {
            label: "Inventory",
            value: inventory,
            change: "10.0%",
            trend: "up",
          },
          {
            label: "New Listings",
            value: newListings,
            change: "2.0%",
            trend: "down",
          },
          {
            label: "Median Days on Market",
            value: dom,
            change: "4.0%",
            trend: "down",
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
            value: "$980,000",
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
  };
}
