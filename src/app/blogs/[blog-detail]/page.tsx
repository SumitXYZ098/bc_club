/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Image from "next/image";
import { Icons, Images } from "../../exports";
import BlogCard from "@/src/components/common/blogCard/BlogCard";
import GetInTouch from "@/src/mainComponents/getInTouch/GetInTouch";
import { useState } from "react";

const tocItems = [
  { label: "Exploring Generative AI in Content Creation", id: "generative-ai" },
  { label: "Steering Clear of Common AI Writing Pitfalls", id: "ai-pitfalls" },
  {
    label: "Understanding ChatGPT Capabilities - Define Your Style",
    id: "chatgpt-style",
  },
  {
    label: "Creating Quality AI-powered Blogs that Stand Out",
    id: "quality-ai-blogs",
  },
  { label: "Conclusion: Embracing AI in Blog Creation", id: "conclusion" },
];

export default function page() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (id: string, index: number) => {
    setActiveIndex(index);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <section className=" py-25 ">
        <div className="xl:max-w-screen-2xl mx-auto px-6 xl:px-16">
          {/* ===== BREADCRUMB ===== */}
          <div className=" mt-7 p-4">
            <div className="inline-flex items-center gap-2 bg-[#F2F2F2] px-4 py-2 rounded-lg text-sm">
              <span className="text-gray-700 cursor-pointer hover:text-[#F4A51C]">
                Home
              </span>
              <span className="text-gray-400">›</span>

              <span className="text-gray-700 cursor-pointer hover:text-[#F4A51C]">
                Blog
              </span>
              <span className="text-gray-400">›</span>

              <span className="text-gray-700 cursor-pointer hover:text-[#F4A51C]">
                Blog writing
              </span>
              <span className="text-gray-400">›</span>

              <span className="text-[#F4A51C] font-medium">You are here</span>
            </div>
          </div>
          <div className="flex flex-col ">
            {/* ================= LEFT CONTENT ================= */}
            {/* Title */}
            <h1 className="text-3xl font-bold text-[#2E2E2E] mb-6">
              Smart Property Investment In 2025
            </h1>

            <div className="flex flex-row items-start flex-nowrap gap-5 ">
              <div className="flex flex-col xl:w-[70%] w-full ">
                {/* Featured Image */}
                <div className="relative w-full h-60 sm:h-80 md:h-96 lg:h-105 rounded-xl overflow-hidden mb-8">
                  <Image
                    src={Images.blogimg}
                    alt="Blog image"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
                  <h2
                    id="generative-ai"
                    className="text-2xl text-black font-bold"
                  >
                    Exploring Generative AI in Content Creation
                  </h2>

                  <p>
                    Hello there! As a marketing manager in the SaaS industry,
                    you might be looking for innovative ways to engage your
                    audience. I bet generative AI has crossed your mind as an
                    option for creating content. Well, let me share from my
                    firsthand experience.
                  </p>

                  <p>
                    Google encourages high-quality blogs regardless of whether
                    they re written by humans or created using artificial
                    intelligence like ChatGPT. Here&apos;s what matters:
                    producing original material with expertise and
                    trustworthiness based on Google E-E-A-T principles.
                  </p>

                  <p>
                    This means focusing more on people-first writing rather than
                    primarily employing AI tools to manipulate search rankings.
                    There comes a time when many experienced professionals want
                    to communicate their insights but get stuck due to limited
                    writing skills – that’s where Generative AI can step in.
                  </p>

                  <p>
                    So, together, we’re going explore how this technology could
                    help us deliver valuable content without sounding robotic or
                    defaulting into mere regurgitations of existing materials .
                    Hang tight - it’ll be a fun learning journey!
                  </p>

                  <h2
                    id="ai-pitfalls"
                    className="text-2xl text-black font-bold"
                  >
                    Steering Clear of Common AI Writing Pitfalls
                  </h2>

                  <p>
                    Jumping headfirst into using AI, like ChatGPT, without a
                    content strategy can lead to some unfortunate results. One
                    common pitfall I&apos;ve seen is people opting for quantity
                    over quality - they churn out blogs, but each one feels
                    robotic and soulless, reading just like countless others on
                    the internet.
                  </p>

                  <p>
                    Another fault line lies in creating reproductions rather
                    than delivering unique perspectives that offer value to
                    readers; it often happens if you let an AI tool write your
                    full blog unrestrained! Trust me on this – Ask any
                    experienced marketer or writer about their takeaways from
                    using generative AI tools. They&apos;ll all agree that
                    adding a human touch and following specific guidelines are
                    key when implementing these tech pieces.
                  </p>

                  <p>
                    Remember, our goal here isn’t merely satisfying search
                    engines but, more importantly, knowledge-hungry humans
                    seeking reliable information online. So keep your
                    audience&apos;s needs at heart while leveraging technology’s
                    assistance!
                  </p>
                  <h2
                    id="chatgpt-style"
                    className="text-2xl text-black font-bold"
                  >
                    Understanding ChatGPT Capabilities - Define Your Style
                  </h2>

                  <p>
                    Welcome to the intriguing world of ChatGPT! Its ability and
                    potential can truly be mind-boggling. I have learned from
                    experience how capable it is in dealing with diverse content
                    generation tasks, only that its text sounded slightly
                    unnatural&#34; in accordance with TechTarget. However, fear
                    not – there are ways around this!
                  </p>

                  <p>
                    One strategic move I&rsquo;ve seen work wonders is defining
                    your unique writing style first before handing over the
                    reins to AI; you treat it like a canvas whereupon our vision
                    opens up. If we clearly instruct who we&rsquo;re targeting
                    or what tone resonates more effectively, generative AI tools
                    such as ChatGPT will comply remarkably well.
                  </p>
                  <p>
                    In framing guidelines, remember to keep audience interests
                    at heart while adopting technology’s benefits for efficient
                    output – trust me on this because neglecting these aspects
                    could backfire by generating unappealing robotic-like reads.
                  </p>
                  <p>
                    Ultimately, aiming towards reader-focused driven creativity
                    illuminated under authentically humanized narratives holds
                    priority above all else when crafting blogs using
                    auto-generation toolkits!
                  </p>

                  <h2
                    id="quality-ai-blogs"
                    className="text-2xl text-black font-bold"
                  >
                    Understand Your ReaCreating Quality AI-powered Blogs that
                    Stand Outders{" "}
                  </h2>
                  <p>
                    Creating brilliant AI-powered blogs is a fun blending of
                    logic with just the right dose of creativity. From defining
                    your target audience to tuning in ChatGPT&rsquo;s language
                    style, every step counts towards creating content that’s not
                    only SEO-friendly but also enjoyable and valuable for
                    readers.
                  </p>
                  <p>
                    One tactic I’ve found useful is maintaining originality in
                    message essence, with unique perspectives infusing life
                    beyond words onto pages!
                  </p>
                  <p>
                    Incorporating trusted references while optimizing blog posts
                    intelligently (rather than keyword stuffing) can
                    significantly aid quality enhancements. Remember, it
                    isn&rsquo;t about writing for Google here, so avoid tunnel
                    vision focusing solely on algorithm-driven success rate,
                    aiming at heart-touching human connections, building loyal
                    reader bases, and sharing knowledge benefiting others!
                  </p>

                  <h2 id="conclusion" className="text-2xl text-black font-bold">
                    Conclusion: Embracing AI in Blog Creation
                  </h2>
                  <p>
                    As we wrap up, let’s remember the heart of blog creation is
                    serving our readers. Whether a post was drafted by experts
                    or AI like ChatGPT doesn&rsquo;t matter to Google algorithms
                    as long it&rsquo;s meaningful and high-quality. Through this
                    valuable learning curve together, I hope you’ve seen how
                    well-implemented strategies can guide generative tools in
                    delivering content mirroring human quality. Yes! It often
                    involves some trial & error phases, but trust me –
                    persistence practiced alongside continuous improvements
                    results in rewarding feats! Additionally, perhaps most
                    importantly, proofreading every piece before publishing
                    hugely influences audience perceptions, establishing
                    professional credibility. Why? Well, even minor oversights
                    could potentially undermine reader experiences, turning away
                    prospective subscribers; hence, maintain meticulous
                    checkpoints for flawless publications! So here goes my
                    fellow SaaS marketing managers: Embrace technology
                    enhancement aids responsibly, always keeping end-user
                    perspectives focal while constantly striving towards better
                    communication standards, offering insightful, pleasing read
                    across widespread digital platforms!
                  </p>
                  <p>
                    Let&rsquo;s be clear: ChatGPT wrote this article and
                    generated the hero image. It combined my personal
                    experience, knowledge, and research. From the initial notes
                    to finish, it took just 37 minutes.
                  </p>
                  <p>
                    Even though it was made by AI, no detection tools could
                    tell. The only thing used was OpenAI&rsquo;s Chat API, no
                    other external tools.
                  </p>
                  <p>
                    It shows how AI can help in making content interesting and
                    relevant. It&rsquo;s a new chapter in how we create and
                    share information.
                  </p>
                </div>
              </div>

              {/* ================= RIGHT SIDEBAR ================= */}
              <aside className="bg-white rounded-2xl p-4 h-fit sticky top-0 self-start xl:w-[30%] w-full xl:block hidden  ">
                {/* Share box */}
                <div className="bg-[#EEA500] rounded-xl p-4 mb-6">
                  <p className="text-white text-sm mb-3 font-medium">
                    Share with your community!
                  </p>

                  <div className="flex gap-3">
                    <Image
                      src={Icons.facebookicon}
                      alt=""
                      width={35}
                      height={30}
                    />
                    <Image
                      src={Icons.twittericon}
                      alt=""
                      width={35}
                      height={30}
                    />
                    <Image src={Icons.linkedin} alt="" width={35} height={30} />
                  </div>
                </div>

                {/* In this article */}
                <h3 className="text-[24px] font-bold text-[#2E2E2E] mb-4">
                  In this article
                </h3>

                <ul className="space-y-3">
                  {tocItems.map((item, index) => (
                    <li
                      key={item.id}
                      onClick={() => handleScroll(item.id, index)}
                      className="cursor-pointer relative pl-4"
                    >
                      <span
                        className={`absolute left-0 top-0 h-full w-0.75 rounded-full transition-colors ${
                          activeIndex === index
                            ? "bg-[#22558B]"
                            : "bg-transparent"
                        }`}
                      />

                      <span
                        className={`text-sm leading-6 block transition-colors ${
                          activeIndex === index
                            ? "text-[#22558B] font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
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
