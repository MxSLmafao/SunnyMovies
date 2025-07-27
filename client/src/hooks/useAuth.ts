import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const storedAuth = localStorage.getItem("sunnyMoviesAuth");
  const storedPassword = localStorage.getItem("sunnyMoviesPassword");

  const { data: authStatus, isLoading, refetch } = useQuery({
    queryKey: ["auth-validation"],
    queryFn: async () => {
      if (!storedAuth || !storedPassword) {
        return { authenticated: false };
      }

      try {
        const response = await apiRequest("/api/auth/validate", {
          method: "POST",
          body: JSON.stringify({ password: storedPassword }),
        });
        return response;
      } catch (error) {
        return { authenticated: false };
      }
    },
    enabled: !!storedAuth && !!storedPassword,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem("sunnyMoviesAuth");
      localStorage.removeItem("sunnyMoviesPassword");
      return true;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const isAuthenticated = !!(storedAuth && authStatus?.authenticated);

  return {
    isAuthenticated,
    isLoading: isLoading && !!storedAuth,
    logout: logoutMutation.mutate,
    refetch,
  };
}