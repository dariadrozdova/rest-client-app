"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";

import { setBody } from "@/store/slices/body-editor-slice";
import { setSelectedMethod } from "@/store/slices/method-slice";
import { setUrl } from "@/store/slices/url-slice";
import { isValidHttpMethod, validateUrlString } from "@/utils/helpers";
import { safeDecodeBase64Uri } from "@/utils/helpers/safe-decode-base64-uri";

export default function WorkspaceCatchAllPage() {
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    const rawSegments = Array.isArray(params.segments) ? params.segments : [];
    const methodSegment = rawSegments.length >= 1 ? rawSegments[0] : null;
    const endpointSegment = rawSegments.length >= 2 ? rawSegments[1] : null;
    const bodySegment = rawSegments.length >= 3 ? rawSegments[2] : null;

    if (typeof methodSegment === "string" && isValidHttpMethod(methodSegment)) {
      dispatch(setSelectedMethod(methodSegment));
    } else {
      dispatch(setSelectedMethod("GET"));
    }

    if (endpointSegment) {
      const decodedEndpoint = safeDecodeBase64Uri(endpointSegment);
      if (decodedEndpoint && validateUrlString(decodedEndpoint)) {
        dispatch(setUrl(decodedEndpoint));
      }
    } else {
      dispatch(setUrl(""));
    }

    if (bodySegment) {
      const decodedBody = safeDecodeBase64Uri(bodySegment);
      if (decodedBody !== null) {
        dispatch(setBody(decodedBody));
      }
    } else {
      dispatch(setBody(""));
    }
  }, [dispatch, params.segments]);

  return null;
}
