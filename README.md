# Society Management ERP — Frontend

React + Vite frontend. Runs independently from the backend.

## Setup

```powershell
cd society-management-frontend
npm install
```

## Configuration

Create `.env` (or copy from `.env.example`):

```
VITE_API_URL=http://localhost:5050/api
```

Change the URL if your backend runs on a different port.

## Run

```powershell
npm run dev
```

Open **http://localhost:5173**

**Login:** `admin@society.com` / `admin123`

## Build for production

```powershell
npm run build
npm run preview
```

## Backend required

Start the backend separately from `society-management-backend` folder before using the app.
