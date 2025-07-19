## Project Overview

ChatGPT Journal is a web application that allows users to write journal entries and chat with ChatGPT about them. Built with SvelteKit, SkeletonUI, and Supabase.

## Essential Commands

### Development
```bash
npm run dev              # Start development server (http://localhost:5173)
npm run build            # Build for production
npm run preview          # Preview production build
```

### Testing
```bash
npm run test:unit        # Run unit tests with Vitest
npm run test             # Run E2E tests with Playwright
```

### Code Quality
```bash
npm run check            # Type check with svelte-check
npm run lint             # Check code with ESLint and Prettier
npm run format           # Auto-format code with Prettier
```

### Database Types
```bash
npm run types            # Generate TypeScript types from Supabase schema
```

## Architecture Overview

### Frontend Structure
- **Framework**: SvelteKit with file-based routing
- **Routes**:
  - `(inner)/` - Authenticated routes (journal, chat, profile)
  - `auth/` - Authentication pages
  - `api/` - API endpoints
- **UI**: SkeletonUI components + TailwindCSS
- **State Management**: Svelte stores in `src/lib/stores.ts`

### Backend Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Chat**: Supabase Edge Functions (`supabase/functions/chat-stream/`)
- **File Storage**: Supabase Storage for images

### Key Integration Points
- **Supabase Client**: `src/lib/supabaseClient.ts` - Initialize once, reuse everywhere
- **Database Types**: `src/lib/types/supabaseTypes.ts` - Auto-generated, don't edit manually
- **Auth Hooks**: `src/hooks.server.ts` - Handles session management
- **Environment Variables**: See `.env.local.example` for required vars

## Development Guidelines

### Code Style
- **Formatting**: Tabs, single quotes, no trailing commas (enforced by Prettier)
- **TypeScript**: Strict mode enabled - always type function parameters and returns
- **Components**: Place in `src/lib/components/` with TypeScript props

### Testing Patterns
- **Unit Tests**: Use Vitest, co-locate with source files (`*.test.ts`)
- **Test Structure**: `describe` blocks with `it` statements
- **Example**: See `src/lib/helpers/pagination.test.ts`

### Component Development
- Check `src/lib_skeleton/` for customized SkeletonUI components before creating new ones
- Use existing TailwindCSS classes and SkeletonUI design tokens
- Follow existing patterns in `src/routes/` for page components

### Database Operations
- Use generated types from `supabaseTypes.ts`
- Handle errors with proper user feedback
- Check `src/lib/helpers/` for existing database utilities

### AI Chat Implementation
- Chat logic in `supabase/functions/chat-stream/`
- Agents defined in `agents.json`
- Uses server-sent events for streaming responses

## Common Tasks

### Adding a New Page
1. Create route folder in `src/routes/`
2. Add `+page.svelte` for UI
3. Add `+page.server.ts` for data loading if needed
4. Protected routes go under `(inner)/`

### Modifying Database Schema
1. Create migration in Supabase
2. Run `npm run types` to update TypeScript types
3. Update relevant queries and components

### Working with Supabase Edge Functions
1. Functions are in `supabase/functions/`
2. Each function has its own `deno.json`
3. Deploy manually to Supabase project

## Environment Setup Requirements
- Node.js and npm
- Supabase project (local or cloud)
- OpenAI API key for ChatGPT features
- Environment variables from `.env.local.example`
