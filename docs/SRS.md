# PART II — SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

## 7. System Overview

### 7.1 System Architecture

RamRadar will use a client-side React application connected to Firebase services.

The application will follow a modular architecture that separates:
- User interface.
- Application logic.
- Authentication.
- Database access.
- Map rendering.
- Activity management.

### 7.2 High-Level Architecture

```text
                 USER
                  |
                  v
        REACT + TYPESCRIPT APP
                  |
        -----------------------
        |          |          |
        v          v          v
    Dashboard   Activity    Authentication
       UI       Management       UI
        |          |             |
        -----------|-------------
                   |
                   v
             SERVICE LAYER
                   |
          --------------------
          |                  |
          v                  v
     FIREBASE SDK        MAP SERVICE
          |                  |
    --------------       MAPLIBRE GL
    |      |     |           |
    v      v     v           v
   Auth  Realtime  Storage  Open map tiles
         Database
```

The service layer will isolate Firebase operations from React components. Components should not directly implement database queries.

### 7.3 Architectural Decisions

**Frontend:** React + TypeScript + Vite.

**Backend:** Firebase managed services.

**Database:** Firebase Realtime Database.

**Authentication:** Firebase Authentication.

**Map rendering:** MapLibre GL JS through a React integration.

**Hosting:** Vercel or Firebase Hosting.

No custom backend server is required for the MVP.

---

## 8. Functional Requirements

### FR-01: User Authentication

The system shall:
1. Allow users to authenticate using Google sign-in.
2. Maintain authenticated sessions.
3. Associate each user with a unique Firebase UID.
4. Retrieve the user's public profile.
5. Restrict activity creation and participation to authenticated users.
6. Allow users to sign out.

**Acceptance criteria:**
- Unauthenticated users cannot create activities.
- Authenticated users can access the discovery dashboard.
- Each account has a unique identifier.

### FR-02: Campus Selection

The system shall:
1. Support Rose Hill and Lincoln Center.
2. Allow users to switch campuses.
3. Update the map center when a campus is selected.
4. Display activities associated with the selected campus.
5. Preserve the selected campus during the current session.

**Acceptance criteria:**
- Switching campuses updates the map and activity results.
- Activities from the other campus do not appear unless the user selects both campuses or an all-campus view.

### FR-03: Activity Discovery

The system shall:
1. Retrieve active activities from Firebase.
2. Display activities in a map and list view.
3. Display relevant event information.
4. Allow filtering by category, campus, and time.
5. Update the interface when new activities are published.
6. Exclude canceled and expired activities from the default discovery view.

**Acceptance criteria:**
- A newly created activity appears in the appropriate discovery view without a manual page refresh.
- Filters correctly narrow the displayed results.

### FR-04: Activity Creation

The system shall:
1. Display an activity creation form.
2. Validate required fields.
3. Associate the activity with its creator.
4. Assign a unique activity ID.
5. Store the activity in Firebase.
6. Automatically register the host as a participant.
7. Set the initial activity status to active.

**Acceptance criteria:**
- Activities cannot be submitted with missing required information.
- Successfully submitted activities appear on the map and activity feed.
- The host appears in the participant count.

### FR-05: Activity Participation

The system shall:
1. Allow authenticated users to join active activities.
2. Prevent duplicate participation.
3. Allow users to leave activities.
4. Enforce participant limits.
5. Update participant counts.
6. Prevent participation in canceled or expired activities.

**Acceptance criteria:**
- Joining an activity updates the attendee count.
- A user cannot join the same activity twice.
- A full activity cannot accept additional participants.
- Leaving an activity removes that user from its participant list.

### FR-06: Host Management

The system shall:
1. Identify the creator of each activity.
2. Allow only the host to edit or cancel their activity.
3. Allow hosts to view participants.
4. Update the activity status when canceled.

**Acceptance criteria:**
- Non-hosts cannot modify or cancel activities.
- Canceled activities disappear from the active discovery feed.

### FR-07: Map Interaction

The system shall:
1. Render a navigable campus map.
2. Display activity markers.
3. Associate each marker with an activity.
4. Open an activity preview when a marker is selected.
5. Support zooming and panning.
6. Display the correct campus map after campus selection.

**Acceptance criteria:**
- Every active activity with valid coordinates has a corresponding marker.
- Selecting a marker opens the correct activity.

### FR-08: Search and Filtering

The system shall support:
- Text-based activity search.
- Category filtering.
- Campus filtering.
- Time-based filtering.
- Optional availability filtering.

Filters should be combinable.

### FR-09: User Profiles

