import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginRequest } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Film, Lock } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        localStorage.setItem("sunnyMoviesAuth", "true");
        localStorage.setItem("sunnyMoviesPassword", form.getValues("password"));
        toast({
          title: "Success!",
          description: data.message,
        });
        onLogin();
      } else {
        toast({
          title: "Authentication Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Authentication Failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-black" />
      
      <Card className="w-full max-w-md relative z-10 bg-gray-900/90 border-gray-800">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Film className="w-8 h-8 text-red-500" />
            <CardTitle className="text-2xl font-bold text-white">
              SunnyMovies
            </CardTitle>
          </div>
          <p className="text-gray-400">
            Enter your password to access the streaming platform
          </p>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500"
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Access Movies"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-2">Browser Protection</h3>
              <p className="text-xs text-gray-400">
                Each password is locked to your specific browser to prevent unauthorized sharing. 
                If you need to access from a different device, you'll need a separate password.
              </p>
            </div>
            
            <div className="p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
              <h3 className="text-sm font-medium text-blue-300 mb-2">Password Management</h3>
              <p className="text-xs text-blue-200 mb-2">
                Valid passwords are configured in <code className="bg-blue-800/50 px-1 rounded">passwords.json</code>
              </p>
              <p className="text-xs text-blue-200">
                Default passwords: <code className="bg-blue-800/50 px-1 rounded">movie123</code>, 
                <code className="bg-blue-800/50 px-1 rounded">streaming456</code>, 
                <code className="bg-blue-800/50 px-1 rounded">cinema789</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}