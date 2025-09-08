export interface Language {
  code: "be" | "en" | "ru";
  name: string;
}

export interface LinkItem {
  external?: boolean;
  href: string;
  labelKey: string;
}

export interface Section {
  id: string;
  links: LinkItem[];
  titleKey: string;
}