The system shall store:
- Firebase UID.
- Display name.
- Email address.
- Profile image URL.
- Selected campus.
- Optional interests.
- Account creation timestamp.

Only necessary profile information should be publicly accessible.

### FR-10: Activity Status Management

Activities shall support the following statuses:

| Status | Description |
|---|---|
| Active | Available for discovery and participation |
| Full | Reached maximum participant capacity |
| Canceled | Host canceled the activity |
| Completed | Activity has concluded |
| Expired | Activity passed its expiration time |

The system shall prevent users from joining activities that are full, canceled, completed, or expired.

---

## 9. Non-Functional Requirements

### NFR-01: Performance

- The initial dashboard should load within 3 seconds under normal network conditions.
- Activity updates should appear within 2 seconds under normal network conditions.
- UI interactions should provide immediate feedback.
- Map rendering should remain responsive during ordinary usage.
- Database listeners should be scoped to the data currently needed.

### NFR-02: Reliability

- The application should gracefully handle failed database requests.
- The interface should display loading, empty, and error states.
- Failed activity submissions should not produce misleading success messages.
- The list view should remain available if map rendering fails.

### NFR-03: Security

- Authentication shall be handled through Firebase Authentication.
- Firebase Realtime Database Security Rules shall enforce authorization.
- Users may only modify their own profiles.
- Only activity hosts may edit or cancel their activities.
- Users cannot modify another user's participant record.
- Input validation shall occur before database writes.
- API credentials and private service credentials must not be committed to source control.

### NFR-04: Privacy

- Users shall not be required to share their current location.
- Browser geolocation shall be optional and requested only when needed.
- The application shall not continuously track users.
- Users' exact personal locations shall not be stored.
- Only necessary user profile data shall be displayed.
- The application shall provide a clear explanation of any location permission request.

### NFR-05: Accessibility

- All interactive controls shall have accessible labels.
- The application shall support keyboard navigation.
- Text and interactive elements shall have sufficient contrast.
- Color shall not be the only method of communicating activity categories.
- The application shall provide a list alternative to the map.
- The layout shall adapt to different screen sizes.

### NFR-06: Maintainability

- Use TypeScript throughout the application.
- Separate components, hooks, services, and types.
- Avoid duplicating database logic.
- Use reusable UI components.
- Document environment variables and setup instructions.

### NFR-07: Scalability

The architecture should support future additions such as:
- More campuses.
- More activity categories.
- Larger activity feeds.
- Notifications.
- Club accounts.
- Recommendation systems.

---

## 10. Data Requirements and Database Schema

Firebase Realtime Database will store application data as a JSON tree.

### 10.1 Proposed Database Structure

```json
{
  "users": {
    "USER_UID": {
      "displayName": "Alex",
      "email": "student@example.com",
      "photoURL": "https://example.com/photo.jpg",
      "campus": "rose-hill",
      "interests": ["study", "sports"],
      "createdAt": 1795000000000
    }
  },
  "activities": {
    "ACTIVITY_ID": {
      "title": "Study Group",
      "description": "Preparing for the upcoming exam.",
      "category": "study",
      "campus": "rose-hill",
      "location": {
        "name": "Library",
        "latitude": 40.861,
        "longitude": -73.885
      },
      "hostId": "USER_UID",
      "startTime": 1795000000000,
      "endTime": 1795007200000,
      "maxParticipants": 8,
      "status": "active",
      "createdAt": 1794990000000
    }
  },
  "participants": {
    "ACTIVITY_ID": {
      "USER_UID": true
    }
  }
}
```

The coordinates and timestamps above are illustrative schema examples, not verified Fordham venue coordinates or actual event times.

### 10.2 Data Model

**User**

| Field | Type | Required |
|---|---|---|
| uid | string | Yes |
| displayName | string | Yes |
| email | string | Yes |
| photoURL | string | No |
| campus | string | No |
| interests | string[] | No |
| createdAt | number | Yes |

**Activity**

| Field | Type | Required |
|---|---|---|
| id | string | Yes |
| title | string | Yes |
| description | string | Yes |
| category | string | Yes |
| campus | string | Yes |
| location.name | string | Yes |
| location.latitude | number | Yes |
| location.longitude | number | Yes |
| hostId | string | Yes |
| startTime | number | Yes |
| endTime | number | No |
| maxParticipants | number | No |
| status | string | Yes |
| createdAt | number | Yes |

**Participant**

| Field | Type | Description |
|---|---|---|
| activityId | string | Associated activity |
| uid | string | Participant's Firebase UID |
| joinedAt | number | Participation timestamp |

### 10.3 Database Design Considerations

