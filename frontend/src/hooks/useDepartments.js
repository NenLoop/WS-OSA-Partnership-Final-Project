import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as departmentsApi from "../api/departments";

export function useDepartments(page) {
  return useQuery({
    queryKey: ["departments", page],
    queryFn: ({ queryKey }) => {
      const [, page] = queryKey;
      return departmentsApi.getDepartments({ page });
    },
    keepPreviousData: true,
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
