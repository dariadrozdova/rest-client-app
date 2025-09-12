import type { CodeLangGen, Section, selectedMethodState } from "@/shared/types";
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

export const MOCK_RESPONSE = `{
  "status": 200,
  "statusText": "OK",
  "headers": {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-cache",
    "x-request-id": "abc123xyz"
  },
  "body": {
    "user": {
      "id": 42,
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "roles": ["admin", "editor"]
    },
    "posts": [
      {
        "id": 101,
        "title": "Hello World",
        "created_at": "2025-09-09T10:15:00Z"
      },
      {
        "id": 102,
        "title": "REST Client Example",
        "created_at": "2025-09-09T10:20:00Z"
      }
    ]
  },
  "meta": {
    "request_duration_ms": 123,
    "response_size_bytes": 456
  }
}`;

export const LINE_HEIGHT_REM = 1.25;
export const CHAR_WIDTH_REM = 0.5;
export const PADDING_REM = 1;
export const VARIABLE_REGEX = /\{\{([A-Za-z0-9_.-]+)\}\}/g;
export const LANG_GEN: readonly CodeLangGen[] = [
  {
    key: "curl",
    label: "cURL",
    language: "curl",
    variant: "curl",
    highlight: "bash",
    snippetLang: "shell",
    snippetClient: "curl",
  },
  {
    key: "js-fetch",
    label: "JavaScript (Fetch)",
    language: "javascript",
    variant: "fetch",
    highlight: "javascript",
    snippetLang: "javascript",
    snippetClient: "fetch",
  },
  {
    key: "js-xhr",
    label: "JavaScript (XHR)",
    language: "javascript",
    variant: "xhr",
    highlight: "javascript",
    snippetLang: "javascript",
    snippetClient: "xhr",
  },
  {
    key: "node",
    label: "NodeJS",
    language: "nodejs",
    variant: "native",
    highlight: "javascript",
    snippetLang: "node",
    snippetClient: "fetch",
  },
  {
    key: "python",
    label: "Python",
    language: "python",
    variant: "requests",
    highlight: "python",
    snippetLang: "python",
    snippetClient: "requests",
  },
  {
    key: "java",
    label: "Java",
    language: "java",
    variant: "okhttp",
    highlight: "java",
    snippetLang: "java",
    snippetClient: "okhttp",
  },
  {
    key: "csharp",
    label: "C#",
    language: "csharp",
    variant: "httpclient",
    highlight: "csharp",
    snippetLang: "csharp",
    snippetClient: "httpclient",
  },
  {
    key: "go",
    label: "Go",
    language: "go",
    variant: "native",
    highlight: "go",
    snippetLang: "go",
    snippetClient: "native",
  },
] as const;
