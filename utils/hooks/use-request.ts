import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearError,
  clearResponse,
  executeRequest,
} from "@store/slices/request-slice";
import { AppDispatch, RootState } from "@store/store";

import { selectResolvedRequest } from "@/app/[locale]/(protected)/_components/codegen/resolve-request";

export function useRequest() {
  const dispatch = useDispatch<AppDispatch>();

  const requestState = useSelector((state: RootState) => state.request);
  const resolvedOutput = useSelector(selectResolvedRequest);

  const sendRequest = useCallback(() => {
    if (resolvedOutput.canGenerate && !requestState.isLoading) {
      dispatch(executeRequest());
    }
  }, [dispatch, resolvedOutput.canGenerate, requestState.isLoading]);

  const clearRequestResponse = useCallback(() => {
    dispatch(clearResponse());
  }, [dispatch]);

  const clearRequestError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    isLoading: requestState.isLoading,
    error: requestState.error,
    response: requestState.response,
    canSendRequest: resolvedOutput.canGenerate,
    issues: resolvedOutput.issues,

    sendRequest,
    clearResponse: clearRequestResponse,
    clearError: clearRequestError,
  };
}
