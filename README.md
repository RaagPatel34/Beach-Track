# BeachTrack

## Update 2 (2/23/2025)
- Within "app/styles/homepage.css" styling was added for the 'create-event-button' found within "app/page.tsx
  
## Update 1 (2/22/2025)
The following files were changed:
- The "app/page.tsx" was changed, a button can be found in the 'getTabContent' function where when click will redirect the user to the create event tab
- The "app/components/navigation.tsx" was modified to remove the bug that cause the screen to glitch when return back to home page from different pages.
- The "middleware.ts" was modified, the route to the create-event page is now protected. Only logged in user can click it.
