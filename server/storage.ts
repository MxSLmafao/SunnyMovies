import { type Movie, type MovieDetails, type Genre } from "@shared/schema";

export interface IStorage {
  // Cache methods for TMDB data
  cacheMovies(key: string, movies: Movie[]): Promise<void>;
  getCachedMovies(key: string): Promise<Movie[] | undefined>;
  cacheMovieDetails(movieId: number, details: MovieDetails): Promise<void>;
  getCachedMovieDetails(movieId: number): Promise<MovieDetails | undefined>;
  cacheGenres(genres: Genre[]): Promise<void>;
  getCachedGenres(): Promise<Genre[] | undefined>;
}

export class MemStorage implements IStorage {
  private movieCache: Map<string, Movie[]>;
  private movieDetailsCache: Map<number, MovieDetails>;
  private genresCache: Genre[] | undefined;

  constructor() {
    this.movieCache = new Map();
    this.movieDetailsCache = new Map();
    this.genresCache = undefined;
  }

  async cacheMovies(key: string, movies: Movie[]): Promise<void> {
    this.movieCache.set(key, movies);
  }

  async getCachedMovies(key: string): Promise<Movie[] | undefined> {
    return this.movieCache.get(key);
  }

  async cacheMovieDetails(movieId: number, details: MovieDetails): Promise<void> {
    this.movieDetailsCache.set(movieId, details);
  }

  async getCachedMovieDetails(movieId: number): Promise<MovieDetails | undefined> {
    return this.movieDetailsCache.get(movieId);
  }

  async cacheGenres(genres: Genre[]): Promise<void> {
    this.genresCache = genres;
  }

  async getCachedGenres(): Promise<Genre[] | undefined> {
    return this.genresCache;
  }
}

export const storage = new MemStorage();
