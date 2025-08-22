export const siteConfig = {
  name: "Random Ramblings",
  description: "Here lies a man whose name was writ in water.",
  url: "https://joshua-seprodi.com",
  ogImage: "https://joshua-seprodi.com/og.jpg",
  author: {
    name: "Joshua Seprodi",
    email: "jseprodi@gmail.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
