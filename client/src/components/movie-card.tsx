import { useState } from "react";
import { Play, Star } from "lucide-react";
import { getImageUrl } from "../lib/tmdb-api";
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onClick: (movieId: number) => void;
  showTrendingBadge?: boolean;
}

export default function MovieCard({ movie, onClick, showTrendingBadge = false }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getReleaseYear = (date: string) => {
    return new Date(date).getFullYear();
  };

  return (
    <div
      className="movie-card group cursor-pointer transform hover:scale-105 transition-all duration-300"
      onClick={() => onClick(movie.id)}
    >
      <div className="relative overflow-hidden rounded-lg">
        {!imageError && movie.poster_path ? (
          <img
            src={getImageUrl(movie.poster_path, "w500")}
            alt={movie.title}
            className="w-full h-full object-cover aspect-[2/3]"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[2/3] bg-card-grey flex items-center justify-center">
            <span className="text-light-grey text-sm text-center p-4">
              {movie.title}
            </span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
          <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
        </div>
        
        {showTrendingBadge && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
            🔥 TRENDING
          </div>
        )}
        
        <div className="absolute top-2 right-2 bg-netflix-red text-white px-2 py-1 rounded text-xs font-bold flex items-center">
          <Star size={10} className="mr-1" />
          {movie.vote_average.toFixed(1)}
        </div>
      </div>
      
      <h3 className="text-sm font-medium mt-2 line-clamp-2">{movie.title}</h3>
      <p className="text-xs text-light-grey">{getReleaseYear(movie.release_date)}</p>
    </div>
  );
}
