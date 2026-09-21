# BrewQuery — Frontend

## 1. What the App Is

BrewQuery is a modern database learning playground. The core idea is dataset-centric: you pick a real-world dataset, explore its schema, and solve query challenges written against that actual data — which gets loaded into a live in-memory session on the backend.

The split-pane editor lets you write and run queries interactively, inspect results, and submit for full judging across all test cases. Problems are organized by dataset rather than as a flat problem bank.

Currently supports SQL, with NoSQL and VectorDB sections planned.

## 2. Tech Stack

| Layer | Library / Tool |
|---|---|
| Framework | React 18 |
| Build tool | Vite 7 |
| UI components | MUI v7 (@mui/material) |
| Styling | Tailwind CSS + Emotion |
| State management | Redux Toolkit + redux-persist |
| Routing | React Router v7 |
| SQL editor | Monaco Editor (@monaco-editor/react) |
| HTTP client | Axios |
| Notifications | react-hot-toast |

## 3. Project Structure

```
src/
  api/            # Axios instance + per-domain API functions
  assets/         # Images and static files
  components/
    auth/         # Login, Signup, OTP, ResetPassword
    databases/    # DatasetGrid, ProblemsList, DatabaseBar
    dashboard/    # Landing component
    global/       # Topbar, Sidebar, FormInput, Pagination, etc.
    judge/        # SQLTestComparison (verdict display)
  config/         # Layout constants (APP_BAR_HEIGHT, focus routes)
  context/        # SidebarContext
  hooks/          # useNavbarHeight, useSidebarWidth
  pages/
    authentication/  # AuthContainer
    problemset/      # SQLProblemset, ProblemSolver
    Dashboard.jsx
  redux/
    slices/       # authSlice, themeSlice
    store.js
  theme/          # MUI theme (palette, typography, shadows, overrides)
  utils/
    classes/      # ApiResponse, CountryCodeDropDown, themeClasses
    helpers/      # PasswordStrengthBar, ProblemGridRow
  App.jsx         # Root layout (Topbar + Sidebar + Routing)
  Routing.jsx     # Route definitions + auth guards
  main.jsx        # Entry point
```

## 4. Environment Setup

Create a `.env.local` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Point this at the running `brewquery/services` backend.

## 5. Dev Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run start

# Production build
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint
```
