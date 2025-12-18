"use client";

import React from "react";
import { Icons, Images } from "../exports";
import Image from "next/image";
import BlogCard from "@/src/components/common/blogCard/BlogCard";
import GetInTouch from "@/src/mainComponents/getInTouch/GetInTouch";
import Link from "next/link";

const Page = () => {
  return (
    <>
      {/* ================= HERO SECTION ================= */}

      <section className="relative bg-background overflow-hidden">
        <div className="xl:max-w-screen-2xl mx-auto xl:px-16 md:px-13 px-6 pt-28 pb-40 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E2E2E]">
            Our <span className="text-[#F4A51C]">Blog</span>
          </h1>

          <p className="mt-4 text-sm md:text-base text-gray-500 max-w-xl mx-auto">
            Get the latest updates and deeper coffee experience from IMAJI
            Coffee
          </p>
        </div>

        {/* Wave */}
        <div className="absolute -bottom-10 left-0 w-full h-70">
          <Image
            src={Icons.bgWaveLine}
            alt="Wave line"
            fill
            className=""
            priority
          />
        </div>
      </section>

      {/* ================= BLOG CARDS SECTION ================= */}

      <section className="xl:max-w-screen-2xl mx-auto xl:px-16 md:px-13 px-6 py-16 md:py-24 relative z-20">
        <div className="flex flex-col lg:flex-row gap-2">
          {/* ===== LEFT BIG CARD ===== */}
            <div className="lg:w-2/4 bg-white rounded-2xl   overflow-hidden">
          <Link href="/blogs/blog-detail" className="block">
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-95 w-full">
                <Image
                  src={Images.blogimg}
                  alt="Smart Property Investment"
                  fill
                  className="object-cover rounded-[20px]"
                />
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#22558B] font-medium">Investment</span>
                  <span className="text-[#22558B]">20 Jan 2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold text-[#2E2E2E]">
                    Smart Property Investment in 2025
                  </h3>
                  <Image
                    alt="Smart Property Investment"
                    width={100}
                    height={100}
                    src={Icons.arrowup}
                    className="w-8 h-8"
                  />
                </div>

                <p className="mt-2 text-sm text-black70 leading-relaxed">
                  Discover why 2025 is one of the best years to invest in real
                  estate. With rising demand, smart homes, and urban expansion.
                </p>
              </div>
          </Link>
            </div>
          {/* ===== RIGHT SIDE ===== */}
          <div className="xl:w-1/2 flex flex-col">
            {/* CARD 1 */}
            <div className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row gap-4 w-full">
              <Image
                src={Images.firsttown}
                alt="First-Time Home Buyer"
                className="object-cover w-full sm:w-55 lg:w-[320px] h-40 sm:h-full rounded-xl shrink-0"
                width={1200}
                height={890}
              />

              <div className="flex flex-col gap-y-2 justify-center-safe  w-full">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#22558B] font-medium">Townhouse</span>
                  <span className="text-[#22558B]">20 Jan 2025</span>
                </div>

                <h4 className="text-sm font-bold text-[#2E2E2E] leading-snug">
                  First-Time Home Buyer’s Complete Guide
                </h4>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row gap-4 w-full">
              <Image
                src={Images.secondtown}
                alt="Home Investment"
                className="object-cover w-full sm:w-55 lg:w-[320px] h-40 sm:h-full rounded-xl shrink-0"
                width={1200}
                height={890}
              />

              <div className="flex flex-col gap-y-2 justify-center-safe w-full">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#22558B] font-medium">Townhouse</span>
                  <span className="text-[#22558B]">20 Jan 2025</span>
                </div>

                <h4 className="text-sm font-bold text-[#2E2E2E] leading-snug">
                  First-Time Home Buyer’s Complete Guide
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#F0F0F0] xl:max-w-screen-2xl mx-auto p-6 sm:p-10 lg:p-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold pb-6">
          Recently Blogs
        </h2>

        <div className="flex flex-wrap gap-5">
          <div className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]">
            <BlogCard
              title="Bill Walsh leadership lessons"
              image={Images.leadership}
              description="Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?"
            />
          </div>

          <div className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]">
            <BlogCard
              title="Bill Walsh leadership lessons"
              image={Images.billwalsh}
              description="Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?"
            />
          </div>

          <div className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]">
            <BlogCard
              title="Bill Walsh leadership lessons"
              image={Images.saleimg}
              description="Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?"
            />
          </div>

          <div className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]">
            <BlogCard
              title="Bill Walsh leadership lessons"
              image={Images.leaderlesson}
              description="Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?"
            />
          </div>
          <div className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]">
            <BlogCard
              title="Bill Walsh leadership lessons"
              image={Images.leaderlesson}
              description="Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?"
            />
          </div>
          <div className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]">
            <BlogCard
              title="Bill Walsh leadership lessons"
              image={Images.leaderlesson}
              description="Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?"
            />
          </div>
          <div className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]">
            <BlogCard
              title="Bill Walsh leadership lessons"
              image={Images.leaderlesson}
              description="Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?"
            />
          </div>
          <div className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]">
            <BlogCard
              title="Bill Walsh leadership lessons"
              image={Images.leadership}
              description="Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?"
            />
          </div>
        </div>
      </div>
      <div className="mt-20"></div>
      <GetInTouch />
    </>
  );
};

export default Page;