- Store participants separately from activity records to avoid downloading unnecessary user data with every activity.
- Use Firebase push IDs for unique activity identifiers.
- Use timestamps in Unix milliseconds.
- Use denormalized data only where it improves query performance.
- Use atomic transactions for operations that depend on shared state, such as capacity enforcement.
- Avoid listening to the entire database root.
- Configure indexes for frequently queried fields.

The displayed participant count should be derived from the participant records or maintained through carefully controlled transactions.

---

## 11. System Workflows

### 11.1 Activity Discovery

```text
User opens RamRadar
        |
        v
Authenticate user
        |
        v
Load selected campus
        |
        v
Subscribe to active activities
        |
        v
Display map markers and event feed
        |
        v
User applies filters
        |
        v
Update displayed activities
        |
        v
User selects an activity
        |
        v
Display activity details
```

### 11.2 Activity Creation

```text
User selects Create Activity
        |
        v
Display creation form
        |
        v
User enters activity information
        |
        v
Validate required fields
        |
        v
Create activity record
        |
        v
Register host as participant
        |
        v
Publish activity
        |
        v
Activity appears in discovery feed
```

### 11.3 Joining an Activity

```text
User selects an activity
        |
        v
Check authentication
        |
        v
Check activity status
        |
        v
Check existing participation
        |
        v
Check participant capacity
        |
        v
Register participant atomically
        |
        v
Update participant display
```

The capacity and duplicate-participation checks must be protected against concurrent requests. A client-side check alone is insufficient.

---

## 12. Validation Rules

### 12.1 Activity Creation

| Field | Validation |
|---|---|
| Title | Required; 3–60 characters |
| Description | Required; 10–500 characters |
| Category | Must match an approved category |
| Campus | Must be Rose Hill or Lincoln Center |
| Location name | Required |
| Latitude | Valid geographic coordinate |
| Longitude | Valid geographic coordinate |
| Start time | Must be in the future |
| End time | Must be later than start time |
| Max participants | Optional; positive integer |

### 12.2 Participation

- A user may only join an activity once.
- A user cannot join an activity they host if the host is already registered.
- The participant count cannot exceed the maximum capacity.
- Canceled activities cannot accept participants.
- Expired activities cannot accept participants.

---

## 13. Error Handling

The application shall support the following situations:

| Scenario | Expected behavior |
|---|---|
| Authentication fails | Display an authentication error |
| Database unavailable | Display an error and retry option |
| Activity creation fails | Preserve form data and show an error |
| Activity is full | Disable Join and explain why |
| Activity was canceled | Display canceled status |
| User already joined | Display Leave instead of Join |
| Map tiles fail to load | Display the list view |
| Location permission denied | Continue without personal location |
| Activity has expired | Remove it from active discovery |

---

## 14. Testing Requirements

### 14.1 Unit Testing

Test:
- Form validation.
- Activity filtering.
- Activity status calculation.
- Participant capacity calculations.
- Date/time formatting.
- Search behavior.

### 14.2 Integration Testing

Test:
- Firebase authentication.
- Activity creation.
- Activity retrieval.
- Joining and leaving activities.
- Real-time participant updates.
- Host permissions.
- Database security rules.

### 14.3 End-to-End Testing

Test these complete user journeys:

1. Sign in and access the dashboard.
2. Switch from Rose Hill to Lincoln Center.
3. Find an activity through the map.
4. Open its details.
5. Join the activity.
6. Confirm that the participant count changes.
7. Create a new activity.
8. Confirm that the new activity appears for another user.
9. Cancel an activity as its host.
10. Confirm that another user cannot cancel it.

### 14.4 Performance Testing

- Test dashboard loading with 50–100 seeded activities.
- Test multiple clients listening to the same activity.
- Test concurrent attempts to join a nearly full activity.
- Test map responsiveness on desktop and mobile browsers.

---

# PART III — TECHNICAL STACK AND IMPLEMENTATION RESOURCES

## 15. Recommended Technology Stack

The following stack is designed to minimize setup complexity while still demonstrating meaningful engineering work.

### 15.1 Frontend

| Technology | Purpose | Required |
|---|---|---|
| React | UI component architecture | Yes |
| TypeScript | Static typing | Yes |
| Vite | Development server and build tool | Yes |
| Tailwind CSS | Styling and responsive design | Yes |
| shadcn/ui | Reusable interface components | Recommended |
| Lucide React | Icons | Recommended |
| React Router | Client-side navigation | Recommended |
| React Hook Form | Form management | Recommended |
| Zod | Input validation | Recommended |
| date-fns | Date/time formatting | Recommended |
| Sonner | Toast notifications | Optional |

