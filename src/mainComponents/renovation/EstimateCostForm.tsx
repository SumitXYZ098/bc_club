/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import CustomButton from "@/src/components/button/CustomButton";
import { MenuItem, Select, Slider } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LineGradient from "@/src/components/common/lineGradient/LineGradient";
import { styled } from "@mui/styles";
import CheckboxCard from "./CheckboxCard";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import EstimateCostDialog from "./EstimateCostDialog";
import { useState } from "react";

// ================= Slider Theme =================
const PriceSlider = styled(Slider)({
  color: "#E8A200",
  height: 6,
  padding: "14px 0",
  "& .MuiSlider-thumb": {
    height: 18,
    width: 18,
    backgroundColor: "#E8A200",
    border: "3px solid #fff",
    boxShadow: "0 2px 6px rgba(0,0,0,.25)",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-track": {
    height: 12,
  },

  "& .MuiSlider-rail": {
    height: 12,
    opacity: 1,
    backgroundColor: "#e5e5e5",
    borderRadius: 10,
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 50,
    height: 32,
    borderRadius: 20,
    backgroundColor: "#E8A200",
    transform: "translate(0%, 10%) rotate(180deg) scale(0)",
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(0%, 10%) rotate(180deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(180deg)",
    },
  },
});

type FormValues = {
  renovations: {
    renovateArea: string;
    areaSize: number[];
    typeRenovation: string;
    scopeOfWork: string[];
    propertyType: string;
  }[];
};

const scopeOptions = [
  { name: "demolition", label: "Demolition" },
  { name: "plumbing", label: "Plumbing changes" },
  { name: "structural", label: "Structural changes (wall removal)" },
  { name: "flooring", label: "Flooring replacement" },
  { name: "cabinetry", label: "Cabinetry" },
  { name: "countertops", label: "Countertops" },
  { name: "tiling", label: "Tiling" },
  { name: "painting", label: "Painting" },
];

