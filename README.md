This is a small frontend app built with React + TypeScript that uses OpenStreetMap tiles and lets users draw shapes directly on the map.

Users can draw polygons, rectangles, circles, and lines.
Polygonal shapes are not allowed to overlap — partial overlaps are automatically trimmed, and drawing a shape that fully encloses another one is blocked. Line strings are excluded from these rules.

All shapes are stored as GeoJSON and can be exported as a single GeoJSON file.

The app runs completely on the client side and is deployed as a static site.


Steps to run-

npm install
npm run dev
