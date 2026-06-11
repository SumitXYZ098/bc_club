"use client";
import { Heart } from "lucide-react";
import Image from "next/image";
import React from "react";
import LineGradient from "../lineGradient/LineGradient";
import Description, { IDescriptionTypes } from "../../description/Description";
import { Icons, Images } from "@/src/app/exports";
import CustomButton from "../../button/CustomButton";
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
import { calculateAge, getTime } from "@/src/utilities/utilities";
import { IoArrowUpOutline, IoArrowDownOutline } from "react-icons/io5";

export interface SimilarPropertiesCardProps {
  id: string;
  image: string;
  title: string;
  price: number;
  daysAgo: number;
  address: string;
  sqft: string | number;
  beds: number;
  baths: number;
  lotSize?: number;
  priceDrop?: number;
  assessedDiff: number;
  mls: string;
  realtor: string;
  isLogin?: boolean;
  isExpired?: boolean;
  isSold?: boolean;
  isFavourite?: boolean;
  isDdf?: boolean;
  status?: string;
  likesCount?: number;
  structureType?: string;
  oldPrice?: number;
  age?: string;
  listingDate?: string;
  distance?: string;
}

const SimilarPropertiesCard: React.FC<SimilarPropertiesCardProps> = ({
  id,
  image,
  title,
  price,
  daysAgo,
  address,
  sqft,
  beds,
  baths,
  lotSize,
  assessedDiff,
  mls,
  realtor,
  isExpired,
  isSold,
  isFavourite: isFavouriteProp,
  isLogin: isLoginProp,
  isDdf,
  likesCount,
  structureType,
  oldPrice = 0,
  distance,
  age,
  listingDate,
}) => {
  const { data: me } = useGetMe();
  const ddfToggle = useToggleDdfWishlist();
  const toggleWishlist = ddfToggle;

  const ddfRemove = useRemoveDdfWishlist();
  const removeFromWishlist = ddfRemove;

  const [localIsFavourite, setLocalIsFavourite] = React.useState(false);
  const [localLikesCount, setLocalLikesCount] = React.useState(likesCount || 0);

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

  React.useEffect(() => {
    setLocalLikesCount(likesCount || 0);
  }, [likesCount, id]);

  const { setOpenLogin, isLoggedIn } = useAuthContext();
  const isLogin = isLoginProp ?? isLoggedIn;

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (toggleWishlist.isPending) return;

    if (!isLoggedIn) {
      setOpenLogin(true);
      return;
    }

    setLocalIsFavourite(true);
    setLocalLikesCount((prev) => prev + 1);
    toggleWishlist.mutate(id);
  };

  const handleRemoveFromWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (removeFromWishlist.isPending) return;

    if (!isLoggedIn) {
      setOpenLogin(true);
      return;
    }

    setLocalIsFavourite(false);
    setLocalLikesCount((prev) => Math.max(0, prev - 1));
    removeFromWishlist.mutate(id);
  };

  const displayPrice = isLogin
    ? `$${Number(price || 0).toLocaleString()}`
    : "$*,***,***";
  const displayAddress = isLogin ? address : "Sign in to view address";
  const displayTitle = isLogin
    ? title === "Single Family"
      ? structureType
      : title
    : "Property Details Restricted";
  const displaySqft = isLogin ? `${sqft} sft` : "---- sft";
  const displayBeds = isLogin ? beds : "---";
  const displayBaths = isLogin ? baths : "---";
  const displayLotSize = isLogin
    ? lotSize
      ? `${lotSize} sft`
      : "--- sft"
    : "---- sft";
  const displayMls = isLogin ? `MLS® ${mls}` : "MLS® *******";
  const displayRealtor = isLogin
    ? `Courtesy of: ${realtor}`
    : "Courtesy of: **********";

  const img = image ? image : Images.apartment;

  const isLinkDisabled = isExpired || isSold;
  const getHref = isLinkDisabled ? "#" : `/property-info/${id}`;

  return (
    <Link
      href={`${!isLogin ? "#" : getHref}`}
      className="w-full h-full flex"
      onClick={(e) => {
        if (isLinkDisabled) {
          e.preventDefault(); // Stop link from navigating
        }
      }}
    >
      <div
        className={`relative rounded-[20px] flex overflow-hidden shadow-[0_0_5px_0_rgba(21,21,21,0.19)] transition h-auto w-full ${
          isLogin ? "group" : ""
        }`}
      >
        <div className="flex flex-col justify-between w-full h-full">
          <div className="relative flex items-center">
            <div className="w-full h-56 overflow-clip rounded-t-2xl">
              {img ? (
                <Image
                  title="image title"
                  src={img}
                  alt={title}
                  className={`w-full h-full object-cover rounded-t-2xl transition duration-300 ease-in-out ${
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
            {!isExpired && !isSold && (
              <button
                onClick={
                  localIsFavourite
                    ? handleRemoveFromWishlist
                    : handleToggleWishlist
                }
                className="flex items-center absolute top-3 left-3 bg-background p-2 rounded-[18px] shadow z-20 cursor-pointer gap-0.5"
              >
                <Heart
                  className="w-5 h-5"
                  color={localIsFavourite ? "var(--red)" : "var(--primary)"}
                  fill={localIsFavourite ? "var(--red)" : "none"}
                />
                {localLikesCount > 0 && (
                  <span className="text-xs font-bold ml-1 text-black">
                    {localLikesCount}
                  </span>
                )}
              </button>
            )}

            {/* Days Ago */}
            {daysAgo !== 0 && (
              <span className="absolute top-3 right-3 bg-background text-primary px-3 py-1.5 text-sm rounded-full">
                {getTime(daysAgo)}
              </span>
            )}

            {/* Price Drop Banner */}
            {/* {oldPrice !== 0 && oldPrice && (
              <span
                className={`absolute bottom-5 right-0 p-1.5 text-xs inline-flex text-background h-auto items-center gap-0.5 uppercase  rounded-l-sm ${
                  price < oldPrice ? "bg-red/90" : "bg-green/90"
                }`}
              >
                {price < oldPrice ? (
                  <IoArrowDownOutline className="w-4 h-4 text-background" />
                ) : (
                  <IoArrowUpOutline className="w-4 h-4 text-background" />
                )}
                {price < oldPrice ? "Price Drop" : "Price Increase "}
              </span>
            )} */}

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

          <div className="space-y-2.5 mt-2.5 px-3 pb-3 lg:px-5 lg:pb-5">
            <p
              className="text-lightWhite text-sm line-clamp-1"
              title={displayAddress}
            >
              {displayAddress}
            </p>

            {/* Specs */}
            <LineGradient />
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-row items-center gap-x-1 text-primary2 text-sm w-auto">
                <Image
                  title="image title"
                  src={Icons.square}
                  alt="sqft"
                  width={100}
                  height={100}
                  className="w-5 h-5 object-contain"
                />
                <span>{displaySqft}</span>
              </div>
              <LineGradient vr />
              <div className="flex flex-row items-center gap-x-1 text-primary2 text-sm w-auto">
                <Image
                  title="image title"
                  src={Icons.bed}
                  alt="bedroom"
                  width={100}
                  height={100}
                  className="w-5 h-5 object-contain"
                />
                <span>{displayBeds}</span>
              </div>
              <LineGradient vr={true} />
              <div className="flex flex-row items-center gap-x-1 text-primary2 text-sm w-auto">
                <Image
                  title="image title"
                  src={Icons.bath}
                  alt="bathtub"
                  width={100}
                  height={100}
                  className="w-5 h-5 object-contain"
                />
                <span>{displayBaths}</span>
              </div>
              {lotSize && Number(lotSize) > 100 && (
                <>
                  <LineGradient vr={true} />
                  <div className="flex flex-row items-center gap-x-1 text-primary2 text-sm w-auto">
                    <Image
                      title="image title"
                      src={Icons.lotSize}
                      alt="lotSize"
                      width={100}
                      height={100}
                      className="w-5 h-5 object-contain"
                    />
                    <span>{displayLotSize}</span>
                  </div>
                </>
              )}
            </div>
            <div className="w-full flex flex-col flex-wrap items-center justify-between text-sm space-y-1">
              <div className="flex w-full justify-between flex-nowrap items-center">
                <span className=" opacity-40">Asking Price:</span>
                <span className="">{displayPrice}</span>
              </div>
              <LineGradient />
              <div className="flex w-full justify-between flex-nowrap items-center">
                <span className=" opacity-40">Listing Date:</span>
                <span className="">
                  {dayjs(listingDate)
                    .tz("America/Vancouver")
                    .format("DD MMM, YYYY")}
                </span>
              </div>
              <LineGradient />
              <div className="flex w-full justify-between flex-nowrap items-center">
                <span className=" opacity-40">Age:</span>
                <span className="">
                  {age ? `${calculateAge(age)} Years` : "N/A"}
                </span>
              </div>
              <LineGradient />
              <div className="flex w-full justify-between flex-nowrap items-center">
                <span className=" opacity-40">Days on Market:</span>
                <span className="">{listingDate && getTime(listingDate)}</span>
              </div>
              <LineGradient />
              <div className="flex w-full justify-between flex-nowrap items-center">
                <span className=" opacity-40">MLS Number:</span>
                <span className="">{mls}</span>
              </div>
              <LineGradient />
              <div className="flex w-full justify-between flex-nowrap items-center">
                <span className="opacity-40">Distance:</span>
                <span className="">{distance} km</span>
              </div>
              <LineGradient />
              <div className="flex w-full justify-between flex-nowrap items-center text-end">
                <span className="opacity-40 text-nowrap">Courtesy of:</span>
                <span className=" line-clamp-1">{realtor}</span>
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

export default SimilarPropertiesCard;
