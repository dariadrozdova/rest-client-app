export interface HeaderItem {
  enabled: boolean;
  id: string;
  key: string;
  value: string;
}
import { HTTP_METHODS } from "@/shared/globals";

export interface HeadersState {
  items: HeaderItem[];
}

export type HttpMethod = (typeof HTTP_METHODS)[number];

export interface Language {
  code: "be" | "en" | "ru";
  name: string;
}

export interface LinkItem {
  external?: boolean;
  href: string;
  labelKey: string;
}

export interface ResponsePaneProps {
  response: string;
}

export interface Section {
  id: string;
  links: LinkItem[];
  titleKey: string;
}

export interface TabOpenState {
  activeTab: "body" | "codegen" | "headers" | "requestHistory" | "variables";
}
