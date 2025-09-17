"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, usePathname, useRouter } from "next/navigation";

import { RootState } from "@store/store";

import { toBase64Utf8 } from "@/utils/helpers/base64";

const DEBOUNCE_MS = 300;

export function WorkspaceUrlSync() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const locale = Array.isArray(params.locale)
    ? params.locale[0]
    : params.locale;

  const selectedMethod = useSelector(
    (state: RootState) => state.method.selectedMethod,
  );
  const httpUrl = useSelector((state: RootState) => state.httpUrl.httpUrl);
  const requestBody = useSelector((state: RootState) => state.bodyEditor.body);

  const timeoutReference = useRef<null | ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (!locale || !selectedMethod) {
      return;
    }

    if (timeoutReference.current) {
      clearTimeout(timeoutReference.current);
    }

    timeoutReference.current = setTimeout(() => {
      const basePath = `/${locale}/workspace/${selectedMethod}`;
      const encodedUrl = httpUrl.trim()
        ? encodeURIComponent(toBase64Utf8(httpUrl))
        : null;
      const encodedBody = requestBody.trim()
        ? encodeURIComponent(toBase64Utf8(requestBody))
        : null;

      let nextPath = basePath;
      if (encodedUrl) {
        nextPath += `/${encodedUrl}`;
        if (encodedBody) {
          nextPath += `/${encodedBody}`;
        }
      }

      if (pathname !== nextPath) {
        router.replace(nextPath);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timeoutReference.current) {
        clearTimeout(timeoutReference.current);
      }
    };
  }, [locale, pathname, router, selectedMethod, httpUrl, requestBody]);

  return null;
}
