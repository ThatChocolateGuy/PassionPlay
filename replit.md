# Truth or Dare - Intimate Games

## Overview

An adult-oriented Truth or Dare web application designed for couples and friends. The app generates randomized truth questions and dare challenges across three intensity levels (Mild, Spicy, Extreme). Features include gender-aware prompts, couple pairing, turn-based gameplay, custom prompt creation, favorites, and a dare timer.

## User Preferences

Preferred communication style: Simple, everyday language.

## Key Features

### Gameplay
- **Three Intensity Levels**: Mild (flirty), Spicy (heated), Extreme (no limits)
- **Gender-Aware Prompts**: Prompts use placeholders like {player}, {male_player}, {female_player}, {partner} for personalization
- **Turn-Based System**: Round counter, turn tracker, current player display, next player preview
- **60-Second Timer**: Optional countdown timer for dare challenges

### Player Management
- **Couples System**: Create couples to pair players together
- **Gender Selection**: Each player has male/female gender for prompt targeting
- **Player Queue**: Visual display of turn order with color-coded avatars

### Custom Content
- **Custom Prompts**: Create your own truths and dares with intensity levels
- **Favorites**: Star any prompt to save it for later
- **Persistent Storage**: Custom prompts and favorites saved to database

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state, React useState for local UI state
- **Styling**: Tailwind CSS with gradient theme (rose/purple/pink tones)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Animations**: Framer Motion for smooth transitions and prompt reveals
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful endpoints under `/api` prefix
- **Content Generation**: In-memory content library with gender-aware randomized selection

### Data Layer
- **Database**: PostgreSQL (configured via Drizzle ORM)
- **ORM**: Drizzle with Zod schema validation
- **Tables**: `custom_prompts` and `favorites` for user-created content
- **Game State**: Managed client-side in React state (players, couples, turns)

### API Endpoints
- `POST /api/generate` - Generate a random truth or dare
- `GET /api/custom-prompts` - List custom prompts
- `POST /api/custom-prompts` - Create custom prompt
- `DELETE /api/custom-prompts/:id` - Delete custom prompt
- `GET /api/favorites` - List favorites
- `POST /api/favorites` - Add favorite
- `DELETE /api/favorites/:id` - Remove favorite

### Key Design Patterns
- **Shared Types**: Zod schemas in `shared/schema.ts` define types used by both frontend and backend
- **Path Aliases**: `@/` maps to client source, `@shared/` maps to shared directory
- **API Communication**: Fetch-based with centralized error handling in `queryClient.ts`

### Build System
- **Development**: Vite dev server with HMR proxied through Express
- **Production**: Vite builds static assets to `dist/public`, esbuild bundles server to `dist/index.cjs`
- **Database Migrations**: Drizzle Kit with `db:push` command

## External Dependencies

### Database
- **PostgreSQL**: Required for Drizzle ORM (connection via `DATABASE_URL` environment variable)

### Frontend Libraries
- **Radix UI**: Headless component primitives (dialog, popover, tabs, select, etc.)
- **Framer Motion**: Animation library for smooth transitions
- **Lucide React**: Icon library

### Development Tools
- **Replit Plugins**: Runtime error overlay, cartographer, dev banner
- **TypeScript**: Strict mode enabled with bundler module resolution
