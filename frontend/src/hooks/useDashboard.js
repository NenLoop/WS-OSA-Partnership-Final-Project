import { useQuery } from "@tanstack/react-query";
import * as dashboardApi from "../api/dashboard";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: dashboardApi.getDashboardStats,
  });
}
