import React from "react";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";

interface BlogCardProps {
  image: string;
  title: string;
  description: string;
  href?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  image,
  title,
  description,
  href = "#",
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col ">
      {/* Image */}
      <div className="relative w-full h-48 sm:h-52 lg:h-56">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 ">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug line-clamp-2">
            {title}
          </h3>

          <a
            href={href}
            className="text-gray-700 hover:text-black transition-colors shrink-0"
          >
            <FiArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </a>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-2 sm:line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );
};

export default BlogCard;
