import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navigation from "../components/navigation";
import MovieCard from "../components/movie-card";
import MovieDetailsModal from "../components/movie-details-modal";
import VideoPlayerModal from "../components/video-player-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { searchMovies } from "../lib/tmdb-api";

export default function Search() {
  const [, setLocation] = useLocation();
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Get search query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    setSearchQuery(query);
  }, []);

  const { data: movies, isLoading } = useQuery({
    queryKey: ["/api/movies/search", searchQuery, currentPage],
    queryFn: () => searchMovies(searchQuery, currentPage),
    enabled: !!searchQuery && searchQuery.length >= 2,
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      setCurrentPage(1);
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-deep-black text-white">
      <Navigation />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-6">Search Movies</h1>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative max-w-2xl">
                <Input
                  type="text"
                  placeholder="Search for movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-card-grey text-white px-4 py-3 pr-12 rounded-lg w-full text-lg focus:outline-none focus:ring-2 focus:ring-netflix-red transition-all duration-200 border-none"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-light-grey hover:text-white"
                >
                  <SearchIcon size={20} />
                </Button>
              </div>
            </form>

            {searchQuery && (
              <p className="text-light-grey text-lg mb-6">
                {movies?.total_results 
                  ? `Found ${movies.total_results} results for "${searchQuery}"`
                  : `Searching for "${searchQuery}"...`
                }
              </p>
            )}
          </div>

          {/* Search Results */}
          {!searchQuery || searchQuery.length < 2 ? (
            <div className="text-center py-20">
              <SearchIcon className="mx-auto mb-4 text-light-grey" size={64} />
              <h2 className="text-2xl font-semibold mb-4">Start Your Search</h2>
              <p className="text-light-grey">
                Enter at least 2 characters to search for movies
              </p>
            </div>
          ) : (
            <>
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
                  : movies?.results.length === 0 ? (
                      <div className="col-span-full text-center py-20">
                        <h2 className="text-2xl font-semibold mb-4">No Results Found</h2>
                        <p className="text-light-grey">
                          Try searching with different keywords
                        </p>
                      </div>
                    ) : (
                      movies?.results.map((movie) => (
                        <MovieCard
                          key={movie.id}
                          movie={movie}
                          onClick={handleMovieClick}
                        />
                      ))
                    )}
              </div>

              {/* Pagination */}
              {movies && movies.total_pages > 1 && movies.results.length > 0 && (
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
            </>
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