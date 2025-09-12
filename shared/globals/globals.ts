import type { Section, selectedMethodState } from "@/shared/types";
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
      { href: "", labelKey: "sections.product.links.howItWorks" },
      { href: "", labelKey: "sections.product.links.clients" },
      { href: "", labelKey: "sections.product.links.pricing" },
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

export const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "OPTIONS",
  "HEAD",
] as const satisfies readonly selectedMethodState["selectedMethod"][];

export const TABS = [
  "Headers",
  "Body",
  "Variables",
  "CodeGen",
  "Request History",
];

export const LINE_HEIGHT_REM = 1.25;
export const CHAR_WIDTH_REM = 0.5;
export const PADDING_REM = 1;
export const VARIABLE_REGEX = /\{\{([A-Za-z0-9_.-]+)\}\}/g;
export const LANG_GEN = [
  {
    key: "curl",
    label: "cURL",
    language: "curl",
    variant: "curl",
    highlight: "bash",
  },
  {
    key: "js-fetch",
    label: "JavaScript (Fetch)",
    language: "javascript",
    variant: "fetch",
    highlight: "javascript",
  },
  {
    key: "js-xhr",
    label: "JavaScript (XHR)",
    language: "javascript",
    variant: "xhr",
    highlight: "javascript",
  },
  {
    key: "node",
    label: "NodeJS",
    language: "nodejs",
    variant: "native",
    highlight: "javascript",
  },
  {
    key: "python",
    label: "Python",
    language: "python",
    variant: "requests",
    highlight: "python",
  },
  {
    key: "java",
    label: "Java",
    language: "java",
    variant: "okhttp",
    highlight: "java",
  },
  {
    key: "csharp",
    label: "C#",
    language: "csharp",
    variant: "httpclient",
    highlight: "csharp",
  },
  {
    key: "go",
    label: "Go",
    language: "go",
    variant: "native",
    highlight: "go",
  },
] as const;

export const STATUS_SUCCESS = {
  min: 200,
  max: 299,
  color: "text-green-600",
};

export const STATUS_CLIENT_ERROR = {
  min: 400,
  max: 499,
  color: "text-red-600",
};

export const STATUS_SERVER_ERROR = {
  min: 500,
  max: 599,
  color: "text-red-600",
};

export const STATUS_REDIRECT = {
  min: 300,
  max: 399,
  color: "text-yellow-600",
};

export const STATUS_INFO = {
  min: 100,
  max: 199,
  color: "text-yellow-600",
};
