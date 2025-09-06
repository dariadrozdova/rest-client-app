import type { Section } from "@/shared/types";
import type { Language } from "@/shared/types";

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "be", name: "Беларуская" },
] as const satisfies readonly Language[];

export const FOOTER_SECTIONS: Section[] = [
  {
    id: "product",
    links: [
      { href: "/#how-it-works", labelKey: "sections.product.links.howItWorks" },
      { href: "/#clients", labelKey: "sections.product.links.clients" },
      { href: "/pricing", labelKey: "sections.product.links.pricing" },
    ],
    titleKey: "sections.product.title",
  },
  {
    id: "team",
    links: [
      {
        external: true,
        href: "https://github.com/dariadrozdova",
        labelKey: "sections.team.links.daria",
      },
      {
        external: true,
        href: "https://github.com/whowouldwin",
        labelKey: "sections.team.links.valeria",
      },
      {
        external: true,
        href: "https://github.com/aashapovalov",
        labelKey: "sections.team.links.aleksei",
      },
    ],
    titleKey: "sections.team.title",
  },
  {
    id: "inspired",
    links: [
      {
        external: true,
        href: "https://rs.school",
        labelKey: "sections.inspired.links.rsSchool",
      },
      {
        external: true,
        href: "https://rs.school/courses/reactjs",
        labelKey: "sections.inspired.links.reactCourse",
      },
      {
        external: true,
        href: "https://github.com/andron13",
        labelKey: "sections.inspired.links.mentor",
      },
    ],
    titleKey: "sections.inspired.title",
  },
  {
    id: "support",
    links: [
      {
        external: true,
        href: "https://boosty.to/rsschool",
        labelKey: "sections.support.links.boosty",
      },
      {
        href: "https://opencollective.com/rsschool",
        labelKey: "sections.support.links.opencollective",
      },
    ],
    titleKey: "sections.support.title",
  },
];