const EstimateCostForm = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [data, setData] = useState<any[] | []>([]);
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      renovations: [
        {
          renovateArea: "",
          areaSize: [50, 430],
          typeRenovation: "Partial Renovation",
          scopeOfWork: [],
          propertyType: "",
        },
      ],
    },
  });
  const { fields, append } = useFieldArray({
    control,
    name: "renovations",
  });

  const onSubmit = (data: FormValues) => {
    setData(data.renovations);
    setOpenDialog(true);
    console.log("FORM SUBMITTED 👉", data);
  };

  return (
    <section className="xl:max-w-screen-2xl mx-auto w-full relative xl:pb-31 md:pb-29 pb-17 xl:px-16 px-6 flex flex-col gap-y-4 xl:-mt-18">
      <div className="w-full h-auto p-4 rounded-2xl shadow-[0_0_15px_0_rgba(0,0,0,0.12)] bg-background flex flex-col gap-y-13">
        {fields.map((field, index) => (
          <div
            key={index + field.id}
            className="w-full flex flex-col gap-y-3 shadow p-4 rounded-xl"
          >
            {/* Select Area */}
            <div className="flex flex-col gap-y-3">
              <label className="md:text-2xl text-xl font-bold opacity-50">
                Select Area to Renovate
              </label>

              <Controller
                name={`renovations.${index}.renovateArea`}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    sx={{
                      borderRadius: 4,
                      outline: "none",
                      "& .MuiSvgIcon-root": {
                        fill: "#EEA500",
                      },
                    }}
                    displayEmpty
                    IconComponent={KeyboardArrowDownIcon}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Kitchen">Kitchen</MenuItem>
                    <MenuItem value="Bathroom">Bathroom</MenuItem>
                    <MenuItem value="Bedroom">Bedroom</MenuItem>
                    <MenuItem value="Hall">Hall</MenuItem>
                  </Select>
                )}
              />
            </div>
            {/* Area Size */}
            <div className="flex flex-col gap-y-3">
              <label className="md:text-2xl text-xl font-bold opacity-50">
                Area Size
              </label>

              <Controller
                name={`renovations.${index}.areaSize`}
                control={control}
                render={({ field }) => (
                  <>
                    <PriceSlider
                      value={field.value}
                      min={0}
                      max={2200}
                      onChange={(_, v) => field.onChange(v)}
                      disableSwap
                      valueLabelDisplay="auto"
                    />
                    <div className="flex md:flex-row flex-col md:items-center justify-between gap-y-5 gap-x-20 w-full mt-4">
                      {/* Min */}
                      <div className="flex items-center gap-x-4 md:w-[40%] w-full h-full">
                        <p className="text-base mb-1 whitespace-nowrap opacity-30">
                          Min Area
                        </p>
                        <div className="flex items-center gap-1 border border-gray rounded-xl w-full px-3 sm:px-4 py-2 h-full">
                          <span className="font-medium text-base opacity-20">
                            sqft
                          </span>
                          <LineGradient customClasses="mx-1" vr />
                          <span className="text-xl font-bold">
                            {field.value[0]}
                          </span>
                        </div>
                      </div>

                      {/* Divider */}
                      <LineGradient
                        customClasses="mx-1 h-10 sm:h-15 w-3 md:flex hidden"
                        vr
                      />

                      {/* Max */}
                      <div className="flex items-center gap-x-4 md:w-[40%] w-full h-full">
                        <p className="text-base mb-1 whitespace-nowrap opacity-30">
                          Max Area
                        </p>
                        <div className="flex items-center gap-1 border border-gray rounded-xl w-full px-3 sm:px-4 py-2 h-full">
                          <span className="font-medium text-base opacity-20">
                            sqft
                          </span>
                          <LineGradient customClasses="mx-1" vr />
                          <span className="text-xl font-bold">
                            {field.value[1]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              />
            </div>

            {/* Type of Renovation */}
            <div className="flex flex-col gap-y-3">
              <label className="md:text-2xl text-xl font-bold opacity-50">
                Type of Renovation
              </label>

              <Controller
                name={`renovations.${index}.typeRenovation`}
                control={control}
                render={({ field }) => (
                  <div className="flex md:flex-row flex-col gap-y-6 gap-x-5">
                    {typeOfRenovationData.map((type, idx) => (
                      <div
                        key={idx + 1}
                        onClick={() => field.onChange(type.title)}
                        className={`p-6 border-2 transition duration-300 ease-in-out rounded-xl w-full flex flex-col gap-y-4 h-auto ${field.value === type.title ? "bg-[#E4F1FF] border-primary" : "border-gray bg-background"} `}
                      >
                        <span className="text-lg font-medium">
                          {type.title}
                        </span>
                        <ul className="list-disc list-inside text-base">
                          {type.points.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                        <p className="text-base">{type.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>

            {/* Scope of Work */}
            <div className="flex flex-col gap-y-3">
              <label className="md:text-2xl text-xl font-bold opacity-50">
                Scope of Work
              </label>

              <Controller
                name={`renovations.${index}.scopeOfWork`}
                control={control}
                render={({ field }) => (
                  <div className="grid md:grid-cols-3 gap-4">
                    {scopeOptions.map((item) => (
                      <CheckboxCard
                        key={item.name}
                        name={item.name}
                        label={item.label}
                        checked={field.value.includes(item.name)}
                        onChange={(checked) =>
                          field.onChange(
                            checked
                              ? [...field.value, item.name]
                              : field.value.filter((v) => v !== item.name),
                          )
                        }
                      />
                    ))}
                  </div>
                )}
              />
            </div>

            {/*    */}
            <div className="flex flex-col gap-y-3">
              <label className="md:text-2xl text-xl font-bold opacity-50">
                Property Type
              </label>

              <Controller
                name={`renovations.${index}.propertyType`}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    displayEmpty
                    sx={{
                      borderRadius: 4,
                      outline: "none",
                      "& .MuiSvgIcon-root": {
                        fill: "#EEA500",
                      },
                    }}
                    IconComponent={KeyboardArrowDownIcon}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Detached Homes">Detached Homes</MenuItem>
                    <MenuItem value="Townhouse">Townhouse</MenuItem>
                    <MenuItem value="Condos">Condos</MenuItem>
                    <MenuItem value="Apartments">Apartments</MenuItem>
                  </Select>
                )}
              />
            </div>
          </div>
        ))}

        {/* Add More Area to Renovate */}

        <CustomButton
          label="Add More Area to Renovate"
          buttonType="disabled"
          type="button"
          customClasses="md:w-[40%] text-black! font-bold"
          onClick={() =>
            append({
              renovateArea: "",
              areaSize: [50, 430],
              typeRenovation: "Partial Renovation",
              scopeOfWork: [],
              propertyType: "",
            })
          }
        />
      </div>

      <CustomButton
        type="submit"
        label="Get Estimate Cost"
        buttonType="primary"
        customClasses="md:w-[40%]"
        onClick={handleSubmit(onSubmit)}
      />

      <EstimateCostDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        data={data}
      />
    </section>
  );
};

export default EstimateCostForm;

const typeOfRenovationData = [
  {
    title: "Partial Renovation",
    points: ["Paint", "Fixtures", "Minor upgrades"],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed placerat eros at orci faucibus, vitae rhoncus quam ornare. ",
  },
  {
    title: "Full Renovation",
    points: ["Demolition", "Plumbing", "Electrical", "New Finishes"],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed placerat eros at orci faucibus, vitae rhoncus quam ornare. ",
  },
  {
    title: "High-End Renovation",
    points: ["Custom cabinetry", "Stone", "Premium Finishes"],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed placerat eros at orci faucibus, vitae rhoncus quam ornare. ",
  },
];
