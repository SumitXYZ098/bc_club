 

import MonthlySaleChart from "@/src/mainComponents/marketTrends/monthlySaleChart/MonthlySaleChart";
 
import { FiPrinter, FiShare2 } from "react-icons/fi";

// interface CustomSelectProps {
//   label: string;
//   options: string[];
//   value: string;
//   onChange: (value: string) => void;
// }
  
const Page = () => {
  return (
    <section className="py-30">
      <div className="xl:max-w-screen-2xl mx-auto px-6 xl:px-16 space-y-10">
        {/* ===== Header ===== */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h1 className="font-bold max-w-xl text-base sm:text-lg w-85.5">
            Print the chart with a Landscape orientation for best results
          </h1>

          <div className="flex flex-wrap items-center gap-2">
            {[
              "Monthly Sales Chart",
              "Monthly Sales",
              "Stats Map",
              "Monthly Sales Reports",
            ].map((item, i) => (
              <button
                key={i}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm border border-borderColor text-gray-500 ${
                  i === 0 ? "text-gray-500" : "text-gray-500"
                }`}
              >
                {item}
              </button>
            ))}

            <button className="p-2 bg-[#3054871A] rounded-md  ">
              <FiPrinter size={18} className="text-gray-600" />
            </button>
            <button className="p-2 bg-[#3054871A]  rounded-md  ">
              <FiShare2 size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* ===== Filters ===== */}
        {/* <div className="bg-white rounded-2xl shadow p-5  gap-4 flex flex-nowrap md:flex-row flex-col">
          <CustomSelect
            label="Property Type"
            options={PROPERTY_OPTIONS}
            value={property}
            onChange={setProperty}
          />

          <CustomSelect
            label="Neighborhood"
            options={NEIGHBORHOOD_OPTIONS}
            value={neighborhood}
            onChange={setNeighborhood}
          />

          <CustomSelect
            label="Years Back"
            options={YEAR_OPTIONS}
            value={year}
            onChange={setYear}
          />
        </div> */}

        {/* ===== Chart ===== */}
        {/* <div className=" rounded-2xl bg-[#F5F6F8] p-4 pb-16">
          <div className="h-124.75   rounded-xl ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-sm w-85.5">
                City of Vancouver / Median Sold Price in all Neighborhoods
              </h2>

              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1 border border-borderColor p-1 rounded-lg ">
                  <span className="w-3 h-3 bg-blue-800 rounded"></span> All
                  Residential
                </span>
                <span className="flex items-center gap-1 border border-borderColor p-1 rounded-lg ">
                  <span className="w-3 h-3 bg-green-500 rounded"></span> 12-MA
                </span>
                <span className="flex items-center gap-1 border border-borderColor p-1 rounded-lg ">
                  <span className="w-3 h-3 bg-yellow-400 rounded"></span> Sold
                  Count
                </span>
              </div>
            </div>
            <ResponsiveContainer className="mb-10" width="100%" height="100%">
              <ComposedChart data={data}>
                <XAxis dataKey="month" />
                <YAxis yAxisId="price" tickFormatter={(v) => `${v / 1000}M`} />
                <YAxis
                  yAxisId="sold"
                  orientation="right"
                  tickFormatter={(v) => `${v}K`}
                />

                <Tooltip />

                <Bar
                  yAxisId="sold"
                  dataKey="sold"
                  barSize={26}
                  fill="#1f3a5f"
                  radius={[6, 6, 0, 0]}
                >
                  <LabelList dataKey="sold" position="top" />
                </Bar>

                <Line
                  yAxisId="price"
                  dataKey="price"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />

                <Line
                  yAxisId="price"
                  dataKey="ma"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div> */}
      </div>
      <MonthlySaleChart />
    </section>
  );
};

export default Page;
