import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as requestsApi from "../api/requests";

export function useRequests() {
  return useQuery({
    queryKey: ["requests"],
    queryFn: requestsApi.getRequests,
  });
}

export function useRequest(id) {
  return useQuery({
    queryKey: ["requests", id],
    queryFn: () => requestsApi.getRequest(id),
    enabled: !!id,
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestsApi.createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useApproveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestsApi.approveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["partnerships"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeclineRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestsApi.declineRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}
