# SunnyMovies - Movie Streaming Application

## Overview

SunnyMovies is a Netflix-inspired movie streaming application built with React and Express.js. The application allows users to browse popular movies, search for content, view detailed movie information, and stream movies using embedded video players. It features a modern dark theme UI with responsive design and integrates with The Movie Database (TMDB) API for movie data.

## User Preferences

Preferred communication style: Simple, everyday language.

## Authentication System

### Device-Based Password Protection
- **Password Configuration**: Managed through `passwords.json` file in root directory
- **Device Token Authentication**: Each password locked to unique device token via secure cookies
- **Session Management**: Tracks active sessions by device token and password combination
- **Access Control**: Login page protects all movie content and streaming features

### Password Management
- **Config File**: `passwords.json` contains array of valid passwords
- **Hot Reload**: Passwords can be updated without server restart via reload endpoint
- **Default Passwords**: Fallback passwords if config file missing or corrupted
- **Device Validation**: Server validates passwords against config and creates unique device tokens stored in secure cookies

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom Netflix-inspired color scheme
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Structure**: RESTful endpoints under `/api` prefix
- **Development**: Hot module replacement via Vite in development mode
- **Production**: Static file serving with built assets

### Data Storage Solutions
- **Primary Database**: PostgreSQL configured via Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Caching**: In-memory caching layer for TMDB API responses
- **Schema Management**: Drizzle Kit for migrations and schema management

## Key Components

### Movie Data Management
- **TMDB Integration**: Fetches movie data from The Movie Database API
- **Caching Strategy**: Memory-based caching to reduce API calls and improve performance
- **Data Validation**: Zod schemas for runtime type checking of API responses
- **Movie Categories**: Popular, trending, top-rated, and search functionality

### User Interface Components
- **Hero Section**: Featured movie display with backdrop and action buttons
- **Movie Grids**: Responsive card layouts for movie browsing
- **Movie Details Modal**: Comprehensive movie information display
- **Video Player Modal**: Embedded video streaming using VidSrc
- **Navigation**: Fixed header with search functionality and responsive mobile menu
- **Search Bar**: Real-time movie search with debounced input

### Video Streaming
- **Player Integration**: VidSrc embedded player for movie streaming
- **IMDB Integration**: Uses IMDB IDs for video source resolution
- **Responsive Player**: Full-screen capable video player with controls

## Data Flow

1. **Movie Data Fetching**: Client requests movie data through API endpoints
2. **TMDB API Integration**: Server fetches data from TMDB with authentication
3. **Caching Layer**: Server caches responses in memory to improve performance
4. **Data Validation**: Zod schemas validate API responses before client consumption
5. **State Management**: React Query manages client-side state and caching
6. **User Interactions**: Modal-based navigation for movie details and video playback

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter)
- **State Management**: TanStack React Query for server state
- **UI Framework**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer

### Backend Dependencies
- **Server**: Express.js with TypeScript support
- **Database**: Drizzle ORM with PostgreSQL, Neon Database serverless driver
- **Validation**: Zod for schema validation
- **Development**: TSX for TypeScript execution, Vite for development server

### External APIs
- **TMDB API**: Movie data, images, and metadata
- **VidSrc**: Video streaming service for movie playback
- **Neon Database**: Serverless PostgreSQL hosting

### UI and Styling
- **Component Library**: Comprehensive Radix UI component set
- **Icons**: Lucide React icon library
- **Utilities**: clsx, tailwind-merge for conditional styling
- **Animations**: Class Variance Authority for component variants

## Deployment Strategy

### Development Environment
- **Development Server**: Vite dev server with HMR for frontend
- **Backend Development**: TSX for running TypeScript server code
- **Database Development**: Drizzle Kit for schema management and migrations
- **Environment Variables**: TMDB API key and database URL configuration

### Production Build
- **Frontend Build**: Vite builds optimized static assets to `dist/public`
- **Backend Build**: esbuild bundles server code to `dist/index.js`
- **Database Deployment**: Migrations applied via Drizzle Kit push command
- **Static Serving**: Express serves built frontend assets in production mode

### Configuration Management
- **TypeScript Configuration**: Shared tsconfig for client, server, and shared code
- **Path Aliases**: Configured for clean imports across the application
- **Environment Detection**: Different behavior for development vs production modes
- **Replit Integration**: Special handling for Replit deployment environment