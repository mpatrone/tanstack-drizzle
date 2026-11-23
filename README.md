# webdev-todo

A simple [TanStack Start](https://tanstack.com/start) example that uses [Drizzle ORM](https://orm.drizzle.team/) with a PostgreSQL database running in a Docker container.

The application is a simple Todo app: you can **add**, **edit**, **delete** and mark todos as complete. It demonstrates:

- **TanStack Router capabilities**: file-based routing, dynamic route params, route loaders, type-safe links and server functions.
- **Client-only components** that persist state in the browser's `localStorage`.

## Tech stack

- [TanStack Start](https://tanstack.com/start) / [TanStack Router](https://tanstack.com/router)
- [Drizzle ORM](https://orm.drizzle.team/) + `node-postgres`
- PostgreSQL 17 (Docker)
- React 19, Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com/)
- Zod for validating server function input

## Getting started

### 1. Configure the environment

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=todos
DATABASE_URL=postgres://postgres:postgres@localhost:5432/todos
```

### 2. Start PostgreSQL in Docker

```bash
docker compose up -d
```

This starts a `postgres:17.0` container (see [docker-compose.yaml](docker-compose.yaml)) and stores its data in the `pgdata` volume.

### 3. Install dependencies and set up the database

```bash
bun install
bun run db:migrate   # apply the migrations in ./drizzle
```

### 4. Run the app

```bash
bun run dev
```

Then open http://localhost:3000.

## Project structure

```
src/
├── db/
│   ├── schema.ts               # Drizzle schema (todos table)
│   └── index.ts                # Drizzle client
├── components/
│   ├── todo-form.tsx           # Add/edit form + server functions
│   ├── local-count-button.tsx  # Client-only component using localStorage
│   └── ui/                     # shadcn/ui components
└── routes/
    ├── __root.tsx              # Root document/layout
    ├── index.tsx               # "/" – todo list, toggle and delete
    └── todos/
        ├── new/index.tsx       # "/todos/new" – add a todo
        └── $id/edit/index.tsx  # "/todos/$id/edit" – edit a todo
```

## What it demonstrates

### TanStack Router

- **File-based routing**: routes live in `src/routes`. The route tree (`src/routeTree.gen.ts`) is generated automatically.
- **Dynamic params**: `/todos/$id/edit` reads `params.id` in its loader to fetch one todo, and throws `notFound()` if there's no todo with that id.
- **Route loaders**: the `/` route loads all todos before rendering. Components read the data with `Route.useLoaderData()`.
- **Type-safe navigation**: `<Link to="/todos/$id/edit" params={{ id }}>` is checked against the generated route tree.
- **Server functions**: `createServerFn` with Zod validators handles create, update, toggle and delete directly against Postgres. Mutations either `throw redirect({ to: "/" })` or call `router.invalidate()` to reload loader data.

### Client-only components with localStorage

[local-count-button.tsx](src/components/local-count-button.tsx) shows how to use browser-only APIs in a server-rendered app:

- `<ClientOnly>` (from `@tanstack/react-router`) renders its children only on the client, so `localStorage` is never accessed during SSR.
- `createClientOnlyFn` (from `@tanstack/react-start`) wraps the function that reads the stored count, so it can only run in the browser.
- A `useEffect` writes the counter back to `localStorage`, so the value is still there after a page reload.

## Database scripts

| Script                | Description                              |
| --------------------- | ---------------------------------------- |
| `bun run db:generate` | Generate migrations from the schema      |
| `bun run db:migrate`  | Apply migrations                         |
| `bun run db:push`     | Push the schema directly to the database |
| `bun run db:studio`   | Open Drizzle Studio                      |

## Building for production

```bash
bun run build
bun .output/server/index.mjs
```
