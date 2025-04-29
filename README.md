# BeachTrack
## Update 4 (4/28/2025)
More bug fixes, UI/UX changes/improvements

Summary:
- Fixed bug for search panel “no classrooms found” for map pinpoints
- Added “Loading map…”
- Replaced pinpoints with building abbreviation markers and colored by group
- Sidebar building name is color coordinated to match map markers

Files
- src/app/components/searchPanel.tsx (Modified)
- src/styles/search-results.css (Modified)
- src/app/page.tsx (Modified)
- src/styles/spinner.css (Modified)
- src/app/components/Map.tsx (Modified)
- src/styles/map-pinpoint.css (Added)
- lib/data/buildingsData.ts (Modified)
- src/app/components/buildingColorMap.tsx (Added)
- src/app/components/buildingPanel.tsx (Modified)
- src/styles/homepage.css (Modified)


## Update 3 (4/28/2025)
More bug fixes, UI/UX changes/improvements

Summary:
- [CHANGE] Changed the search icon from the emoji to a basic black svg image
- [FEATURE] Implemented search bar autofill suggestions (we can now search by full building name as well)
- [CHANGE] Totally restyled/redesigned the search bar and main tab navigation to make it look more modern and Google Maps-like
- [BUG FIX] After searching via search bar and clicking "Clear Search Bar", the Favorites tab is now selected by default
- [BUG FIX] Similarly, after searching via map pinpoints and clicking "Close", the Favorites tab is now selected by default

Files:
- "src/app/page.tsx" (Modified)
- "src/app/components/searchPanel.tsx" (Modified)
- "src/app/components/buildingPanel.tsx" (Modified)
- "src/styles/search-results.css" (Modified)
- "src/styles/homepage.css" (Modified)


## Update 2 (4/27/2025)
Updated EventList.tsx to redirect to post-event page when clicking "View Bulletin"
- "src/app/components/EventList.tsx" (Modified)


## Update 1 (4/26/2025)
Branched from prototype to update changes for Favorites tab
- "src/app/api/favorite/route.js" (Modified)
- "src/app/components/favorites.tsx" (Added + Modified)
- "src/app/page.tsx" (Modified)
- "src/styles/spinner.css" (Added)
- "src/styles/homepage.css" (Modified)
- "src/app/components/buildingPanel.tsx" (Modified)
