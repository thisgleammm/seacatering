export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "SEA Catering",
  description: "Healthy Meals, Anytime, Anywhere",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Menu",
      href: "/menu",
    },
    {
      label: "Subscribe",
      href: "/subscribe",
    },
    {
      label: "Contact Us",
      href: "/contact",
    },
  ],
  navMenuItems: [
    {
      label: "Menu",
      href: "/menu",
    },
    {
      label: "Subscribe",
      href: "/subscribe",
    },
    {
      label: "Contact Us",
      href: "/contact",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
