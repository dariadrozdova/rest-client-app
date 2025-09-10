import { useState } from "react";

import type {
  BodyEditorActions,
  BodyEditorState,
} from "@/app/[locale]/(protected)/_components/body-editor/types";
import { isJsonLike } from "@/app/[locale]/(protected)/_components/body-editor/utils";
import { useRequest } from "@/app/[locale]/(protected)/main/_modules/request-context";

export function useBodyEditor(): BodyEditorActions & BodyEditorState {
  const { body, setBody } = useRequest();
  const [jsonError, setJsonError] = useState<string>("");
  const [contentType, setContentType] = useState<string>("application/json");

  const prettifyJson = () => {
    if (!body.trim()) {
      return;
    }

    try {
      const parsed = JSON.parse(body);
      const prettified = JSON.stringify(parsed, null, 2);
      setBody(prettified);
      setJsonError("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON";
      setJsonError(message);
    }
  };

  const clearBody = () => {
    setBody("");
    setJsonError("");
  };

  const handleBodyChange = (value: string) => {
    setBody(value);

    if (jsonError) {
      setJsonError("");
    }

    const looksLikeJson = isJsonLike(value);

    if (looksLikeJson && contentType !== "application/json") {
      setContentType("application/json");
    } else if (!looksLikeJson && contentType === "application/json") {
      setContentType("text/plain");
    }
  };

  return {
    body,
    jsonError,
    contentType,
    setBody,
    setJsonError,
    setContentType,
    prettifyJson,
    clearBody,
    handleBodyChange,
  };
}
