import Image from "next/image";
import { Images } from "../../exports";
import BlogCard from "@/src/components/common/blogCard/BlogCard";
import GetInTouch from "@/src/mainComponents/getInTouch/GetInTouch";

export default function page() {
  return (
    <>
      <section className=" py-27 ">
        <div className="xl:max-w-screen-2xl mx-auto px-6 xl:px-16">
          <div className="flex gap-10">
            {/* ================= LEFT CONTENT ================= */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-8">
              {/* Title */}
              <h1 className="text-3xl font-semibold text-[#2E2E2E] mb-6">
                Smart Property Investment In 2025
              </h1>

              {/* Featured Image */}
              <div className="relative w-full h-105 rounded-xl overflow-hidden mb-8">
                <Image
                  src={Images.blogimg}
                  alt="Blog image"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
                <p>
                  Exploring Generative AI in Content Creation has become
                  increasingly popular as businesses seek innovative ways to
                  scale content production while maintaining quality.
                </p>

                <h2 className="text-lg font-semibold text-[#2E2E2E]">
                  Steering Clear of Common AI Writing Pitfalls
                </h2>

                <p>
                  Understanding the limitations of AI-generated content is
                  crucial. Human oversight ensures accuracy, tone consistency,
                  and originality.
                </p>

                <h2 className="text-lg font-semibold text-[#2E2E2E]">
                  Understanding ChatGPT Capabilities – Define Your Style
                </h2>

                <p>
                  ChatGPT can adapt to different tones and writing styles. Clear
                  prompts help generate better outputs aligned with your brand
                  voice.
                </p>

                <h2 className="text-lg font-semibold text-[#2E2E2E]">
                  Conclusion: Embracing AI in Blog Creation
                </h2>

                <p>
                  AI is a powerful assistant—not a replacement. When used
                  strategically, it enhances creativity and efficiency.
                </p>
              </div>
            </div>

            {/* ================= RIGHT SIDEBAR ================= */}
            <aside className="bg-white rounded-2xl p-2 h-fit sticky top-12">
              {/* Category */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-white bg-[#F4A51C] inline-block px-4 py-2 rounded-lg mb-4">
                  Blog Category
                </h3>

                <ul className="space-y-3 text-sm text-gray-600">
                  <li>✔ Real Estate</li>
                  <li>✔ Investment</li>
                  <li>✔ Property</li>
                  <li>✔ Market Trends</li>
                </ul>
              </div>

              {/* Recent Blogs */}
              <div>
                <h3 className="text-sm font-semibold text-[#2E2E2E] mb-4">
                  Recent Blogs
                </h3>

                <ul className="space-y-4 text-sm text-gray-600">
                  <li className="border-b pb-2">
                    Smart Property Investment in 2025
                  </li>
                  <li className="border-b pb-2">
                    First-Time Home Buyer’s Guide
                  </li>
                  <li>Real Estate Market Trends Explained</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className="bg-[#F0F0F0] xl:max-w-screen-2xl mx-auto p-6 sm:p-10 lg:p-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold pb-6">
          Recently Blogs
        </h2>

        <div className="flex flex-wrap gap-5">
          <div className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(32%-15px)]">
            <BlogCard
              title="Bill Walsh leadership lessons"
              image={Images.leadership}
              description="Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?"
            />
          </div>

          <div className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(32%-15px)]">
            <BlogCard
              title="Bill Walsh leadership lessons"
              image={Images.billwalsh}
              description="Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?"
            />
          </div>

          <div className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(32%-15px)]">
            <BlogCard
              title="Bill Walsh leadership lessons"
              image={Images.saleimg}
              description="Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?"
            />
          </div>
        </div>
      </div>

      <GetInTouch />
    </>
  );
}
