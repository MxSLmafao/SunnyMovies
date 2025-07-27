import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Play, Plus, Star, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "../components/navigation";
import { fetchMovieDetails, fetchMovieCredits, getImageUrl } from "../lib/tmdb-api";
import { useLocation } from "wouter";
import { useState } from "react";
import VideoPlayerModal from "../components/video-player-modal";

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const movieId = id ? parseInt(id) : null;

  const { data: movieDetails, isLoading: isLoadingDetails, error } = useQuery({
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

  const handlePlayMovie = () => {
    setIsVideoModalOpen(true);
  };

  const handleGoBack = () => {
    setLocation("/");
  };

  const getReleaseYear = (date: string) => {
    return new Date(date).getFullYear();
  };

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-deep-black text-white">
        <Navigation />
        <div className="container mx-auto px-4 lg:px-8 pt-20">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
            <p className="text-light-grey mb-6">The movie you're looking for doesn't exist.</p>
            <Button onClick={handleGoBack} variant="secondary">
              Go Back Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingDetails) {
    return (
      <div className="min-h-screen bg-deep-black text-white">
        <Navigation />
        <div className="pt-16">
          <Skeleton className="h-96 w-full bg-card-grey" />
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <Skeleton className="w-full lg:w-1/3 h-96 bg-card-grey rounded-lg" />
              <div className="lg:w-2/3 space-y-4">
                <Skeleton className="h-12 w-3/4 bg-card-grey" />
                <Skeleton className="h-32 w-full bg-card-grey" />
                <div className="flex space-x-4">
                  <Skeleton className="h-12 w-32 bg-card-grey" />
                  <Skeleton className="h-12 w-32 bg-card-grey" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movieDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-deep-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative pt-16">
        <div className="relative h-96">
          <img
            src={getImageUrl(movieDetails.backdrop_path, "w1280")}
            alt={movieDetails.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/50 to-transparent"></div>
          
          <Button
            onClick={handleGoBack}
            variant="ghost"
            className="absolute top-4 left-4 text-white hover:text-light-grey"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back
          </Button>
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 -mt-32 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
              <img
                src={getImageUrl(movieDetails.poster_path, "w500")}
                alt={movieDetails.title}
                className="w-full max-w-sm mx-auto lg:mx-0 rounded-lg shadow-2xl"
              />
            </div>
            
            <div className="lg:w-2/3 text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">{movieDetails.title}</h1>
              
              {movieDetails.tagline && (
                <p className="text-xl text-light-grey italic mb-4">"{movieDetails.tagline}"</p>
              )}
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                <div className="flex items-center">
                  <Star className="text-yellow-400 mr-1" size={20} />
                  <span className="text-lg font-semibold">{movieDetails.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1" size={16} />
                  <span>{getReleaseYear(movieDetails.release_date)}</span>
                </div>
                {movieDetails.runtime && (
                  <div className="flex items-center">
                    <Clock className="mr-1" size={16} />
                    <span>{formatRuntime(movieDetails.runtime)}</span>
                  </div>
                )}
              </div>
              
              <p className="text-lg text-light-grey mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {movieDetails.overview}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  onClick={handlePlayMovie}
                  className="bg-netflix-red hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold flex items-center justify-center"
                >
                  <Play className="mr-2" size={24} />
                  Play Movie
                </Button>
                <Button
                  variant="secondary"
                  className="bg-card-grey hover:bg-gray-600 text-white px-8 py-3 text-lg font-semibold flex items-center justify-center"
                >
                  <Plus className="mr-2" size={24} />
                  Add to Watchlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Details Section */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Genres */}
          {movieDetails.genres.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {movieDetails.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-card-grey px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Cast */}
          {credits && credits.cast.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Cast</h2>
              <div className="grid grid-cols-2 gap-4">
                {credits.cast.slice(0, 8).map((actor) => (
                  <div key={actor.id} className="flex items-center space-x-3">
                    {actor.profile_path ? (
                      <img
                        src={getImageUrl(actor.profile_path, "w185")}
                        alt={actor.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-card-grey flex items-center justify-center">
                        <span className="text-xs">{actor.name.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{actor.name}</p>
                      <p className="text-sm text-light-grey">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Production Details */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <p className="text-light-grey">{movieDetails.status}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Budget</h3>
            <p className="text-light-grey">
              {movieDetails.budget > 0 ? `$${movieDetails.budget.toLocaleString()}` : "N/A"}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Revenue</h3>
            <p className="text-light-grey">
              {movieDetails.revenue > 0 ? `$${movieDetails.revenue.toLocaleString()}` : "N/A"}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Language</h3>
            <p className="text-light-grey">{movieDetails.original_language.toUpperCase()}</p>
          </div>
        </div>
      </div>
      
      <VideoPlayerModal
        movieId={movieId}
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
}
