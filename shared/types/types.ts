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

export interface CodeLangGen {
  highlight: string;
  key:
    | "csharp"
    | "curl"
    | "go"
    | "java"
    | "js-fetch"
    | "js-xhr"
    | "node"
    | "python";
  label: string;
  language: string;
  snippetClient?: SnippetClient;
  snippetLang: SnippetLang;
  variant: string;
}

export interface CodeLangOption {
  selectedMethod:
    | {
        highlight: "bash";
        key: "curl";
        label: "cURL";
        language: "curl";
        variant: "curl";
      }
    | {
        highlight: "csharp";
        key: "csharp";
        label: "C#";
        language: "csharp";
        variant: "httpclient";
      }
    | {
        highlight: "go";
        key: "go";
        label: "Go";
        language: "go";
        variant: "native";
      }
    | {
        highlight: "java";
        key: "java";
        label: "Java";
        language: "java";
        variant: "okhttp";
      }
    | {
        highlight: "javascript";
        key: "js-fetch";
        label: "JavaScript (Fetch)";
        language: "javascript";
        variant: "fetch";
      }
    | {
        highlight: "javascript";
        key: "js-xhr";
        label: "JavaScript (XHR)";
        language: "javascript";
        variant: "xhr";
      }
    | {
        highlight: "javascript";
        key: "node";
        label: "NodeJS";
        language: "nodejs";
        variant: "native";
      }
    | {
        highlight: "python";
        key: "python";
        label: "Python";
        language: "python";
        variant: "requests";
      };
}

export interface CodeLangState {
  selectedCodeLang: CodeLangGen;
}

export interface CopyButtonProps {
  text: string;
}

export interface DropdownOption<T = unknown> {
  isActive?: boolean;
  key?: number | string;
  label: string;
  value: T;
}

export interface DropdownProps<T = unknown> {
  activeOptionClassName?: string;
  ariaLabel?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  onSelect: (value: T) => void;
  optionClassName?: string;
  options: DropdownOption<T>[];
  selectedValue: T;
  width?: string;
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

export type Issue =
  | { detail?: string; type: "EMPTY_URL" }
  | { detail?: string; type: "INVALID_JSON_BODY" }
  | { detail?: string; type: "INVALID_URL" }
  | { detail?: string; type: "MISSING_METHOD" }
  | { fields: UnresolvedField[]; type: "UNRESOLVED_VARIABLES" };

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

export interface ResolvedHeader {
  name: string;
  value: string;
}

export interface ResolvedRequest {
  body: string | undefined;
  headers: ResolvedHeader[];
  meta: {
    contentType?: string;
    jsonMode: boolean;
  };
  method: HttpMethod;
  url: string;
}

export interface ResolvedSelectorOutput {
  canGenerate: boolean;
  debug?: {
    substitutedFields: ("body" | "headers" | "url")[];
    usedVariables: string[];
  };
  issues: Issue[];
  resolved?: ResolvedRequest;
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

export type SnippetClient =
  | "curl"
  | "fetch"
  | "httpclient"
  | "native"
  | "okhttp"
  | "requests"
  | "xhr";

export type SnippetLang =
  | "csharp"
  | "go"
  | "java"
  | "javascript"
  | "node"
  | "python"
  | "shell";

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

interface UnresolvedField {
  names: string[];
  scope: "body" | "headers" | "url";
}
