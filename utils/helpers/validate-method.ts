import { HttpMethod } from "@/shared/types";

export const isValidHttpMethod = (
  method: null | string,
): method is HttpMethod => {
  const validMethods = new Set<string>([
    "DELETE",
    "GET",
    "HEAD",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
  ]);
  return method !== null && validMethods.has(method);
};