### 15.2 Backend and Database

| Technology | Purpose | Required |
|---|---|---|
| Firebase Authentication | User login | Yes |
| Firebase Realtime Database | Activity and participant data | Yes |
| Firebase Security Rules | Access control | Yes |
| Firebase Storage | Profile images, if needed | Optional |
| Firebase Emulator Suite | Local testing | Recommended |

**Why Firebase Realtime Database?**

RamRadar has a particularly strong real-time use case. When one student joins an activity, other students viewing that activity should immediately see the updated participant count.

Realtime Database synchronizes data changes with connected clients. It also provides a straightforward JSON-based data model, making it suitable for a hackathon application.

### 15.3 Mapping

| Technology | Purpose | Required |
|---|---|---|
| MapLibre GL JS | Interactive map rendering | Yes |
| react-maplibre | React integration | Recommended |
| OpenStreetMap data | Geographic map data | Yes |
| OpenFreeMap | Potential basemap/style provider | Recommended |
| Manual campus coordinates | Activity locations | Yes |

MapLibre is open source and supports interactive vector maps, markers, and custom map styling.

For the MVP, manually define the campus locations rather than building a complicated address-geocoding system.

### 15.4 Deployment

| Technology | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Firebase Hosting | Alternative frontend hosting |
| GitHub | Source control |
| GitHub Actions | Optional automated testing |

---

## 16. Installation and Dependencies

Recommended initial setup:

```bash
npm create vite@latest ramradar -- --template react-ts

cd ramradar

npm install
```

Install the primary dependencies:

```bash
npm install firebase
npm install maplibre-gl react-maplibre
npm install react-router-dom
npm install lucide-react
npm install react-hook-form zod @hookform/resolvers
npm install date-fns
npm install sonner
npm install clsx tailwind-merge
```

Install development dependencies:

```bash
npm install -D tailwindcss @tailwindcss/vite
npm install -D vitest @testing-library/react
npm install -D @testing-library/jest-dom
npm install -D playwright
```

For shadcn/ui, follow its current Vite installation instructions rather than installing it as a conventional component library.

**Note:** Verify package compatibility and use mutually compatible stable releases when initializing the project. In particular, follow the MapLibre worker configuration instructions for the installed version.

---

## 17. APIs and External Resources

### 17.1 Firebase

**Purpose:** Authentication, database storage, and real-time synchronization.

Required services:

1. Firebase Authentication.
2. Firebase Realtime Database.

Useful documentation:

- Firebase Web SDK: https://firebase.google.com/docs/web/setup
- Authentication: https://firebase.google.com/docs/auth
- Realtime Database: https://firebase.google.com/docs/database/web/start
- Reading and writing data: https://firebase.google.com/docs/database/web/read-and-write
- Database security rules: https://firebase.google.com/docs/database/security

**API requirements:**

The application will primarily use the Firebase JavaScript SDK rather than creating its own REST API.

Relevant operations include:
- `onValue()` — Listen for database updates.
- `push()` — Create unique activity records.
- `set()` — Write records.
- `update()` — Update specific fields.
- `remove()` — Delete records.
- `runTransaction()` — Safely coordinate concurrent updates.

### 17.2 MapLibre

**Purpose:** Interactive campus map.

Documentation:

https://maplibre.org/maplibre-gl-js/docs/

Installation:

```bash
npm install maplibre-gl
```

React integration:

https://visgl.github.io/react-maplibre/docs

The application should use MapLibre for:
- Displaying campus maps.
- Rendering activity markers.
- Displaying selected activity popups.
- Handling map zoom and panning.
- Switching between campus map views.

### 17.3 OpenFreeMap

**Purpose:** Provide map styles and tiles without requiring a proprietary map SDK.

Potential style:

```text
https://tiles.openfreemap.org/styles/liberty
```

The provider's current usage terms, availability, and attribution requirements should be reviewed before deployment.

### 17.4 Browser Geolocation API

**Purpose:** Optional location-aware discovery.

Documentation:

https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

Possible functionality:
- Center the map around a user's approximate location.
- Display activities within a selected radius.
- Help students find nearby activities.

This is optional and should not block the application if location permission is denied.

### 17.5 Fordham Campus Data

**Purpose:** Populate the map with recognizable campus locations.

Recommended resources:
- Fordham University official campus maps.
- Official campus building directories.
- OpenStreetMap geographic data.
- Manually verified building coordinates.

Fordham resources:

- https://www.fordham.edu/
- https://www.openstreetmap.org/

For the hackathon, create a small predefined list of locations for both campuses. Each location should have a name, campus identifier, latitude, and longitude.

