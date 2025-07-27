import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "../components/navigation";
import HeroSection from "../components/hero-section";
import MovieGrid from "../components/movie-grid";
import MovieDetailsModal from "../components/movie-details-modal";
import VideoPlayerModal from "../components/video-player-modal";
import { fetchPopularMovies, fetchTrendingMovies, fetchTopRatedMovies, fetchGenres } from "../lib/tmdb-api";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const { data: genres } = useQuery({
    queryKey: ["/api/genres"],
    queryFn: fetchGenres,
    staleTime: 60 * 60 * 1000, // 1 hour
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

  const handleShowDetails = (movieId: number) => {
    setSelectedMovieId(movieId);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsDetailsModalOpen(false);
    setIsVideoModalOpen(false);
    setSelectedMovieId(null);
  };

  return (
    <div className="min-h-screen bg-deep-black text-white">
      <Navigation />
      
      <HeroSection onPlayMovie={handlePlayMovie} onShowDetails={handleShowDetails} />
      
      {/* Genre Navigation */}
      <section className="bg-dark-charcoal py-4 sticky top-16 z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex space-x-6 overflow-x-auto scrollbar-hide">
            <Button
              variant="ghost"
              className={`text-light-grey hover:text-white whitespace-nowrap transition-colors duration-200 py-2 px-4 rounded-full hover:bg-card-grey ${
                selectedGenre === null ? "text-white bg-card-grey" : ""
              }`}
              onClick={() => setSelectedGenre(null)}
            >
              All
            </Button>
            {genres?.genres.map((genre) => (
              <Button
                key={genre.id}
                variant="ghost"
                className={`text-light-grey hover:text-white whitespace-nowrap transition-colors duration-200 py-2 px-4 rounded-full hover:bg-card-grey ${
                  selectedGenre === genre.id ? "text-white bg-card-grey" : ""
                }`}
                onClick={() => setSelectedGenre(genre.id)}
              >
                {genre.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <main className="py-8">
        <MovieGrid
          title="Popular Movies"
          fetchFunction={() => fetchPopularMovies()}
          queryKey={["/api/movies/popular"]}
          onMovieClick={handleMovieClick}
        />

        <MovieGrid
          title="Trending Now"
          fetchFunction={() => fetchTrendingMovies()}
          queryKey={["/api/movies/trending"]}
          onMovieClick={handleMovieClick}
          showTrendingBadge={true}
        />

        <MovieGrid
          title="Top Rated"
          fetchFunction={() => fetchTopRatedMovies()}
          queryKey={["/api/movies/top-rated"]}
          onMovieClick={handleMovieClick}
        />
      </main>

      {/* Footer */}
      <footer className="bg-dark-charcoal py-12 mt-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-netflix-red text-xl font-bold mb-4 flex items-center">
                🎬 SunnyMovies
              </div>
              <p className="text-light-grey text-sm">
                Your premier destination for free movie streaming. Discover and watch thousands of movies in HD quality.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Browse</h3>
              <ul className="space-y-2 text-light-grey text-sm">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Popular Movies</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Top Rated</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Trending</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">New Releases</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Genres</h3>
              <ul className="space-y-2 text-light-grey text-sm">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Action</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Comedy</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Drama</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Horror</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-light-grey text-sm">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">DMCA</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-card-grey mt-8 pt-6 text-center text-light-grey text-sm">
            <p>&copy; 2025 SunnyMovies. Educational purposes only. All movie data provided by The Movie Database (TMDB).</p>
          </div>
        </div>
      </footer>

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
