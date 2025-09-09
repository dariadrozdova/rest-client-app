export type HttpMethod = (typeof HTTP_METHODS)[number];
import { HTTP_METHODS } from "@/shared/globals";

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
