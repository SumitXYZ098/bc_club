"use client";

import CustomButton from "@/src/components/button/CustomButton";
import LineGradient from "@/src/components/common/lineGradient/LineGradient";
import { useEffect, useState } from "react";

const tabs = [
  { label: "Overview", id: "overview" },
  { label: "Features", id: "features" },
  { label: "Estimate", id: "estimate" },
  { label: "Pricing", id: "pricing" },
  { label: "Assessment", id: "assessment" },
  { label: "Financing", id: "financing" },
  { label: "Neighbourhood", id: "neighbourhood" },
  { label: "Stats", id: "stats" },
  { label: "Similar", id: "similar" },
];

export default function PropertyTabs() {
  const [activeTab, setActiveTab] = useState("overview");

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Update active tab on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-120px 0px -60% 0px",
        threshold: 0.1,
      }
    );

    tabs.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky xl:top-0 top-18 z-50 bg-background xl:pt-13 py-3 w-full md:block hidden">
      <div className="flex xl:flex-nowrap flex-wrap gap-2">
        {tabs.map(({ label, id }) => {
          const isActive = activeTab === id;
          return (
            <CustomButton
              key={id}
              buttonType={isActive ? "primary" : "disabled"}
              label={label}
              onClick={() => handleClick(id)}
              customClasses="xl:w-full  "
            />
          );
        })}
      </div>
      <LineGradient customClasses="mt-5 mb-2" />
    </div>
  );
}
