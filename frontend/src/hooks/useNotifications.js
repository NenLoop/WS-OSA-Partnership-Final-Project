import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as notificationsApi from "../api/notifications";

export function useNotifications(page) {
  return useQuery({
    queryKey: ["notifications", page],
    queryFn: ({ queryKey }) => {
      const [, page] = queryKey;
      return notificationsApi.getNotifications({ page });
    },
    keepPreviousData: true,
  });
}

export function useMarkSeen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markSeen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllSeen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markAllSeen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
