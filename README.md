# Book Review Platform (MERN)

This is a fullstack MERN application scaffold for a Book Review Platform.

## Structure
- backend/: Node.js + Express + MongoDB (Mongoose)
- frontend/: React app (basic CRA-style structure)

## Quickstart (Backend)
1. cd backend
2. npm install
3. copy .env.example to .env and set MONGO_URI and JWT_SECRET
4. npm run dev

## Quickstart (Frontend)
1. cd frontend
2. npm install
3. set REACT_APP_API_URL in .env.local if backend not at default http://localhost:5000/api
4. npm start

## Notes
- Backend protections: JWT auth, bcrypt password hashing.
- Pagination: 5 books per page.
- Reviews: one review per user per book (enforced by unique index).


## Added features (per your request)
- Search, filter by genre, and sorting (by year or average rating) on the books list.
- Rating distribution endpoint and chart in Book Details (uses Recharts).
- Dark/Light mode toggle stored in localStorage.
- Postman collection at `postman_collection.json` for quick API testing.


## Deployment & CI

### GitHub Actions
- `.github/workflows/ci.yml` -> runs on push/PR (installs deps, builds frontend)
- `.github/workflows/deploy-backend.yml` -> builds backend and triggers Render deploy (requires secrets)
- `.github/workflows/deploy-frontend.yml` -> builds frontend and deploys to Vercel via CLI (requires Vercel token)

### Required GitHub Secrets
- `RENDER_API_KEY` and `RENDER_SERVICE_ID` for Render deploys
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` for Vercel deploys

### How the Render deploy step works
The workflow triggers a deploy by calling Render's API:
POST https://api.render.com/v1/services/{SERVICE_ID}/deploys with Authorization header `Bearer <API_KEY>`.
Set the secrets in your GitHub repo's Settings -> Secrets -> Actions.
