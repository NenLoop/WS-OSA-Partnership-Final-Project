import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as notificationsApi from "../api/notifications";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsApi.getNotifications,
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
