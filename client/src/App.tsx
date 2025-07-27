import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/home";
import Movies from "@/pages/movies";
import Trending from "@/pages/trending";
import Search from "@/pages/search";
import MovieDetails from "@/pages/movie-details";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";

function Router() {
  const { isAuthenticated, isLoading, refetch } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={refetch} />;
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/movies" component={Movies} />
      <Route path="/trending" component={Trending} />
      <Route path="/search" component={Search} />
      <Route path="/movie/:id" component={MovieDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
