import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { movieSchema, movieDetailsSchema, genreSchema, tmdbResponseSchema, creditsSchema, loginSchema } from "@shared/schema";
import crypto from "crypto";

const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY || "";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function fetchFromTMDB(endpoint: string) {
  const url = `${TMDB_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${TMDB_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get popular movies
  app.get("/api/movies/popular", async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const cacheKey = `popular_${page}`;
      
      let cachedMovies = await storage.getCachedMovies(cacheKey);
      if (cachedMovies) {
        return res.json({ results: cachedMovies });
      }

      const data = await fetchFromTMDB(`/movie/popular?page=${page}`);
      const validatedResponse = tmdbResponseSchema.parse(data);
      
      await storage.cacheMovies(cacheKey, validatedResponse.results);
      res.json(validatedResponse);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      res.status(500).json({ message: "Failed to fetch popular movies" });
    }
  });

  // Get trending movies
  app.get("/api/movies/trending", async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const cacheKey = `trending_${page}`;
      
      let cachedMovies = await storage.getCachedMovies(cacheKey);
      if (cachedMovies) {
        return res.json({ results: cachedMovies });
      }

      const data = await fetchFromTMDB(`/trending/movie/week?page=${page}`);
      const validatedResponse = tmdbResponseSchema.parse(data);
      
      await storage.cacheMovies(cacheKey, validatedResponse.results);
      res.json(validatedResponse);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      res.status(500).json({ message: "Failed to fetch trending movies" });
    }
  });

  // Get top rated movies
  app.get("/api/movies/top-rated", async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const cacheKey = `top_rated_${page}`;
      
      let cachedMovies = await storage.getCachedMovies(cacheKey);
      if (cachedMovies) {
        return res.json({ results: cachedMovies });
      }

      const data = await fetchFromTMDB(`/movie/top_rated?page=${page}`);
      const validatedResponse = tmdbResponseSchema.parse(data);
      
      await storage.cacheMovies(cacheKey, validatedResponse.results);
      res.json(validatedResponse);
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
      res.status(500).json({ message: "Failed to fetch top rated movies" });
    }
  });

  // Search movies
  app.get("/api/movies/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;

      if (!query || query.trim().length < 2) {
        return res.json({ results: [] });
      }

      const data = await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
      const validatedResponse = tmdbResponseSchema.parse(data);
      
      res.json(validatedResponse);
    } catch (error) {
      console.error("Error searching movies:", error);
      res.status(500).json({ message: "Failed to search movies" });
    }
  });

  // Get movie details
  app.get("/api/movies/:id", async (req, res) => {
    try {
      const movieId = parseInt(req.params.id);
      
      let cachedDetails = await storage.getCachedMovieDetails(movieId);
      if (cachedDetails) {
        return res.json(cachedDetails);
      }

      const data = await fetchFromTMDB(`/movie/${movieId}?append_to_response=credits,videos`);
      const validatedDetails = movieDetailsSchema.parse(data);
      
      await storage.cacheMovieDetails(movieId, validatedDetails);
      res.json(validatedDetails);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      res.status(500).json({ message: "Failed to fetch movie details" });
    }
  });

  // Get movie credits
  app.get("/api/movies/:id/credits", async (req, res) => {
    try {
      const movieId = parseInt(req.params.id);
      const data = await fetchFromTMDB(`/movie/${movieId}/credits`);
      const validatedCredits = creditsSchema.parse(data);
      
      res.json(validatedCredits);
    } catch (error) {
      console.error("Error fetching movie credits:", error);
      res.status(500).json({ message: "Failed to fetch movie credits" });
    }
  });

  // Get genres
  app.get("/api/genres", async (req, res) => {
    try {
      let cachedGenres = await storage.getCachedGenres();
      if (cachedGenres) {
        return res.json({ genres: cachedGenres });
      }

      const data = await fetchFromTMDB("/genre/movie/list");
      const genres = data.genres.map((genre: any) => genreSchema.parse(genre));
      
      await storage.cacheGenres(genres);
      res.json({ genres });
    } catch (error) {
      console.error("Error fetching genres:", error);
      res.status(500).json({ message: "Failed to fetch genres" });
    }
  });

  // Discover movies by genre
  app.get("/api/movies/discover", async (req, res) => {
    try {
      const genreId = req.query.genre;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      
      let endpoint = `/discover/movie?page=${page}`;
      if (genreId) {
        endpoint += `&with_genres=${genreId}`;
      }

      const data = await fetchFromTMDB(endpoint);
      const validatedResponse = tmdbResponseSchema.parse(data);
      
      res.json(validatedResponse);
    } catch (error) {
      console.error("Error discovering movies:", error);
      res.status(500).json({ message: "Failed to discover movies" });
    }
  });

  // Authentication routes
  
  // Generate unique device token
  function generateDeviceToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
  
  // Get device token from cookie
  function getDeviceToken(req: any): string | null {
    return req.headers.cookie?.split(';').find((c: string) => c.trim().startsWith('deviceToken='))?.split('=')[1] || null;
  }

  // Login route
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { password } = loginSchema.parse(req.body);
      const existingDeviceToken = getDeviceToken(req);
      
      // First validate if password exists in config
      const isValidPassword = await storage.isValidPassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ success: false, message: "Invalid password" });
      }
      
      // Check if password already exists in device sessions
      const existingSession = await storage.getBrowserSessionByPassword(password);
      
      if (existingSession) {
        // If device already has the correct token, allow login
        if (existingDeviceToken && existingSession.deviceToken === existingDeviceToken) {
          await storage.updateBrowserSessionAccess(existingSession.id);
          res.json({ success: true, message: "Login successful" });
        } else {
          res.status(401).json({ success: false, message: "This password is already in use on a different device" });
        }
      } else {
        // Create new device session with unique token
        const deviceToken = generateDeviceToken();
        await storage.createBrowserSession({
          password,
          deviceToken,
          isActive: true,
        });
        
        // Set secure cookie with device token
        res.cookie('deviceToken', deviceToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        
        res.json({ success: true, message: "Device registered successfully" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ success: false, message: "Invalid request" });
    }
  });

  // Validate session route
  app.post("/api/auth/validate", async (req, res) => {
    try {
      const { password } = loginSchema.parse(req.body);
      const deviceToken = getDeviceToken(req);
      
      if (!deviceToken) {
        return res.json({ success: true, authenticated: false });
      }
      
      const isValid = await storage.validateBrowserSession(password, deviceToken);
      
      if (isValid) {
        res.json({ success: true, authenticated: true });
      } else {
        res.json({ success: true, authenticated: false });
      }
    } catch (error) {
      console.error("Validation error:", error);
      res.status(400).json({ success: false, message: "Invalid request" });
    }
  });

  // Reload passwords configuration (for development)
  app.post("/api/auth/reload-passwords", async (req, res) => {
    try {
      // Force reload of passwords config
      (storage as any).reloadPasswordsConfig();
      res.json({ success: true, message: "Password configuration reloaded" });
    } catch (error) {
      console.error("Reload error:", error);
      res.status(500).json({ success: false, message: "Failed to reload passwords" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
