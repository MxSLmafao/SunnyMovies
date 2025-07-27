import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "../components/navigation";
import MovieCard from "../components/movie-card";
import MovieDetailsModal from "../components/movie-details-modal";
import VideoPlayerModal from "../components/video-player-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { fetchPopularMovies, fetchGenres, discoverMovies } from "../lib/tmdb-api";

export default function Movies() {
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: genres } = useQuery({
    queryKey: ["/api/genres"],
    queryFn: fetchGenres,
    staleTime: 60 * 60 * 1000,
  });

  const { data: movies, isLoading } = useQuery({
    queryKey: ["/api/movies/discover", selectedGenre, currentPage],
    queryFn: () => selectedGenre 
      ? discoverMovies(selectedGenre, currentPage)
      : fetchPopularMovies(currentPage),
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

  const handleGenreChange = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setCurrentPage(1);
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
          <h1 className="text-4xl font-bold mb-8">All Movies</h1>
          
          {/* Genre Filter */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Filter by Genre</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                className={`text-light-grey hover:text-white transition-colors duration-200 py-2 px-4 rounded-full hover:bg-card-grey ${
                  selectedGenre === null ? "text-white bg-card-grey" : ""
                }`}
                onClick={() => handleGenreChange(null)}
              >
                All
              </Button>
              {genres?.genres.map((genre) => (
                <Button
                  key={genre.id}
                  variant="ghost"
                  className={`text-light-grey hover:text-white transition-colors duration-200 py-2 px-4 rounded-full hover:bg-card-grey ${
                    selectedGenre === genre.id ? "text-white bg-card-grey" : ""
                  }`}
                  onClick={() => handleGenreChange(genre.id)}
                >
                  {genre.name}
                </Button>
              ))}
            </div>
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