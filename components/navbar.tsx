"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { useState } from "react";

export const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold text-inherit">SEA CATERING</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden lg:flex" justify="center">
        <ul className="flex gap-4">
          {siteConfig.navItems &&
            siteConfig.navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <NavbarItem key={item.href}>
                  <NextLink
                    className={clsx(
                      linkStyles({ color: "foreground" }),
                      "data-[active=true]:text-primary data-[active=true]:font-medium transition-colors",
                      isActive && "text-primary font-medium"
                    )}
                    href={item.href}
                  >
                    {item.label}
                  </NextLink>
                </NavbarItem>
              );
            })}
        </ul>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Button
            as={NextLink}
            color="primary"
            className="font-medium"
            href="/login"
            variant="solid"
          >
            Login
          </Button>
        </NavbarItem>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
      </NavbarContent>

      <NavbarMenu>
        {siteConfig?.navItems?.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <NavbarMenuItem key={item.href}>
              <Link
                color={isActive ? "primary" : "foreground"}
                href={item.href}
                size="lg"
                className={clsx("w-full", isActive && "font-semibold")}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          );
        }) || []}
        <NavbarMenuItem key="login-mobile">
          <Button
            as={Link}
            color="primary"
            className="font-medium w-full mt-4"
            href="/login"
            variant="solid"
          >
            Login
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
