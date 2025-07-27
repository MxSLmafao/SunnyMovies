import { useQuery } from "@tanstack/react-query";
import { X, Play, Plus, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMovieDetails, fetchMovieCredits, getImageUrl } from "../lib/tmdb-api";
import type { MovieDetails } from "../types/movie";

interface MovieDetailsModalProps {
  movieId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onPlayMovie: (movieId: number) => void;
}

export default function MovieDetailsModal({
  movieId,
  isOpen,
  onClose,
  onPlayMovie,
}: MovieDetailsModalProps) {
  const { data: movieDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["/api/movies", movieId],
    queryFn: () => fetchMovieDetails(movieId!),
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000,
  });

  const { data: credits, isLoading: isLoadingCredits } = useQuery({
    queryKey: ["/api/movies", movieId, "credits"],
    queryFn: () => fetchMovieCredits(movieId!),
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000,
  });

  const getReleaseYear = (date: string) => {
    return new Date(date).getFullYear();
  };

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!isOpen || !movieId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full mx-4 max-h-screen overflow-y-auto bg-card-grey text-white border-none">
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white hover:text-light-grey z-10"
        >
          <X size={24} />
        </Button>

        {isLoadingDetails ? (
          <div className="space-y-6">
            <Skeleton className="h-64 md:h-80 w-full bg-deep-black rounded-t-lg" />
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-3/4 bg-deep-black" />
              <Skeleton className="h-24 w-full bg-deep-black" />
              <div className="flex space-x-4">
                <Skeleton className="h-12 w-32 bg-deep-black" />
                <Skeleton className="h-12 w-32 bg-deep-black" />
              </div>
            </div>
          </div>
        ) : movieDetails ? (
          <div className="relative">
            <div className="relative h-64 md:h-80">
              <img
                src={getImageUrl(movieDetails.backdrop_path, "w1280")}
                alt={movieDetails.title}
                className="w-full h-full object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card-grey via-transparent to-transparent rounded-t-lg"></div>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img
                    src={getImageUrl(movieDetails.poster_path, "w500")}
                    alt={movieDetails.title}
                    className="w-full rounded-lg"
                  />
                </div>

                <div className="md:w-2/3">
                  <h2 className="text-3xl font-bold mb-4">{movieDetails.title}</h2>

                  <div className="flex items-center space-x-4 mb-4 flex-wrap">
                    <div className="flex items-center">
                      <Star className="text-yellow-400 mr-1" size={16} />
                      <span className="font-semibold">{movieDetails.vote_average.toFixed(1)}</span>
                    </div>
                    <span className="text-light-grey">{getReleaseYear(movieDetails.release_date)}</span>
                    {movieDetails.runtime && (
                      <div className="flex items-center">
                        <Clock className="mr-1" size={16} />
                        <span className="text-sm">{formatRuntime(movieDetails.runtime)}</span>
                      </div>
                    )}
                    {movieDetails.genres.length > 0 && (
                      <span className="bg-deep-black px-2 py-1 rounded text-sm">
                        {movieDetails.genres[0].name}
                      </span>
                    )}
                  </div>

                  {movieDetails.tagline && (
                    <p className="text-light-grey italic mb-4">"{movieDetails.tagline}"</p>
                  )}

                  <p className="text-light-grey mb-6 leading-relaxed">{movieDetails.overview}</p>

                  {movieDetails.genres.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {movieDetails.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="bg-deep-black px-3 py-1 rounded text-sm"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {credits && credits.cast.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Cast</h3>
                      <div className="flex flex-wrap gap-2">
                        {credits.cast.slice(0, 5).map((actor) => (
                          <span
                            key={actor.id}
                            className="bg-deep-black px-3 py-1 rounded text-sm"
                          >
                            {actor.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button
                      onClick={() => onPlayMovie(movieDetails.id)}
                      className="bg-netflix-red hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold flex items-center transition-colors duration-200"
                    >
                      <Play className="mr-2" size={20} />
                      Play Movie
                    </Button>
                    <Button
                      variant="secondary"
                      className="bg-deep-black hover:bg-gray-800 text-white px-6 py-3 rounded-md font-semibold flex items-center transition-colors duration-200"
                    >
                      <Plus className="mr-2" size={20} />
                      Watchlist
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-light-grey">Failed to load movie details</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
