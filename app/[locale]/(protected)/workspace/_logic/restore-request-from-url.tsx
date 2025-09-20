"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";

import { setBody } from "@/store/slices/body-editor-slice";
import { setSelectedMethod } from "@/store/slices/method-slice";
import { setUrl } from "@/store/slices/url-slice";
import { isValidHttpMethod, validateUrlString } from "@/utils/helpers";
import { fromBase64Utf8 } from "@/utils/helpers/base64";

export function RestoreRequestFromUrl() {
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    const methodParameter = Array.isArray(params.method)
      ? params.method[0]
      : params.method;
    const endpointParameter = Array.isArray(params.endpointBase64)
      ? params.endpointBase64[0]
      : params.endpointBase64;
    const bodyParameter = Array.isArray(params.bodyBase64)
      ? params.bodyBase64[0]
      : params.bodyBase64;

    if (
      typeof methodParameter === "string" &&
      isValidHttpMethod(methodParameter)
    ) {
      dispatch(setSelectedMethod(methodParameter));
    } else {
      dispatch(setSelectedMethod("GET"));
    }

    if (endpointParameter) {
      const decodedEndpoint = fromBase64Utf8(endpointParameter);
      if (decodedEndpoint && validateUrlString(decodedEndpoint)) {
        dispatch(setUrl(decodedEndpoint));
      } else {
        dispatch(setUrl(""));
      }
    } else {
      dispatch(setUrl(""));
    }

    if (bodyParameter) {
      const decodedBody = fromBase64Utf8(bodyParameter);
      if (decodedBody === null) {
        dispatch(setBody(""));
      } else {
        dispatch(setBody(decodedBody));
      }
    } else {
      dispatch(setBody(""));
    }
  }, [dispatch, params.method, params.endpointBase64, params.bodyBase64]);

  return null;
}
