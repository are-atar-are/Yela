# Long-Term Memory

## Active Projects

### Fleeto - Fleet Booking App
**Status:** Active Development  
**Last Updated:** April 9, 2026

#### Repositories
- **arFleetTracker** (Mobile): `/Users/areatar/.openclaw/workspace/ATAR-ENG/arFleetTracker`
- **react-native-app-starter** (Template): `/Users/areatar/.openclaw/workspace/react-native-app-starter`
- **ar-fleeto-admin** (Admin Dashboard): `/Users/areatar/.openclaw/workspace/ATAR-ENG/ar-fleeto-admin`
- **learning** (Documentation): `/Users/areatar/.openclaw/workspace/learning`

#### Current Branch
`main` (ar-fleeto-admin), `feature/car-rental-ui` (arFleetTracker)

#### Features Implemented
1. **Authentication** - AWS Cognito with mock auth for dev
2. **Tasks** - Full CRUD with DynamoDB (FleetoTasks table)
3. **Vehicles** - Browse by category, book with availability check (FleetoVehicles + FleetoBookings tables)
4. **UI Components** - Buttons, Cards, Typography, Theme system
5. **Car Rental UI** - Pick up time selection with Duration row (April 9, 2026)
6. **Admin Dashboard** - UI/UX improvements, caseStudy feature, login preview (April 9, 2026)
7. **Admin Dashboard Redesign** - Light theme, glassmorphism, top navigation, new layout (April 10, 2026)

#### Architecture Rules (Draft Blueprint)
1. **Feature-based organization** - Each feature has screens/, components/, redux/, types/
2. **Path aliases** - Use `@components`, `@features`, `@themes` instead of relative paths
3. **Redux Toolkit** - Slices, thunks, selectors, persist whitelist
4. **Services layer** - API calls in `src/services/`, one per domain
5. **TypeScript** - All components typed, interfaces in types/

#### Tech Stack
- React Native 0.82.1
- Redux Toolkit + Persist
- React Navigation v7
- AWS DynamoDB
- TypeScript

#### Next Tasks
1. ✅ Commit features to react-native-app-starter (DONE)
2. ✅ Create Web vs Mobile comparison doc (DONE - in learning repo)
3. ✅ Commit ar-fleeto-admin changes (DONE - April 9, 2026)
4. ⏳ Enhance vehicle availability (calendar view, time slots)
5. ⏳ Update documentation
6. ✅ Commit ar-fleeto-admin redesign changes (DONE - April 10, 2026)
7. ✅ Dashboard connected to real DynamoDB data (DONE - April 11, 2026)

---

## Important Decisions

### Version Pinning
Always use exact versions (no caret ^) for React Native to prevent auto-updates:
```json
{
  "react": "19.1.1",
  "react-native": "0.82.1"
}
```

### Storage Strategy
- **Mobile:** AsyncStorage for Redux Persist
- **Web:** localStorage for Redux Persist
- **Sensitive:** Never store tokens in plain text

### Backend
- AWS DynamoDB for data
- AWS Cognito for auth
- Same APIs work for web and mobile

---

## Documentation Locations

| Topic | Location |
|-------|----------|
| Setup & Errors | `/Users/areatar/.openclaw/workspace/learning/README.md` |
| Architecture | `/Users/areatar/.openclaw/workspace/learning/ARCHITECTURE.md` |
| Web vs Mobile | `/Users/areatar/.openclaw/workspace/learning/WEB_VS_MOBILE.md` |
| Daily Logs | `/Users/areatar/.openclaw/workspace/memory/YYYY-MM-DD.md` |
| Project Status | `/Users/areatar/.openclaw/workspace/memory/YYYY-MM-DD-fleeto-status.md` |

---

## Contact & Context

If Telegram loses memory:
1. Check `memory/YYYY-MM-DD-fleeto-status.md` for latest status
2. Check `learning/` repo for architecture docs
3. Current project: Fleeto mobile app
4. Last working on: Tasks + Vehicles features with DynamoDB

---

*This file is for continuity across sessions. Update when major decisions are made.*
