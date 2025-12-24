import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import useDebounce from "./useDebounce";
import * as partnershipsApi from "../api/partnerships";

export function usePartnerships({
  departmentName,
  search = "",
  type = "",
  status = "",
  startDate = "",
  endDate = "",
  isAdmin = false,
  isStaff = false,
}) {
  // Build query params depending on role

  const debouncedSearch = useDebounce(search, 500);

  const params = useMemo(
    () => ({
      department_name:
        departmentName && departmentName !== "All" ? departmentName : undefined,

      search: debouncedSearch || undefined,

      partnership_type: type || undefined,

      status: isAdmin || isStaff ? status || undefined : undefined,

      start_date:
        isAdmin || (isStaff && status) ? startDate || undefined : undefined,

      end_date:
        isAdmin || (isStaff && status) ? endDate || undefined : undefined,
    }),
    [
      departmentName,
      debouncedSearch,
      type,
      status,
      startDate,
      endDate,
      isAdmin,
      isStaff,
    ]
  );

  return useQuery({
    queryKey: ["partnerships", params],
    queryFn: () => partnershipsApi.getPartnerships(params),
    keepPreviousData: true, // optional: keeps previous data while fetching new
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
