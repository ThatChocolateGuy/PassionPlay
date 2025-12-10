# Truth or Dare - Intimate Games

## Overview

An adult-oriented Truth or Dare web application designed for couples and friends. The app generates randomized truth questions and dare challenges across three intensity levels (Mild, Spicy, Extreme). Players can be added to personalize prompts, and the interface features a sophisticated, sensual aesthetic with smooth animations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state, React useState for local UI state
- **Styling**: Tailwind CSS with custom CSS variables for theming (dark/light modes with sensual color palette focused on pink/rose tones)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Animations**: Framer Motion for smooth transitions and prompt reveals
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful endpoints under `/api` prefix
- **Content Generation**: In-memory content library with randomized selection (no AI/external APIs for prompt generation)

### Data Layer
- **Database**: PostgreSQL (configured via Drizzle ORM)
- **ORM**: Drizzle with Zod schema validation
- **Current State**: Game content is stored in-memory arrays in `server/storage.ts`; database infrastructure exists but prompts are not persisted

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
- **connect-pg-simple**: Session storage adapter (available but sessions not currently implemented)

### Frontend Libraries
- **Radix UI**: Headless component primitives (dialog, popover, tabs, etc.)
- **Framer Motion**: Animation library
- **Embla Carousel**: Carousel component
- **Recharts**: Charting library (available but not actively used)
- **date-fns**: Date formatting utilities

### Development Tools
- **Replit Plugins**: Runtime error overlay, cartographer, dev banner for Replit environment
- **TypeScript**: Strict mode enabled with bundler module resolution