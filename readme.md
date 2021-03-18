# Sanity &times; React Table Demo

The bulk content editing story in Sanity is almost non-existent. From a user interface, anyway. [React Table](http://react-table.tanstack.com) gives you most of what you'd want from a table view out of the box. All this project aims to do is to wire that up to a Sanity dataset.

Currently this is a rapidly-produced proof-of-concept. The `./table` directory is a Vite JS project which combines [Sanity Client](https://www.npmjs.com/package/@sanity/client) with [React Query](https://react-query.tanstack.com) to fetch data and update the UI.

Finally, [Zustand](https://github.com/pmndrs/zustand) tracks the client state's staged mutations in preparation to post back to Sanity.

📼 [Walkthrough Video II](https://www.loom.com/share/09d40289961f4d07939993c931e5877b)

This demo now uses a custom schema.

## Roadmap of this project if I actually took the time to do it properly

- Build the whole thing inside a new [Sanity Plugin](https://www.sanity.io/plugins/sanipack) so it actually lives in the dashboard (though I might move it when closer to final because Vite's DX is just too good.)
- Leverage [Sanity UI](https://www.sanity.io/ui) throughout. One of my big gripes from WordPress is that every plugin has to inject its own **brand**. Ugh. It should look as close to native as possible. (It's currently using Tailwind and Headless UI).
- Add a bunch more React Table features like searching, filtering and pagination
- **Done!** Optimistic UI. Currently if you toggle multiple rows, the other toggles don't update until the patch request completes and the query is invalidated and refetched. It might look nicer if they all changed immediately, and then changed back if there was an error. That said...
- **Done!** Move to a 'Commit' based editing with confirmation, instead of real-time. Presently it just publishes edits as soon as you make them. Which, if taken to its logical conclusion, could be the world's biggest footgun. You could annihilate so mmany rows of data so easily! Instead I think the Table should track all the cells of each row that have changed (perhaps highlighting the modified cells) and popup a button at the bottom to say _"Publish X Changes to Y Documents"_.
- THEN I'd also like to implement a history panel. So you could `cmd+z` your way back through bulk edits. Again, safety measures for the footgun-ish nature of this project. Also because I tried implementing a History in an app once and it seemed like a really neat programming challenge...

## Original Video

Super basic version [Walkthrough Video](https://www.loom.com/share/d058ef2851a245098078cc883115b5ec)
