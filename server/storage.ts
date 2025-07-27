import { type Movie, type MovieDetails, type Genre, type BrowserSession, type InsertBrowserSession } from "@shared/schema";

export interface IStorage {
  // Cache methods for TMDB data
  cacheMovies(key: string, movies: Movie[]): Promise<void>;
  getCachedMovies(key: string): Promise<Movie[] | undefined>;
  cacheMovieDetails(movieId: number, details: MovieDetails): Promise<void>;
  getCachedMovieDetails(movieId: number): Promise<MovieDetails | undefined>;
  cacheGenres(genres: Genre[]): Promise<void>;
  getCachedGenres(): Promise<Genre[] | undefined>;
  
  // Browser session management
  createBrowserSession(session: Omit<InsertBrowserSession, 'id' | 'createdAt' | 'lastAccessedAt'>): Promise<BrowserSession>;
  getBrowserSessionByPassword(password: string): Promise<BrowserSession | null>;
  updateBrowserSessionAccess(id: string): Promise<void>;
  validateBrowserSession(password: string, browserFingerprint: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private movieCache: Map<string, Movie[]>;
  private movieDetailsCache: Map<number, MovieDetails>;
  private genresCache: Genre[] | undefined;
  private browserSessions: Map<string, BrowserSession> = new Map();

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

  async createBrowserSession(sessionData: Omit<InsertBrowserSession, 'id' | 'createdAt' | 'lastAccessedAt'>): Promise<BrowserSession> {
    const id = Math.random().toString(36).substring(2, 15);
    const now = new Date();
    const session: BrowserSession = {
      id,
      ...sessionData,
      createdAt: now,
      lastAccessedAt: now,
    };
    
    this.browserSessions.set(id, session);
    return session;
  }

  async getBrowserSessionByPassword(password: string): Promise<BrowserSession | null> {
    for (const [, session] of this.browserSessions) {
      if (session.password === password && session.isActive) {
        return session;
      }
    }
    return null;
  }

  async updateBrowserSessionAccess(id: string): Promise<void> {
    const session = this.browserSessions.get(id);
    if (session) {
      session.lastAccessedAt = new Date();
      this.browserSessions.set(id, session);
    }
  }

  async validateBrowserSession(password: string, browserFingerprint: string): Promise<boolean> {
    const session = await this.getBrowserSessionByPassword(password);
    if (!session) return false;
    
    // Check if this password is already used by a different browser
    if (session.browserFingerprint !== browserFingerprint) {
      return false;
    }
    
    // Update last accessed time
    await this.updateBrowserSessionAccess(session.id);
    return true;
  }
}

export const storage = new MemStorage();
