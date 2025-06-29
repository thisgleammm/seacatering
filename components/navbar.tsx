"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import clsx from "clsx";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import { useSession, signOut } from "next-auth/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";

import { siteConfig } from "@/config/site";

export const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <HeroUINavbar
      className="fixed top-0 inset-x-0 h-16 z-50 backdrop-blur-sm backdrop-saturate-150 bg-background/70 border-b border-divider"
      isMenuOpen={isMenuOpen}
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
          {siteConfig.navItems?.map((item) => {
            const isActive = pathname === item.href;

            return (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium transition-colors",
                    isActive && "text-primary font-medium",
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
          {status === "authenticated" ? (
            <Dropdown>
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name={session.user?.name || "User"}
                  size="sm"
                  src={session.user?.image || undefined}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{session.user?.email}</p>
                </DropdownItem>
                <DropdownItem key="subscriptions">
                  <Link href="/subscribe">My Subscriptions</Link>
                </DropdownItem>
                {session.user?.role === "ADMIN" ? (
                  <DropdownItem key="admin">
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownItem>
                ) : null}
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={handleSignOut}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              as={NextLink}
              className="font-medium"
              color="primary"
              href="/auth/login"
              variant="solid"
            >
              Login
            </Button>
          )}
        </NavbarItem>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      </NavbarContent>

      <NavbarMenu>
        {siteConfig.navItems?.map((item) => {
          const isActive = pathname === item.href;

          return (
            <NavbarMenuItem key={item.href}>
              <Link
                className={clsx("w-full", isActive && "font-semibold")}
                color={isActive ? "primary" : "foreground"}
                href={item.href}
                size="lg"
                onClick={handleMenuItemClick}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          );
        })}
        {status === "authenticated" ? (
          <>
            <NavbarMenuItem>
              <Link
                className="w-full"
                color="foreground"
                href="/profile"
                size="lg"
                onClick={handleMenuItemClick}
              >
                My Profile
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                className="w-full"
                color="foreground"
                href="/subscribe"
                size="lg"
                onClick={handleMenuItemClick}
              >
                My Subscriptions
              </Link>
            </NavbarMenuItem>
            {session.user?.role === "ADMIN" && (
              <NavbarMenuItem>
                <Link
                  className="w-full"
                  color="foreground"
                  href="/admin"
                  size="lg"
                  onClick={handleMenuItemClick}
                >
                  Admin Dashboard
                </Link>
              </NavbarMenuItem>
            )}
            <NavbarMenuItem>
              <Button
                className="font-medium w-full mt-4"
                color="danger"
                variant="solid"
                onClick={() => {
                  handleSignOut();
                  handleMenuItemClick();
                }}
              >
                Log Out
              </Button>
            </NavbarMenuItem>
          </>
        ) : (
          <NavbarMenuItem key="login-mobile">
            <Button
              as={Link}
              className="font-medium w-full mt-4"
              color="primary"
              href="/auth/login"
              variant="solid"
              onClick={handleMenuItemClick}
            >
              Login
            </Button>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </HeroUINavbar>
  );
};
