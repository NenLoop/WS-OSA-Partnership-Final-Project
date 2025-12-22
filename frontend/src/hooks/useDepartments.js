import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as departmentsApi from "../api/departments";

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: departmentsApi.getDepartments,
  });
}

export function useDepartment(id) {
  return useQuery({
    queryKey: ["departments", id],
    queryFn: () => departmentsApi.getDepartment(id),
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentsApi.createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentsApi.updateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentsApi.deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}
