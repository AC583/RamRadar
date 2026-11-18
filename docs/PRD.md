# RamRadar
## Product Requirements Document (PRD)

**Version:** 1.0  
**Status:** Proposed — Hackathon MVP  
**Product Track:** RamLink  
**Platform:** Responsive web application  
**Target Institution:** Fordham University  
**Primary Campuses:** Rose Hill and Lincoln Center

---

# PART I — PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. Product Overview

### 1.1 Product Vision

RamRadar is a real-time campus activity discovery platform designed to help Fordham University students connect with one another through shared activities, events, and spontaneous gatherings.

The application provides an interactive campus map that displays activities happening around Fordham. Students can discover events, filter activities according to their interests, view event details, and join gatherings with other students.

Unlike traditional university event calendars, which primarily display formally organized events, RamRadar emphasizes both organized and informal social interactions.

Examples include:
- A student looking for someone to study with at the library.
- A group organizing an impromptu basketball game.
- Students hosting a spontaneous lunch gathering.
- A club advertising an upcoming meeting.
- Students organizing a group trip between campuses.

### 1.2 Problem Statement

Fordham students have numerous opportunities to connect, but discovering these opportunities is fragmented.

Students often rely on group chats, social media, club mailing lists, and word of mouth to find activities.

This creates several problems:

1. **Fragmented information:** Events and activities are distributed across different platforms.
2. **Limited discoverability:** Students may not know about activities happening nearby.
3. **Social barriers:** Students who are new to campus or looking to expand their social circles may struggle to find opportunities to participate.
4. **Lack of spontaneity:** Existing event platforms primarily focus on scheduled events rather than informal gatherings.
5. **Campus separation:** Students at Rose Hill and Lincoln Center may have difficulty discovering activities and connecting with students at the other campus.

### 1.3 Proposed Solution

RamRadar consolidates campus activities into one interactive, real-time platform.

The application will allow students to:

- Discover nearby activities using an interactive campus map.
- Browse activities through a searchable event feed.
- Filter events by campus, category, time, and availability.
- Create activities and invite other students.
- Join existing activities and see attendance update in real time.
- Discover opportunities to participate in campus life.

### 1.4 Target Audience

| User group | Needs |
|---|---|
| New students | Find activities and meet other students |
| Commuter students | Discover activities that fit their schedules |
| Socially active students | Find spontaneous activities and gatherings |
| Club organizers | Advertise events and recruit participants |
| Students between campuses | Discover opportunities at both Fordham campuses |

### 1.5 Product Goals

**Primary goals**

1. Make campus activities discoverable through one centralized platform.
2. Reduce the friction associated with joining social activities.
3. Encourage students to participate in activities outside their existing social circles.
4. Connect students across Fordham's two primary campuses.
5. Provide real-time activity updates.

**Success metrics**

| Metric | Hackathon MVP target |
|---|---|
| Activity creation | A student can publish an activity in under 60 seconds |
| Activity discovery | Students can locate a relevant activity in under 15 seconds |
| Joining an activity | Joining requires no more than two confirmation steps |
| Real-time updates | Attendance changes appear within 2 seconds under normal demo conditions |
| Map usability | Students can switch between both campuses |
| Core reliability | All primary user flows work during the live demonstration |

These targets are proposed acceptance goals, not measured performance claims.

---

## 2. Product Scope

### 2.1 MVP Features — Must Have

#### A. Interactive Campus Map

The map is the application's primary interface.

Requirements:
- Display Rose Hill and Lincoln Center.
- Allow users to switch between campuses.
- Display activity markers at their respective locations.
- Use different marker styles or colors for different activity categories.
- Allow users to click markers to preview activities.
- Provide a detailed activity view.
- Support zooming, panning, and map navigation.
- Include a list-based alternative to map browsing.

The map should initially open to the campus selected by the user.

#### B. Real-Time Activity Discovery

Students can browse activities through a live-updating event feed.

Each activity should display:
- Activity title.
- Short description.
- Category.
- Campus.
- Location.
- Start time.
- Host name.
- Number of participants.
- Maximum participant capacity, if applicable.
- Current activity status.

The activity feed should update when activities are created, modified, filled, or canceled.

#### C. Activity Creation

Authenticated users can create activities.

Required fields:
- Activity title.
- Description.
- Category.
- Campus.
- Campus location.
- Start date and time.

Optional fields:
- Maximum participants.
- End time.
- Additional instructions.
- Whether the activity is public or restricted to an invited group.

The host should automatically become the first participant.

#### D. Join and Leave Activities

Students can join activities hosted by other students.

Requirements:
- Display a Join button.
- Prevent users from joining the same activity multiple times.
- Display updated participant counts.
- Prevent joining activities that have reached capacity.
- Allow students to leave activities.
- Allow hosts to cancel their activities.
- Prevent users from joining canceled or expired activities.

#### E. User Authentication

Students must have an authenticated account to create activities or join them.

MVP authentication options:
- Google sign-in.
- Optional email/password authentication.

For the hackathon, Google sign-in is preferred because it reduces friction.

Important: If Fordham-only access is desired, implement domain verification only after confirming the institution's supported authentication arrangements. Do not assume that any Google account is a Fordham account.

#### F. Activity Categories

Initial categories:

| Category | Examples |
|---|---|
| Study | Study groups, homework sessions |
| Social | Lunch, coffee, casual gatherings |
| Sports | Basketball, soccer, recreational activities |
| Clubs | Club meetings, recruitment events |
| Academic | Workshops, academic discussions |
| Campus Events | University-organized activities |
| Other | Activities not covered above |

#### G. Activity Detail Panel

