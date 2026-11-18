# RamRadar — Agent Memory & Developer Guide

## 1. Project Overview & Vision
**RamRadar** is a real-time campus activity discovery web application designed for **Fordham University** students (Rose Hill and Lincoln Center campuses).
- **Primary Goal:** Consolidate campus activities into one interactive, real-time map and list platform. Supports spontaneous gatherings (study groups, pickup sports, meals) alongside club and campus events.
- **Key Target:** Hackathon MVP release with reliable, real-time interactions, smooth campus switching, and clean mobile responsiveness.

---

## 2. Tech Stack & Architectural Principles

### Core Stack
- **Frontend Framework:** React (with TypeScript) initialized via Vite (`npm create vite@latest . -- --template react-ts`).
- **Styling & UI:** Tailwind CSS, `clsx`, `tailwind-merge`, Lucide React icons, and `shadcn/ui` components.
- **Routing:** `react-router-dom`.
- **Forms & Validation:** `react-hook-form`, `zod`, `@hookform/resolvers/zod`.
- **Date Utilities:** `date-fns`.
- **Notifications:** `sonner`.
- **Map & Geolocation:** `maplibre-gl`, `react-maplibre` with OpenFreeMap tile style (`https://tiles.openfreemap.org/styles/liberty`) or OpenStreetMap tiles.
- **Backend & Realtime Data:** Firebase Web SDK (`firebase` v10+):
  - **Firebase Authentication:** Google Sign-in (+ optional email/pass).
  - **Firebase Realtime Database (RTDB):** Real-time JSON data sync for activities and participants.
  - **Firebase Security Rules:** Strict authorization and data validation rules.

### Architectural Rules
1. **Service Layer Isolation:**
   - React components must **never** execute direct Firebase database calls.
   - All DB operations must go through modular service files (`src/services/authService.ts`, `src/services/activityService.ts`, `src/services/participantService.ts`, `src/services/firebase.ts`).
2. **Concurrency & Real-time Integrity:**
   - Atomic transactions (`runTransaction`) are required for joining/leaving activities and enforcing participant capacity limits.
   - Never rely exclusively on client-side state for attendance limits or duplicate participation checks.
3. **Predefined Campus Coordinates:**
   - Do **not** use live geocoding APIs during activity creation. Use curated, predefined campus locations (`src/data/locations.ts`) for Rose Hill and Lincoln Center.
4. **Resilience & Fallbacks:**
   - Always provide a List View alternative to the Map View so the app remains fully functional even if map tile rendering fails or is blocked.
   - Maintain robust loading, empty, and error states across all asynchronous operations.
5. **Privacy:**
   - Geolocation is strictly optional; users must never be forced to share personal coordinates. No continuous user tracking.

---

## 3. Data Schema & Contracts (Firebase RTDB)

```json
{
  "users": {
    "<uid>": {
      "displayName": "string",
      "email": "string",
      "photoURL": "string (optional)",
      "campus": "rose-hill | lincoln-center (optional)",
      "interests": ["string"] "(optional)",
      "createdAt": 1795000000000
    }
  },
  "activities": {
    "<activityId>": {
      "title": "string (3-60 chars)",
      "description": "string (10-500 chars)",
      "category": "study | social | sports | clubs | academic | campus-events | other",
      "campus": "rose-hill | lincoln-center",
      "location": {
        "name": "string",
        "latitude": 40.861,
        "longitude": -73.885
      },
      "hostId": "<uid>",
      "startTime": 1795000000000,
      "endTime": 1795007200000,
      "maxParticipants": 8,
      "status": "active | full | canceled | completed | expired",
      "createdAt": 1794990000000
    }
  },
  "participants": {
    "<activityId>": {
      "<uid>": {
        "joinedAt": 1795000500000
      }
    }
  }
}
```

*Note: Participants are stored in a dedicated top-level node keyed by `activityId` to prevent fetching bulky attendee trees during activity listing.*

---

## 4. Standard Directory Layout
```text
RamRadar/
├── docs/                     # Specifications (PRD, SRS, Criteria)
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── layout/           # Sidebar, Header, Navigation
│   │   ├── map/              # CampusMap, ActivityMarker, MapControls
│   │   ├── activities/       # ActivityCard, ActivityDetails, ActivityFeed, ActivityFilters, CreateActivityForm
│   │   └── ui/               # shadcn / reusable primitives
│   ├── pages/                # LoginPage, DashboardPage, MyActivitiesPage, ProfilePage
│   ├── hooks/                # useAuth, useActivities, useCampus
│   ├── services/             # firebase, authService, activityService, participantService
│   ├── types/                # user.ts, activity.ts, campus.ts
│   ├── data/                 # campuses.ts, locations.ts (pre-seeded landmark coords)
│   ├── utils/                # validation.ts, filtering.ts, dateUtils.ts
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── .gitignore
├── AGENTS.md                 # Agent context & cross-conversation memory
├── package.json
└── README.md
```

---

## 5. MVP Acceptance Checklist (Tracking)

- [x] **Authentication**
  - [x] Google Sign-in / Sign-out functional via Firebase Auth.
  - [x] User record created/updated in `/users/<uid>`.
  - [x] Unauthenticated users redirected or restricted from host/join actions.
  - [x] Dev Persona fast-switcher implemented for rapid 2+ user local testing.
- [x] **Map & Discovery**
  - [x] Interactive MapLibre GL map renders Rose Hill and Lincoln Center with OpenFreeMap.
  - [x] Instant campus switching with map recentering and flyTo animations.
  - [x] Category-coded markers on map with attendee count pills and selection states.
  - [x] Discovery feed (list view) alongside map with live search & category filters.
- [x] **Activity Management**
  - [x] Validated creation form (title, category, campus, location, startTime, capacity) with Zod & React Hook Form.
  - [x] Host automatically added as initial participant in `/participants/<id>/<uid>`.
  - [x] Host can cancel their owned activity; non-hosts cannot.
- [x] **Participation**
  - [x] Join and Leave activity actions.
  - [x] Atomic capacity check (`runTransaction`) preventing over-subscription.
  - [x] Duplicate participation strictly blocked in database.
  - [x] Real-time participant counter updates across sessions.
- [x] **Quality & Polishing**
  - [x] Responsive layout (Desktop 3-column / Mobile drawer).
  - [x] Clear loading, error, and empty states.
  - [x] Firebase Security Rules defined in `database.rules.json`.
  - [x] Sample demonstration data preloaded (`src/data/seedData.ts`).

---

## 6. Development Guidelines for Future Agents
1. **Always reference `docs/SRS.md` and `docs/PRD.md`** for business constraints and validation criteria.
2. **Never commit secrets:** All Firebase configs belong in `.env` (refer to `.env.example`).
3. **Maintain atomic mutations:** Always use Firebase RTDB transactions for state that may change concurrently (participant count, joining/leaving).
4. **Keep UI resilient:** If map tiles fail to load or offline, ensure the activity list feed still provides 100% of discovery/join features.
5. **Update this file** whenever significant architectural decisions, completed checklist milestones, or structural changes occur.
