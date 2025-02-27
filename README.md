# BeachTrack

## Update 3 (2/27/2025)
- A new component was added in "app/components/EventList.tsx" that will be called from "app/page.tsx". Handles everything found on the event tab.
- A new .css page was added to "app/styles/event-list.css" that handles all styling for things related to the event tab.
- Updated the "app/create-event/page.tsx" retrieves clerk data, specifically the username of a person.
- Added an import to the "app/page.tsx" so that 'EventList' can be called. Also removed and moved the button call for creating an event, as well as the styling from the previous update.
- Updated the api route for the GET request in bulletin.

## Update 2 (2/23/2025)
- Within "app/styles/homepage.css" styling was added for the 'create-event-button' found within "app/page.tsx
  
## Update 1 (2/22/2025)
The following files were changed:
- The "app/page.tsx" was changed, a button can be found in the 'getTabContent' function where when click will redirect the user to the create event tab
- The "app/components/navigation.tsx" was modified to remove the bug that cause the screen to glitch when return back to home page from different pages.
- The "middleware.ts" was modified, the route to the create-event page is now protected. Only logged in user can click it.
