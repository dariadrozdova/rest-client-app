import { useDispatch, useSelector } from "react-redux";

import type {
  BodyEditorActions,
  BodyEditorState,
} from "@app/[locale]/(protected)/_components/body-editor/types";
import { isJsonLike } from "@app/[locale]/(protected)/_components/body-editor/utils";
import {
  clearJsonError,
  setBody as setBodyAction,
  setContentType as setContentTypeAction,
  setJsonError as setJsonErrorAction,
} from "@store/slices/body-editor-slice";
import type { RootState } from "@store/store";

export function useBodyEditor(): BodyEditorActions & BodyEditorState {
  const dispatch = useDispatch();

  const { body, contentType, jsonError } = useSelector(
    (state: RootState) => state.bodyEditor,
  );

  const setBody = (value: string) => {
    dispatch(setBodyAction(value));
  };

  const setContentType = (type: string) => {
    dispatch(setContentTypeAction(type));
  };

  const setJsonError = (error: string) => {
    dispatch(setJsonErrorAction(error));
  };

  const prettifyJson = () => {
    if (!body.trim()) {
      return;
    }

    try {
      const parsed = JSON.parse(body);
      const prettified = JSON.stringify(parsed, null, 2);
      setBody(prettified);
      dispatch(clearJsonError());
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON";
      dispatch(setJsonErrorAction(message));
    }
  };

  const clearBody = () => {
    setBody("");
    dispatch(clearJsonError());
  };

  const handleBodyChange = (value: string) => {
    setBody(value);

    if (jsonError) {
      dispatch(clearJsonError());
    }

    const looksLikeJson = isJsonLike(value);

    if (looksLikeJson && contentType !== "application/json") {
      dispatch(setContentTypeAction("application/json"));
    } else if (!looksLikeJson && contentType === "application/json") {
      dispatch(setContentTypeAction("text/plain"));
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
