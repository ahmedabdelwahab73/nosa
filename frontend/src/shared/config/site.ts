export const siteConfig = {
  name: "Nosa Handmade Crafts",
  shortName: "Nosa",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100",
  logo: {
    dark: "/brand/logo.png",
    light: "/brand/logo-light.png",
    width: 286,
    height: 308,
  },
} as const;
