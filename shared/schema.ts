import { z } from "zod";

// Movie data schema based on TMDB API structure
export const movieSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  release_date: z.string(),
  vote_average: z.number(),
  vote_count: z.number(),
  genre_ids: z.array(z.number()),
  adult: z.boolean(),
  original_language: z.string(),
  original_title: z.string(),
  popularity: z.number(),
  video: z.boolean(),
});

export const movieDetailsSchema = movieSchema.omit({ genre_ids: true }).extend({
  runtime: z.number().nullable(),
  genres: z.array(z.object({
    id: z.number(),
    name: z.string(),
  })),
  production_companies: z.array(z.object({
    id: z.number(),
    name: z.string(),
    logo_path: z.string().nullable(),
    origin_country: z.string(),
  })),
  production_countries: z.array(z.object({
    iso_3166_1: z.string(),
    name: z.string(),
  })),
  spoken_languages: z.array(z.object({
    english_name: z.string(),
    iso_639_1: z.string(),
    name: z.string(),
  })),
  status: z.string(),
  tagline: z.string().nullable(),
  budget: z.number(),
  revenue: z.number(),
  imdb_id: z.string().nullable(),
});

export const castMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
  cast_id: z.number(),
  credit_id: z.string(),
  order: z.number(),
});

export const creditsSchema = z.object({
  cast: z.array(castMemberSchema),
  crew: z.array(z.object({
    id: z.number(),
    name: z.string(),
    job: z.string(),
    department: z.string(),
    profile_path: z.string().nullable(),
    credit_id: z.string(),
  })),
});

export const genreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const tmdbResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export type Movie = z.infer<typeof movieSchema>;
export type MovieDetails = z.infer<typeof movieDetailsSchema>;
export type CastMember = z.infer<typeof castMemberSchema>;
export type Credits = z.infer<typeof creditsSchema>;
export type Genre = z.infer<typeof genreSchema>;
export type TMDBResponse = z.infer<typeof tmdbResponseSchema>;
