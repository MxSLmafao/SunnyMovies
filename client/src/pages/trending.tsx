import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "../components/navigation";
import MovieCard from "../components/movie-card";
import MovieDetailsModal from "../components/movie-details-modal";
import VideoPlayerModal from "../components/video-player-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { fetchTrendingMovies } from "../lib/tmdb-api";

export default function Trending() {
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: movies, isLoading } = useQuery({
    queryKey: ["/api/movies/trending", currentPage],
    queryFn: () => fetchTrendingMovies(currentPage),
    staleTime: 5 * 60 * 1000,
  });

  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId);
    setIsDetailsModalOpen(true);
  };

  const handlePlayMovie = (movieId: number) => {
    setSelectedMovieId(movieId);
    setIsDetailsModalOpen(false);
    setIsVideoModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsDetailsModalOpen(false);
    setIsVideoModalOpen(false);
    setSelectedMovieId(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-deep-black text-white">
      <Navigation />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">🔥 Trending Movies</h1>
            <p className="text-light-grey text-lg">
              Discover the hottest movies trending right now
            </p>
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-8">
            {isLoading
              ? Array.from({ length: 20 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="w-full aspect-[2/3] bg-card-grey" />
                    <Skeleton className="h-4 w-3/4 bg-card-grey" />
                    <Skeleton className="h-3 w-1/2 bg-card-grey" />
                  </div>
                ))
              : movies?.results.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={handleMovieClick}
                    showTrendingBadge={true}
                  />
                ))}
          </div>

          {/* Pagination */}
          {movies && movies.total_pages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="secondary"
                className="bg-card-grey hover:bg-gray-600 disabled:opacity-50"
              >
                Previous
              </Button>
              <span className="text-light-grey">
                Page {currentPage} of {Math.min(movies.total_pages, 500)}
              </span>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.min(movies.total_pages, 500)}
                variant="secondary"
                className="bg-card-grey hover:bg-gray-600 disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      <MovieDetailsModal
        movieId={selectedMovieId}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModals}
        onPlayMovie={handlePlayMovie}
      />

      <VideoPlayerModal
        movieId={selectedMovieId}
        isOpen={isVideoModalOpen}
        onClose={handleCloseModals}
      />
    </div>
  );
}