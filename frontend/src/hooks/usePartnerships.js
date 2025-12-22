import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as partnershipsApi from "../api/partnerships";

export function usePartnerships(departmentId) {
  return useQuery({
    queryKey: ["partnerships", departmentId],
    queryFn: () => partnershipsApi.getPartnerships(departmentId),
  });
}

export function usePartnership(id) {
  return useQuery({
    queryKey: ["partnerships", "detail", id],
    queryFn: () => partnershipsApi.getPartnership(id),
    enabled: !!id,
  });
}

export function useCreatePartnership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: partnershipsApi.createPartnership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partnerships"] });
    },
  });
}

export function useUpdatePartnership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: partnershipsApi.updatePartnership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partnerships"] });
    },
  });
}

export function useDeletePartnership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: partnershipsApi.deletePartnership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partnerships"] });
    },
  });
}