Clicking an activity should open a detailed view containing:
- Full activity description.
- Host information.
- Date and time.
- Location.
- Attendance information.
- Join/Leave functionality.
- Activity status.

---

### 2.2 Secondary Features — Should Have

These features can be implemented if the core functionality is complete.

1. **Interest-based filtering:** Allow students to select interests and filter activities accordingly.
2. **Personalized recommendations:** Rank activities using user interests, category preferences, campus, and time.
3. **My Activities:** Display activities created or joined by the current user.
4. **Search:** Search activities by title, description, or category.
5. **Notifications:** Notify users when an activity they joined changes or is canceled.
6. **Activity expiration:** Automatically hide activities after their scheduled end time.
7. **Host controls:** Allow hosts to edit event details and manage participation.

### 2.3 Future Features — Could Have

These are intentionally outside the initial hackathon scope.

- Direct messaging between participants.
- Group chats associated with activities.
- Student-to-student recommendations.
- Calendar integration.
- Club organization accounts.
- QR codes for event check-ins.
- Cross-campus travel coordination.
- Attendance analytics.
- Campus occupancy visualization.
- Mobile applications.

### 2.4 Explicitly Out of Scope

The initial release will not include:
- A full social media platform.
- A comprehensive university event management system.
- A campus-wide messaging application.
- Continuous background location tracking.
- Payment processing.
- Automated verification of physical attendance.
- Integration with private Fordham student databases.

---

## 3. User Stories

### 3.1 Student User

| ID | User story | Priority |
|---|---|---|
| US-01 | As a student, I want to sign in so that I can participate in activities. | Must |
| US-02 | As a student, I want to view an interactive campus map so that I can discover nearby activities. | Must |
| US-03 | As a student, I want to switch campuses so that I can discover activities at Rose Hill and Lincoln Center. | Must |
| US-04 | As a student, I want to filter activities by category so that I can find relevant events. | Must |
| US-05 | As a student, I want to view event details before joining. | Must |
| US-06 | As a student, I want to join activities so that I can participate in campus life. | Must |
| US-07 | As a student, I want to leave activities if my plans change. | Must |
| US-08 | As a student, I want to see how many people are attending. | Must |
| US-09 | As a student, I want to create an activity so that I can organize gatherings. | Must |
| US-10 | As a student, I want to see activities I have joined or created. | Should |
| US-11 | As a student, I want to receive notifications about changes to activities I joined. | Should |
| US-12 | As a student, I want to save my interests to receive better recommendations. | Could |

### 3.2 Host User

| ID | User story | Priority |
|---|---|---|
| US-13 | As a host, I want to publish an activity with a location and time. | Must |
| US-14 | As a host, I want to set a participant limit. | Must |
| US-15 | As a host, I want to edit an activity. | Should |
| US-16 | As a host, I want to cancel an activity. | Must |
| US-17 | As a host, I want to view the list of participants. | Should |

---

## 4. User Experience and Interface Requirements

### 4.1 Design Direction

RamRadar should feel like a modern campus discovery application rather than a traditional university website.

**Visual direction:**
- Modern, minimalist interface.
- Map-centered layout.
- Dark navy or neutral backgrounds with vibrant activity indicators.
- Rounded activity cards.
- Clear typography and visual hierarchy.
- Smooth transitions and responsive interactions.
- Distinctive category icons.

The design should prioritize usability over excessive animations.

### 4.2 Main Application Layout

The desktop interface should use three primary regions:

**Left sidebar**
- RamRadar logo.
- Campus selector.
- Search bar.
- Category filters.
- Navigation links.
- User profile.

**Center region**
- Interactive campus map.
- Activity markers.
- Zoom and navigation controls.
- Map/list toggle.

**Right panel**
- Selected activity details.
- Upcoming activities.
- Join button.
- Participant information.

On mobile, these regions should become a responsive layout with a collapsible navigation menu and bottom navigation.

### 4.3 Primary Screens

1. **Authentication Screen**
   - Google sign-in.
   - Application introduction.

2. **Discovery Dashboard**
   - Interactive campus map.
   - Activity markers.
   - Search and filters.
   - Activity feed.

3. **Activity Details**
   - Full activity information.
   - Participant list or count.
   - Join/Leave button.

4. **Create Activity**
   - Activity creation form.
   - Campus and location selection.
   - Date and time selection.

5. **My Activities**
   - Hosted activities.
   - Joined activities.
   - Activity management.

6. **User Profile**
   - Display name.
   - Profile image.
   - Selected campus.
   - Interests.

---

## 5. Product Constraints and Assumptions

1. Students have access to an internet-connected device.
2. The MVP will be browser-based.
3. Fordham campus coordinates and activity locations will be manually seeded.
4. Users do not need to share their personal location to use the map.
5. The application will use public map data and an open-source rendering library.
6. Real-time updates will be handled by Firebase.
7. The application will initially support English.
8. Activity data will be created by users or preloaded for demonstration purposes.
9. The project is not an official Fordham University service unless formally approved.

---

## 6. Risks and Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Few users posting activities | Empty discovery feed | Prepopulate realistic demonstration activities |
| Inaccurate event locations | Poor usability | Use predefined campus locations |
| Fake or inappropriate activities | Reduced trust | Authentication, reporting, moderation controls |
| Duplicate participation | Incorrect attendance | Database-level uniqueness and atomic updates |
| Map loading problems | Broken primary interface | Provide list view as a fallback |
| Poor mobile usability | Reduced accessibility | Responsive layouts and touch-friendly controls |
| Database permissions misconfiguration | Data exposure | Implement and test Firebase security rules |
| Location privacy concerns | Reduced adoption | Avoid storing continuous user location |

---