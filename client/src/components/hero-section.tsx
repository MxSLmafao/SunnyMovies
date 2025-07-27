import { useQuery } from "@tanstack/react-query";
import { Play, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPopularMovies, getImageUrl } from "../lib/tmdb-api";
import type { Movie } from "../types/movie";

interface HeroSectionProps {
  onPlayMovie: (movieId: number) => void;
  onShowDetails: (movieId: number) => void;
}

export default function HeroSection({ onPlayMovie, onShowDetails }: HeroSectionProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/movies/popular"],
    queryFn: () => fetchPopularMovies(1),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const featuredMovie: Movie | undefined = data?.results?.[0];

  if (isLoading) {
    return (
      <section className="relative h-screen flex items-center justify-start">
        <div className="absolute inset-0 z-0">
          <Skeleton className="w-full h-full bg-card-grey" />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-black via-deep-black/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-20">
          <div className="max-w-2xl space-y-4">
            <Skeleton className="h-16 w-3/4 bg-card-grey" />
            <Skeleton className="h-24 w-full bg-card-grey" />
            <div className="flex space-x-4">
              <Skeleton className="h-12 w-32 bg-card-grey" />
              <Skeleton className="h-12 w-32 bg-card-grey" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !featuredMovie) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-deep-black">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to SunnyMovies</h1>
          <p className="text-light-grey">Discover and stream thousands of movies for free</p>
        </div>
      </section>
    );
  }

  const getReleaseYear = (date: string) => {
    return new Date(date).getFullYear();
  };

  return (
    <section className="relative h-screen flex items-center justify-start">
      <div className="absolute inset-0 z-0">
        <img
          src={getImageUrl(featuredMovie.backdrop_path, "w1280")}
          alt={featuredMovie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-black via-deep-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent"></div>
      </div>
      
      
    </section>
  );
}
