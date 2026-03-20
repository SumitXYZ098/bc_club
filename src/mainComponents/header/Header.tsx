/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Icons } from "@/src/app/exports";
import { useMediaQuery } from "@/src/hooks/useMediaQuery";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import NavBarDrawer from "./NavBarDrawer";
import CustomButton from "@/src/components/button/CustomButton";

import { useAuthContext } from "../auth/AuthContext";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

export const menulist = [
  { title: "Evaluation", href: "/home-estimation" },
  { title: "Market Trends", href: "/market-trends" },
  { title: "Properties", href: "/properties" },
  { title: "Contact Us", href: "/contact-us" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isLaptop = useMediaQuery("(min-width: 1200px)");
  const [showMenu, setShowMenu] = useState(false);

  const { setOpenLogin, setOpenSignup, isLoggedIn, username, logoutUser } =
    useAuthContext();

  useEffect(() => {
    if (!isLaptop) {
      setIsVisible(true);
      return;
    }

    setLastScrollY(window.scrollY);
    setIsScrolled(window.scrollY > 80);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      currentScrollY < lastScrollY || currentScrollY < 100
        ? setIsVisible(true)
        : setIsVisible(false);

      setLastScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isLaptop]);

  const navVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20, mass: 1 },
    },
    exit: {
      y: -100,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const onPressMenuButton = useCallback(() => {
    setShowMenu((prev) => !prev);
  }, []);

  // Get active pathname
  const pathname = usePathname();

  return (
    <AnimatePresence>
      <motion.header
        initial="hidden"
        animate={isVisible ? "visible" : "exit"}
        variants={navVariants as any}
        className={`xl:max-w-screen-2xl mx-auto xl:px-16 md:px-13 px-6 xl:py-6 md:py-4 py-3 flex items-center justify-between w-full fixed top-0 left-0 right-0 z-999 ${
          isLaptop
            ? isScrolled
              ? "bg-background shadow"
              : "bg-transparent"
            : "shadow bg-background"
        }`}
      >
        {/* Logo */}
        <Link href={"/"} className="xl:hidden block">
          <Image
            alt="logo"
            src={Icons.bcClub}
            width={119}
            height={42}
            className="w-22.5 h-9 object-contain"
          />
        </Link>

        <Link href={"/"} className="xl:block hidden">
          <Image
            alt="logo"
            src={Icons.bcClub}
            width={119}
            height={42}
            className="w-29.75 h-10.5 object-contain"
          />
        </Link>

        <nav className="hidden xl:flex justify-end-safe items-center-safe gap-x-5">
          <div className="flex items-center gap-x-5">
            {menulist.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className={`text-foreground text-base uppercase hover:font-medium transition-all duration-300 ${
                  pathname === item.href && "font-medium"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* LOGIN / SIGNUP BUTTONS */}
          {isLoggedIn ? (
            <div className="dropdown dropdown-hover dropdown-end">
              <div
                className="flex items-center gap-x-2 cursor-pointer"
                tabIndex={0}
                role="button"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="text-primary font-bold uppercase">
                  {username}
                </span>
              </div>
              <div
                tabIndex={-1}
                className="dropdown-content menu bg-white rounded-box z-1 px-3 py-1 shadow-sm gap-y-2 w-fit"
              >
                <span
                  onClick={logoutUser}
                  className="flex items-center gap-0.5 w-full cursor-pointer group text-secondary-text hover:text-primary hover:bg-background hover:font-medium px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out"
                >
                  <LogOut className="group-hover:text-primary" />
                  Logout
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-x-3">
              <CustomButton
                label="Login"
                buttonType="primary"
                onClick={() => setOpenLogin(true)}
                customClasses="w-[132px]"
              />

              <CustomButton
                label="Sign up"
                buttonType="secondary-outlined"
                onClick={() => setOpenSignup(true)}
                customClasses="w-[132px]"
              />
            </div>
          )}
        </nav>

        {/* Mobile Menu */}
        <div onClick={onPressMenuButton} className="block xl:hidden">
          <button
            className="group inline-flex md:w-12 md:h-12 w-9 h-9 text-primary text-center items-center justify-center rounded shadow-[0_1px_0_--theme(--color-slate-950/.04),0_1px_2px_--theme(--color-slate-950/.12),inset_0_-2px_0_--theme(--color-slate-950/.04)] hover:shadow-[0_1px_0_--theme(--color-slate-950/.04),0_4px_8px_--theme(--color-slate-950/.12),inset_0_-2px_0_--theme(--color-slate-950/.04)] transition"
            aria-pressed={showMenu}
            type="button"
          >
            <span className="sr-only">Menu</span>
            <svg
              className="w-6 h-6 fill-current pointer-events-none"
              viewBox="0 0 16 16"
            >
              <rect
                className="origin-center -translate-y-1.25 translate-x-1.75 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-pressed:translate-x-0 group-aria-pressed:translate-y-0 group-aria-pressed:rotate-315"
                y="7"
                width="9"
                height="2"
                rx="1"
              />
              <rect
                className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-pressed:rotate-45"
                y="7"
                width="16"
                height="2"
                rx="1"
              />
              <rect
                className="origin-center translate-y-1.25 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-pressed:translate-y-0 group-aria-pressed:rotate-135"
                y="7"
                width="9"
                height="2"
                rx="1"
              />
            </svg>
          </button>
        </div>

        <NavBarDrawer open={showMenu} onClose={onPressMenuButton} />
      </motion.header>
    </AnimatePresence>
  );
};

export default Header;
