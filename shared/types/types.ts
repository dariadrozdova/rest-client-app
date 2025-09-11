import { ReactNode } from "react";

import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from "@reduxjs/toolkit";

import { HTTP_METHODS } from "@/shared/globals";

export interface ButtonProps {
  children: ReactNode;
  disabled?: boolean;
}

export interface HeaderItem {
  enabled: boolean;
  id: string;
  key: string;
  value: string;
}

export interface HeadersState {
  items: HeaderItem[];
}

export type HttpMethod = (typeof HTTP_METHODS)[number];

export interface InputFieldProps {
  autoComplete?: string;
  onChange: (value: string) => void;
  placeholder: string;
  type: string;
  value: string;
}

export interface KeyValueEditorProps {
  items: KeyValueItem[];
  keyPlaceholder: string;
  onEnsureTrailingEmpty: ActionCreatorWithoutPayload;
  onRemoveRow: ActionCreatorWithPayload<string>;
  onToggleEnabled: ActionCreatorWithPayload<{ enabled: boolean; id: string }>;
  onUpdateKey: ActionCreatorWithPayload<{ id: string; key: string }>;
  onUpdateValue: ActionCreatorWithPayload<{ id: string; value: string }>;
  title: string;
  valuePlaceholder: string;
}

export interface KeyValueItem {
  enabled: boolean;
  id: string;
  key: string;
  value: string;
}

export interface KeyValueRowProps {
  index: number;
  items: KeyValueItem[];
  keyPlaceholder: string;
  onEnsureTrailingEmpty: ActionCreatorWithoutPayload;
  onRemoveRow: ActionCreatorWithPayload<string>;
  onToggleEnabled: ActionCreatorWithPayload<{ enabled: boolean; id: string }>;
  onUpdateKey: ActionCreatorWithPayload<{ id: string; key: string }>;
  onUpdateValue: ActionCreatorWithPayload<{ id: string; value: string }>;
  row: KeyValueItem;
  valuePlaceholder: string;
}

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

export type Selected = selectedMethodState["selectedMethod"];

export interface selectedMethodState {
  selectedMethod:
    | "DELETE"
    | "GET"
    | "HEAD"
    | "OPTIONS"
    | "PATCH"
    | "POST"
    | "PUT";
}

export interface TabOpenState {
  activeTab: "body" | "codegen" | "headers" | "requestHistory" | "variables";
}

export interface UrlState {
  httpUrl: string;
}

export interface VariableItem {
  enabled: boolean;
  id: string;
  key: string;
  value: string;
}

export interface VariablesState {
  items: VariableItem[];
}
