import {
  STATUS_CLIENT_ERROR,
  STATUS_REDIRECT,
  STATUS_SERVER_ERROR,
  STATUS_SUCCESS,
} from "@/shared/globals";

export const getStatusColor = (status: number): string => {
  if (status >= STATUS_SUCCESS.min && status <= STATUS_SUCCESS.max) {
    return STATUS_SUCCESS.color;
  }
  if (status >= STATUS_CLIENT_ERROR.min && status <= STATUS_SERVER_ERROR.max) {
    return STATUS_CLIENT_ERROR.color;
  }
  if (status >= STATUS_REDIRECT.min && status <= STATUS_REDIRECT.max) {
    return STATUS_REDIRECT.color;
  }
  return "text-yellow-600";
};
