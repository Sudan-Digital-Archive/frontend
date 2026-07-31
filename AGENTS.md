# Sudan Digital Archive Frontend - Agent Development Guide

This guide provides essential information for AI agents working on the Sudan Digital Archive frontend codebase.

## Project Overview

Community-driven React SPA for preserving Sudan's collective memory and experiences. Built with TypeScript, Vite, and modern web technologies. Features bilingual English/Arabic support and integrates replayweb.page for web archive replay.

**Core Stack**: React 18, TypeScript, Vite, Chakra UI, React Router v7, i18next, Vitest, ESLint, Prettier

## Essential Commands

**Package Manager**: All commands use `pnpm`

```bash
# Development
pnpm run dev                # Start development server
pnpm run build             # Typecheck + build for production (tsc -b && vite build)
pnpm run preview           # Preview production build locally

# Testing
pnpm run test              # Run all tests (non-interactive)
pnpm run test:watch        # Run tests in watch mode
pnpm run test [pattern]    # Run single test file (e.g., pnpm run test ArchiveCard)

# Code Quality
pnpm run lint              # Check ESLint rules
pnpm run lint:fix          # Auto-fix ESLint issues
pnpm run format            # Format code with Prettier
pnpm run format:check      # Check formatting without fixing
```

## Code Style & Conventions

### TypeScript & General

- **Strict mode**: Enabled with `noUnusedLocals` and `noUnusedParameters`
- **Components**: Define prop interfaces explicitly, use TypeScript generics when appropriate
- **Path aliases**: Use `src/` prefix for internal imports (configured in tsconfig)

### Component Patterns

```typescript
// ✅ Preferred structure
interface ComponentProps {
  required: string
  optional?: number
}

export function ComponentName({ required, optional = 0 }: ComponentProps) {
  const { t } = useTranslation()
  const context = useCustomHook()

  return <div>{t('translation_key')}</div>
}
```

### Import Order

1. React imports
2. Third-party libraries (@chakra-ui, react-i18next, etc.)
3. Internal imports (src/ imports)
4. Relative imports

### Naming Conventions

- **Components**: PascalCase (e.g., `ArchiveCard`)
- **Functions/Variables**: camelCase (e.g., `truncateString`)
- **Files**: PascalCase for components (e.g., `Title.tsx`), kebab-case for utilities
- **Test files**: Same name as component + `.test.tsx` suffix

### Error Handling

- Custom hooks must throw descriptive errors when context is undefined
- Use try-catch blocks for API calls with user-friendly error messages
- All error messages must be translatable via `useTranslation`

### Testing Standards

- **Framework**: Vitest + React Testing Library
- **Test helpers**: Use `renderWithProviders` from `testUtils/testHelpers.tsx`
- **Structure**: `describe`, `it`, `expect` pattern
- **Coverage**: Test component behavior, not implementation details

## Project-Specific Rules

### Internationalization (CRITICAL)

- ALL user-facing text must use `useTranslation` hook
- Add new keys to both `src/translations/en.json` and `src/translations/ar.json`
- Translation keys use snake_case: `translation_key_example`
- Use `t()` function, never hardcode strings

### ReplayWeb.page Integration (CRITICAL)

- NEVER let React Router intercept `/replay/*` routes
- Only allow specific replay routes: `/replay/sw.js`, `/replay/ui.js`
- The `public/replay/` directory contains essential service worker scripts
- Service worker is handled by the web component itself

### Styling Guidelines

- Use Chakra UI components and props for all layout and styling
- Use Emotion for custom style overrides only when necessary
- Respect dark/light mode with `useColorModeValue`
- Maintain consistent design system (cyan color scheme, shadows, transitions)

### File Organization

```
src/
├── apiTypes/          # API request/response type definitions
├── components/        # Reusable UI components (with tests)
├── context/          # React Context definitions
├── css/              # Global and component-specific CSS
├── hooks/            # Custom React hooks
├── pages/            # Main route components
├── translations/     # i18n JSON files (en.json, ar.json)
└── utils/            # Helper functions
```

## Development Workflow

### Pre-commit Requirements

1. `pnpm run lint` must pass without errors
2. `pnpm run format` must be run (CI checks formatting)
3. `pnpm run test` must pass for changed files

### Backend Dependency

Frontend requires backend API running locally for full functionality. Check `GEMINI.md` for backend repository information.

### Build Process

- Production build: `tsc -b && vite build`
- Type checking happens before Vite build
- Manual chunk splitting configured for node_modules optimization

### Debugging

- Use browser dev tools for React component inspection
- Network tab shows API calls to backend
- Console errors should be descriptive and actionable

## Critical Notes for Agents

1. **Never break replay functionality** - `/replay/*` routes are sacred
2. **Always internationalize** - No hardcoded strings, ever
3. **Maintain bilingual support** - Test both English and Arabic
4. **Follow existing patterns** - Use similar components as templates
5. **Type safety is mandatory** - No `any` types unless absolutely necessary
6. **Test your changes** - Run relevant tests before committing

This project serves an important cultural preservation mission. Be thoughtful and deliberate in all changes.


<!-- headroom:rtk-instructions -->
# RTK (Rust Token Killer) - Token-Optimized Commands

When running shell commands, **always prefix with `rtk`**. This reduces context
usage by 60-90% with zero behavior change. If rtk has no filter for a command,
it passes through unchanged — so it is always safe to use.

## Key Commands
```bash
# Git (59-80% savings)
rtk git status          rtk git diff            rtk git log

# Files & Search (60-75% savings)
rtk ls <path>           rtk read <file>         rtk grep <pattern>
rtk find <pattern>      rtk diff <file>

# Test (90-99% savings) — shows failures only
rtk pytest tests/       rtk cargo test          rtk test <cmd>

# Build & Lint (80-90% savings) — shows errors only
rtk tsc                 rtk lint                rtk cargo build
rtk prettier --check    rtk mypy                rtk ruff check

# Analysis (70-90% savings)
rtk err <cmd>           rtk log <file>          rtk json <file>
rtk summary <cmd>       rtk deps                rtk env

# GitHub (26-87% savings)
rtk gh pr view <n>      rtk gh run list         rtk gh issue list

# Infrastructure (85% savings)
rtk docker ps           rtk kubectl get         rtk docker logs <c>

# Package managers (70-90% savings)
rtk pip list            rtk pnpm install        rtk npm run <script>
```

## Rules
- In command chains, prefix each segment: `rtk git add . && rtk git commit -m "msg"`
- For debugging, use raw command without rtk prefix
- `rtk proxy <cmd>` runs command without filtering but tracks usage
<!-- /headroom:rtk-instructions -->
