# 3-11 Test Cases

## Test Case Format

Each case has an ID, feature, preconditions, steps, expected result, actual result, status, and screenshot reference. Status is marked `Pending` until the case is executed in the local Docker environment; do not record a pass without running it.

## Functional Tests

| ID | Feature | Preconditions | Steps | Expected result | Actual result | Status | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| F-01 | Application starts | Docker is installed | Run compose up; open `http://localhost:8080` | Calendar opens without a server error | Pending execution | Pending | Pending |
| F-02 | Main page | App is running | Open the root page | Calendar, navigation, and summary are visible | Pending execution | Pending | Pending |
| F-03 | Create post | Administrator/editor role; channel exists | Add a post with title, channel, and date | Post is saved and displayed on the calendar | Pending execution | Pending | Pending |
| F-04 | List posts | Seed data loaded | Open All Posts | Seed and user-created active posts are listed | Pending execution | Pending | Pending |
| F-05 | Post details | At least one post exists | Click an event or details control | Post detail view shows content, channel, status, and date | Pending execution | Pending | Pending |
| F-06 | Edit post | Administrator/editor role; post exists | Edit title or status and save | Updated values appear in list and details | Pending execution | Pending | Pending |
| F-07 | Archive post | Administrator/editor role; post exists | Delete the post and confirm | Post is archived and removed from active views | Pending execution | Pending | Pending |
| F-08 | Required field validation | Administrator/editor role | Submit a post without a title | The browser or API rejects the request | Pending execution | Pending | Pending |
| F-09 | Invalid data | App is running | Send an unsupported status to `POST /api/posts` | API returns HTTP 400 without a stack trace | Pending execution | Pending | Pending |
| F-10 | Search and filters | Multiple posts exist | Search a title and change channel/status | Only matching posts are displayed | Pending execution | Pending | Pending |
| F-11 | Empty state | Search query has no match | Search for a non-existent phrase | Clear empty-state message is shown | Pending execution | Pending | Pending |
| F-12 | Role permissions | App is running | Select Guest and try create, edit, or archive through UI/API | API denies write actions with HTTP 403 | Pending execution | Pending | Pending |
| F-13 | Channel management | Administrator role | Add, rename, and remove an unused channel | Changes are reflected in channel list and selectors | Pending execution | Pending | Pending |

## Technical Tests

| ID | Feature | Preconditions | Steps | Expected result | Actual result | Status | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-01 | Docker startup | Docker Compose available | Run `docker compose -f 04_docker/3-11_docker-compose.yml up -d --build` from `all weeks` | App and database become healthy | Pending execution | Pending | Pending |
| T-02 | Database connection | Services running | Open `/api/health` | JSON reports database connected | Pending execution | Pending | Pending |
| T-03 | Schema initialization | Fresh Docker volume | Start services and inspect PostgreSQL tables | Tables, constraints, and indexes exist | Pending execution | Pending | Pending |
| T-04 | Seed data | Fresh Docker volume | Open calendar and channel list | Demo users, channels, and posts load | Pending execution | Pending | Pending |
| T-05 | Persistence | Services running with saved post | Restart app and database without removing volume | Saved data remains available | Pending execution | Pending | Pending |

## Security Tests

| ID | Feature | Preconditions | Steps | Expected result | Actual result | Status | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-01 | Secrets | Repository files available | Search tracked config for real credentials | Only local development defaults/placeholders exist | Pending execution | Pending | Pending |
| S-02 | Input validation | App is running | Submit empty/oversized fields and malformed JSON | API returns a client error and does not save invalid data | Pending execution | Pending | Pending |
| S-03 | Error handling | App is running | Request an unknown record and invalid route | Safe error JSON is returned without a stack trace | Pending execution | Pending | Pending |
| S-04 | Role checks | App is running | Use `X-User-Role: guest` for write routes | API returns HTTP 403 | Pending execution | Pending | Pending |
