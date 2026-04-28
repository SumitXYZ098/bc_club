"use client";
import { Heart } from "lucide-react";
import Image from "next/image";
import React from "react";
import LineGradient from "../lineGradient/LineGradient";
import Description, { IDescriptionTypes } from "../../description/Description";
import { Icons, Images } from "@/src/app/exports";
import CustomButton from "../../button/CustomButton";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/src/mainComponents/auth/AuthContext";
import {
  useGetMe,
  useRemoveFromWishlist,
  useToggleWishlist,
  useToggleDdfWishlist,
  useRemoveDdfWishlist,
} from "@/src/hooks/listing/useListingQueries";
import dayjs from "dayjs";
import { getTime } from "@/src/utilities/utilities";

export interface PropertyCardProps {
  id: string;
  image: string;
  title: string;
  price: number;
  daysAgo: number;
  address: string;
  sqft: string | number;
  beds: number;
  baths: number;
  priceDrop?: number;
  assessedDiff: number;
  mls: string;
  realtor: string;
  isLogin?: boolean;
  isExpired?: boolean;
  isSold?: boolean;
  isFavourite?: boolean;
  isDdf?: boolean;
}

const PropertiesCard: React.FC<PropertyCardProps> = ({
  id,
  image,
  title,
  price,
  daysAgo,
  address,
  sqft,
  beds,
  baths,
  priceDrop,
  assessedDiff,
  mls,
  realtor,
  isExpired,
  isSold,
  isFavourite: isFavouriteProp,
  isLogin: isLoginProp,
  isDdf,
}) => {
  const pathname = usePathname();
  const { data: me } = useGetMe();
  const normalToggle = useToggleWishlist();
  const ddfToggle = useToggleDdfWishlist();
  const toggleWishlist = isDdf ? ddfToggle : normalToggle;

  const normalRemove = useRemoveFromWishlist();
  const ddfRemove = useRemoveDdfWishlist();
  const removeFromWishlist = isDdf ? ddfRemove : normalRemove;

  const [localIsFavourite, setLocalIsFavourite] = React.useState(false);

  const isFavourite =
    me?.favorites?.some(
      (item: any) =>
        item.documentId === id ||
        String(item.id) === String(id) ||
        String(item) === String(id),
    ) ||
    isFavouriteProp ||
    false;

  // Sync local state with global/prop state
  React.useEffect(() => {
    setLocalIsFavourite(isFavourite);
  }, [isFavourite]);

  const { setOpenLogin, isLoggedIn } = useAuthContext();
  const isLogin = isLoginProp ?? isLoggedIn;

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Toggle Wishlist Clicked:", { id, isDdf });

    if (toggleWishlist.isPending) return;

    if (!isLogin) {
      setOpenLogin(true);
      return;
    }

    setLocalIsFavourite(true);
    toggleWishlist.mutate(id);
  };

  const handleRemoveFromWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (removeFromWishlist.isPending) return;

    setLocalIsFavourite(false);
    removeFromWishlist.mutate(id);
  };
  const displayPrice = isLogin ? `$${Number(price || 0).toLocaleString()}` : "$*,***,***";
  const displayAddress = isLogin ? address : "Sign in to view address";
  const displayTitle = isLogin ? title : "Property Details Restricted";
  const displaySqft = isLogin ? `${sqft} sqft` : "---- sqft";
  const displayBeds = isLogin ? beds : "---";
  const displayBaths = isLogin ? baths : "---";
  const displayMls = isLogin ? `MLS® ${mls}` : "MLS® *******";
  const displayRealtor = isLogin
    ? `Courtesy of: ${realtor}`
    : "Courtesy of: **********";


  const img = image ? image : Images.apartment;

 

  return (
    <Link
      href={`${!isLogin ? "#" : `/property-info/${id}`}`}
      className="w-full h-full flex"
    >
      <div
        className={`relative rounded-xl flex overflow-hidden border border-borderColor hover:border-none hover:shadow-[0_0_20px_0_rgba(0,0,0,0.12)] transition h-auto w-full ${
          isLogin ? "group" : ""
        }`}
      >
        <div className="flex flex-col gap-y-3 xl:p-5 p-4 w-full h-full justify-between">
          <div className="relative">
            <div className="w-full h-56 overflow-clip rounded-lg">
              {img ? (
                <Image
                  src={img}
                  alt={displayTitle}
                  className={`w-full h-56 object-cover rounded-lg transition duration-300 ease-in-out ${
                    isLogin ? "group-hover:scale-125" : "blur-sm"
                  }`}
                  width={700}
                  height={403}
                  loading="eager"
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 rounded-lg animate-pulse" />
              )}
            </div>

            {/* Favorite Icon */}
            {!isExpired && !isSold && isLoggedIn && (
              <button
                onClick={
                  localIsFavourite ? handleRemoveFromWishlist : handleToggleWishlist
                }
                className="absolute top-3 left-3 bg-background p-2 rounded-full shadow z-20 cursor-pointer"
              >
                <Heart
                  className="w-5 h-5"
                  color={localIsFavourite ? "var(--red)" : "var(--primary)"}
                  fill={localIsFavourite ? "var(--red)" : "none"}
                />
              </button>
            )}

            {/* Days Ago */}
            {daysAgo !== 0 && (
              <span className="absolute top-3 right-3 bg-background text-primary px-3 py-1.5 text-sm rounded-full">
                {getTime(daysAgo)}
              </span>
            )}

            {/* Price Drop Banner */}
            {priceDrop !== undefined && priceDrop > 0 && (
              <span
                className="absolute bottom-3 right-0 bg-secondary text-background pl-7 pr-3 pt-2 pb-2 text-xs h-auto font-medium"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 15% 50%)",
                }}
              >
                Price Drop {priceDrop}%
              </span>
            )}

            {isSold && (
              <span
                className="absolute bottom-3 left-0 bg-red text-background pl-3 pr-7 pt-2 pb-2 text-xs h-auto font-medium"
                style={{
                  clipPath: "polygon(100% 0, 76% 49%, 100% 100%, 0 98%, 0 0)",
                }}
              >
                Sold
              </span>
            )}

            {isExpired && (
              <span
                className="absolute bottom-3 left-0 bg-gray text-black70 pl-3 pr-7 pt-2 pb-2 text-xs h-auto font-medium"
                style={{
                  clipPath: "polygon(100% 0, 76% 49%, 100% 100%, 0 98%, 0 0)",
                }}
              >
                Expired
              </span>
            )}
          </div>

          <div className="space-y-3 mt-1">
            <h3 className="font-bold text-xl">{displayTitle}</h3>
            <div
              className={`flex justify-between ${
                pathname === "/properties"
                  ? "xl:flex-col gap-y-1 xl:items-start items-end-safe"
                  : "items-end-safe"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs text-lightWhite">List Price Now</span>
                <p className="text-2xl font-bold text-primary">
                  {displayPrice}
                </p>
              </div>
              {/* Assessed Diff */}
              <p
                className={`text-[10px] leading-4 inline-flex items-center gap-1 p-1 rounded-md ${
                  assessedDiff < 0
                    ? "text-green bg-lightGreen"
                    : "text-red bg-lightRed"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <rect
                    width="20"
                    height="20"
                    rx="2"
                    className={`${
                      assessedDiff < 0 ? "fill-green" : "fill-red"
                    }`}
                  />
                  {assessedDiff > 0 ? (
                    <path
                      d="M15 7.5L12.3535 10.1465C12.2597 10.2402 12.1326 10.2929 12 10.2929C11.8674 10.2929 11.7403 10.2402 11.6465 10.1465L10.8535 9.3535C10.7597 9.25976 10.6326 9.20711 10.5 9.20711C10.3674 9.20711 10.2403 9.25976 10.1465 9.3535L8 11.5"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d="M15.8319 11.2963L12.4012 7.86562C12.2797 7.74411 12.1149 7.67585 11.943 7.67585C11.7711 7.67585 11.6063 7.74411 11.4848 7.86562L10.4568 8.89358C10.3352 9.01509 10.1704 9.08335 9.99855 9.08335C9.82669 9.08335 9.66186 9.01509 9.54031 8.89358L6.75781 6.11108"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                  <path
                    d="M4.16406 4.16663V13.7592C4.16406 14.4851 4.16406 14.8481 4.30536 15.1255C4.42964 15.3694 4.62794 15.5677 4.87184 15.692C5.14925 15.8333 5.51221 15.8333 6.23814 15.8333H15.8307"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                {Math.abs(assessedDiff)}% than Assessed Value {dayjs().year()}
              </p>
            </div>

            <p className="text-lightWhite text-sm line-clamp-1">
              {displayAddress}
            </p>

            {/* Specs */}
            <div
              className={`flex items-center justify-between ${
                pathname === "/properties" ? "gap-x-1" : "gap-3"
              }`}
            >
              <div className="flex flex-row items-center gap-x-1 justify-center py-2 rounded-md bg-gray text-lightWhite text-sm w-full">
                <Image
                  src={Icons.scale}
                  alt="sqft"
                  width={100}
                  height={100}
                  className="w-5 h-5 object-contain"
                />
                <span>{displaySqft}</span>
              </div>
              <div className="flex flex-row items-center gap-x-1 justify-center py-2 rounded-md bg-gray text-lightWhite text-sm w-full">
                <Image
                  src={Icons.bedroom}
                  alt="bedroom"
                  width={100}
                  height={100}
                  className="w-5 h-5 object-contain"
                />
                <span>{displayBeds}</span>
              </div>
              <div className="flex flex-row items-center gap-x-1 justify-center py-2 rounded-md bg-gray text-lightWhite text-sm w-full">
                <Image
                  src={Icons.bathtub}
                  alt="bathtub"
                  width={100}
                  height={100}
                  className="w-5 h-5 object-contain"
                />
                <span>{displayBaths}</span>
              </div>
            </div>
            <LineGradient />
         <div className="w-full flex flex-row flex-wrap items-center justify-between gap-2">
  <div className="min-w-0 flex-1">
    <Description
      content={displayRealtor}
      type={IDescriptionTypes.dec12}
      customClasses="text-lightWhite truncate"
    />
  </div>

  <div className="min-w-0 shrink-0">
    <Description
      content={displayMls}
      type={IDescriptionTypes.dec12}
      customClasses="text-lightWhite"
    />
  </div>
</div>
          </div>
        </div>

        {!isLogin && (
          <div className="bg-[#FFFFFF1f] backdrop-blur-md w-full h-full absolute z-30 rounded-xl justify-center items-center-safe flex flex-col">
            <CustomButton
              label="Login Required"
              buttonType="primary"
              customClasses="font-bold py-4 px-18.5"
              onClick={() => {
                setOpenLogin(true);
              }}
            />
          </div>
        )}
      </div>
    </Link>
  );
};

export default PropertiesCard;
