import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

export function useAuth() {
  const [authRefresh, setAuthRefresh] = useState(0);
  const storedAuth = localStorage.getItem("sunnyMoviesAuth");
  const storedPassword = localStorage.getItem("sunnyMoviesPassword");

  const { data: authStatus, isLoading, refetch } = useQuery({
    queryKey: ["auth-validation", authRefresh],
    queryFn: async () => {
      const currentAuth = localStorage.getItem("sunnyMoviesAuth");
      const currentPassword = localStorage.getItem("sunnyMoviesPassword");
      
      if (!currentAuth || !currentPassword) {
        return { authenticated: false };
      }

      try {
        const response = await fetch("/api/auth/validate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies
          body: JSON.stringify({ password: currentPassword }),
        });
        
        if (!response.ok) {
          return { authenticated: false };
        }
        
        return response.json();
      } catch (error) {
        return { authenticated: false };
      }
    },
    enabled: !!storedAuth && !!storedPassword,
    retry: false,
    staleTime: 0, // Always fresh check
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem("sunnyMoviesAuth");
      localStorage.removeItem("sunnyMoviesPassword");
      return true;
    },
    onSuccess: () => {
      setAuthRefresh(prev => prev + 1);
    },
  });

  const forceRefresh = () => {
    setAuthRefresh(prev => prev + 1);
  };

  const isAuthenticated = !!(storedAuth && (authStatus as any)?.authenticated);

  return {
    isAuthenticated,
    isLoading: isLoading && !!storedAuth,
    logout: logoutMutation.mutate,
    refetch: forceRefresh,
  };
}