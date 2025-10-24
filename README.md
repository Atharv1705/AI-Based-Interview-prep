# PrepWise AI Coach

## Development

- Create a `.env` (or set env vars) for the server:
  - `GEMINI_API_KEY` (optional; if missing, AI endpoints return graceful defaults)
  - `PORT=3001` (optional)

- Start dev:

```
npm install
npm run dev
```

This runs the Vite app on 8080 and an Express server on 3001 with a proxy for `/api/*`.

## Vapi Setup

- Go to Profile → API Keys in the app and save your Vapi API key.
- Optionally set env vars in `.env` for the client:
  - `VITE_VAPI_API_KEY`
  - `VITE_VAPI_ASSISTANT_ID`

## Backend

Endpoints provided:
- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `GET/PUT /api/profile/:id`
- `POST /api/ai/feedback`, `POST /api/ai/questions`

Note: This uses in-memory storage for dev. Replace with a database for production.

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
