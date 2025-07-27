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
      
      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-20">
        <div className="max-w-2xl">
          <h1 className="text-5xl lg:text-7xl font-bold mb-4">{featuredMovie.title}</h1>
          <p className="text-lg lg:text-xl text-light-grey mb-6 leading-relaxed">
            {featuredMovie.overview}
          </p>
          
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex items-center">
              <Star className="text-yellow-400 mr-1" size={20} />
              <span className="text-lg font-semibold">{featuredMovie.vote_average.toFixed(1)}</span>
            </div>
            <span className="text-light-grey">{getReleaseYear(featuredMovie.release_date)}</span>
            <span className="bg-card-grey px-2 py-1 rounded text-sm">HD</span>
          </div>
          
          <div className="flex space-x-4">
            <Button
              onClick={() => onPlayMovie(featuredMovie.id)}
              className="bg-netflix-red hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold flex items-center transition-colors duration-200"
            >
              <Play className="mr-2" size={20} />
              Play Now
            </Button>
            <Button
              onClick={() => onShowDetails(featuredMovie.id)}
              variant="secondary"
              className="bg-card-grey hover:bg-gray-600 text-white px-8 py-3 rounded-md font-semibold flex items-center transition-colors duration-200"
            >
              <Info className="mr-2" size={20} />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