Do not rely on live geocoding for every activity creation.

---

## 18. Suggested Project Structure

```text
ramradar/
│
├── public/
│   └── assets/
│
├── src/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Navigation.tsx
│   │   │
│   │   ├── map/
│   │   │   ├── CampusMap.tsx
│   │   │   ├── ActivityMarker.tsx
│   │   │   └── MapControls.tsx
│   │   │
│   │   ├── activities/
│   │   │   ├── ActivityCard.tsx
│   │   │   ├── ActivityDetails.tsx
│   │   │   ├── ActivityFeed.tsx
│   │   │   ├── ActivityFilters.tsx
│   │   │   └── CreateActivityForm.tsx
│   │   │
│   │   └── ui/
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── MyActivitiesPage.tsx
│   │   └── ProfilePage.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useActivities.ts
│   │   └── useCampus.ts
│   │
│   ├── services/
│   │   ├── firebase.ts
│   │   ├── authService.ts
│   │   ├── activityService.ts
│   │   └── participantService.ts
│   │
│   ├── types/
│   │   ├── user.ts
│   │   ├── activity.ts
│   │   └── campus.ts
│   │
│   ├── data/
│   │   ├── campuses.ts
│   │   └── locations.ts
│   │
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── filtering.ts
│   │   └── dateUtils.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 19. Environment Configuration

Create a `.env` file containing:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

These values should be populated from the Firebase project configuration.

Important:
- Never commit private service account credentials.
- Firebase web configuration is not a substitute for database security rules.
- Restrict Firebase Authentication and database access through appropriate security settings.
- Add `.env` to `.gitignore`.

---

## 20. Firebase Security Requirements

Security must be enforced by Firebase Security Rules rather than relying only on frontend checks.

The initial rules should enforce:

**Users**
- Authenticated users can read only the profile information needed by the application.
- A user can modify only their own profile.

**Activities**
- Authenticated users can read active public activities.
- Only authenticated users can create activities.
- The activity creator is recorded as the host.
- Only the host can edit or cancel an activity.
- Immutable fields, including the original host ID, cannot be changed by ordinary updates.

**Participants**
- A user can only create or remove their own participation record.
- Duplicate participation must be prevented.
- Capacity limits must be enforced against concurrent requests.
- Participant counts must not be freely editable by clients.

For capacity enforcement, use a trusted transactional design. If the database schema and security rules cannot safely enforce the required invariant, implement the operation through a trusted backend function rather than relying on a client-side check.

Firebase security documentation:

https://firebase.google.com/docs/database/security/

---

# PART IV — HACKATHON DEVELOPMENT PLAN

## 21. Development Priorities

The most important objective is to have a working application with a complete user journey.

### Phase 1: Foundation

- Initialize React and TypeScript.
- Configure Tailwind.
- Create Firebase project.
- Configure authentication.
- Define TypeScript interfaces.
- Establish the project folder structure.

**Deliverable:** Students can sign in and access the dashboard.

### Phase 2: Campus Map

- Integrate MapLibre.
- Configure the map style.
- Add Rose Hill and Lincoln Center views.
- Create predefined campus locations.
- Render sample activity markers.
- Implement marker selection.

**Deliverable:** An interactive map displaying sample campus activities.

### Phase 3: Activity Management

- Create activity forms.
- Implement Firebase activity creation.
- Display activity cards.
- Add category and campus filters.
- Implement activity detail views.

**Deliverable:** Students can create and discover activities.

### Phase 4: Real-Time Participation

- Implement join functionality.
- Implement leave functionality.
- Add duplicate-participation prevention.
- Enforce participant limits.
- Display real-time participant counts.

**Deliverable:** Multiple users can interact with the same activities.

### Phase 5: Polish and Presentation

- Improve responsive design.
- Add loading and error states.
- Add realistic sample data.
- Test core user flows.
- Prepare a demonstration script.

**Deliverable:** A complete, presentation-ready MVP.

---

## 22. Recommended Hackathon Feature Prioritization

| Feature | Priority | Implementation difficulty |
|---|---|---|
| Campus map | Critical | Medium |
| Campus switching | Critical | Low |
| Activity markers | Critical | Low |
| Activity creation | Critical | Medium |
| Activity feed | Critical | Low |
| Activity details | Critical | Low |
| Join/leave | Critical | Medium |
| Real-time updates | Critical | Medium |
| Authentication | High | Medium |
| Category filtering | High | Low |
| My Activities | Medium | Low |
| Personalized recommendations | Low | Medium |
| Notifications | Low | High |
| Direct messaging | Excluded | High |

---

