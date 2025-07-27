import { useQuery } from "@tanstack/react-query";
import MovieCard from "./movie-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { Movie } from "../types/movie";

interface MovieGridProps {
  title: string;
  fetchFunction: () => Promise<{ results: Movie[] }>;
  queryKey: string[];
  onMovieClick: (movieId: number) => void;
  showTrendingBadge?: boolean;
}

export default function MovieGrid({
  title,
  fetchFunction,
  queryKey,
  onMovieClick,
  showTrendingBadge = false,
}: MovieGridProps) {
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: fetchFunction,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (error) {
    return (
      <section className="mb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">{title}</h2>
          <Alert className="bg-card-grey border-netflix-red">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-white">
              Failed to load {title.toLowerCase()}. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="w-full aspect-[2/3] bg-card-grey" />
                  <Skeleton className="h-4 w-3/4 bg-card-grey" />
                  <Skeleton className="h-3 w-1/2 bg-card-grey" />
                </div>
              ))
            : data?.results.slice(0, 8).map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={onMovieClick}
                  showTrendingBadge={showTrendingBadge}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
