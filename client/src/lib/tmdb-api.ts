import { apiRequest } from "./queryClient";
import type { Movie, MovieDetails, Genre, TMDBResponse, Credits } from "../types/movie";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const getImageUrl = (path: string | null, size: string = "w500"): string => {
  if (!path) return "/placeholder-movie-poster.jpg";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const fetchPopularMovies = async (page: number = 1): Promise<TMDBResponse> => {
  const response = await apiRequest("GET", `/api/movies/popular?page=${page}`);
  return response.json();
};

export const fetchTrendingMovies = async (page: number = 1): Promise<TMDBResponse> => {
  const response = await apiRequest("GET", `/api/movies/trending?page=${page}`);
  return response.json();
};

export const fetchTopRatedMovies = async (page: number = 1): Promise<TMDBResponse> => {
  const response = await apiRequest("GET", `/api/movies/top-rated?page=${page}`);
  return response.json();
};

export const searchMovies = async (query: string, page: number = 1): Promise<TMDBResponse> => {
  const response = await apiRequest("GET", `/api/movies/search?q=${encodeURIComponent(query)}&page=${page}`);
  return response.json();
};

export const fetchMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  const response = await apiRequest("GET", `/api/movies/${movieId}`);
  return response.json();
};

export const fetchMovieCredits = async (movieId: number): Promise<Credits> => {
  const response = await apiRequest("GET", `/api/movies/${movieId}/credits`);
  return response.json();
};

export const fetchGenres = async (): Promise<{ genres: Genre[] }> => {
  const response = await apiRequest("GET", "/api/genres");
  return response.json();
};

export const discoverMovies = async (genreId?: number, page: number = 1): Promise<TMDBResponse> => {
  let url = `/api/movies/discover?page=${page}`;
  if (genreId) {
    url += `&genre=${genreId}`;
  }
  const response = await apiRequest("GET", url);
  return response.json();
};

export const getVidSrcUrl = (imdbId: string | null): string => {
  if (!imdbId) return "";
  return `https://vidsrc.net/embed/movie?imdb=${imdbId}&autoplay=1`;
};
