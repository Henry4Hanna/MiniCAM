# MINI CAM

**Import · Simulate · Post** — by Ryan Nguyen

Import drawings or models (DXF, PDF, STL, STEP), auto-program 2.5D, 3D, 4th and 5th axis, simulate, then post G-code for ProtoTRAK, Haas, Fanuc and Siemens 840D mills and lathes.

Nhập bản vẽ hoặc mô hình (DXF, PDF, STL, STEP), tự động lập trình 2.5D, 3D, trục 4 và trục 5, mô phỏng rồi xuất G-code cho máy phay và máy tiện ProtoTRAK, Haas, Fanuc, Siemens 840D.

## Run
Open `index.html` in a browser, or turn on GitHub Pages (Settings → Pages → Deploy from branch → `main` / root).

## Files
- `index.html` — layout and styles
- `app.js` — app screens (Program, Nest, Tools, Materials, Fixtures, Simulator, Calculator, Setup sheet, Learning, Help, Settings, About)
- `engine.js` — geometry, toolpaths, feeds & speeds, posts
- `solid.js` — 3D solid kernel for the CAD tab: booleans (join / cut / intersect), extrude, revolve, sweep, loft, draft, shell, edge fillet / chamfer, STL out
- `lessons.js` — shop feed data

## Cam tab (manual 2D programming)
- Drawing from the Cad tab or an imported file (DXF, PDF, STL, STEP); stock, face-off, part thickness, safe Z and the 9-point X0 Y0 origin.
- Tap a shape, tap an operation icon: Face, 2D Contour, 2D Pocket, 2D Adaptive, Rest, Slot, T-slot undercut, 2D Chamfer, Corner radius, Spot, Drill, Tap, Ream, Bore, Circular / helical bore, Thread mill, Engrave, V-Carve.
- Each operation: tool, depths, step-down / step-over, entry (helix / ramp / plunge), lead in / out (arc / line), feeds; add, reorder, turn off or delete. Live toolpath preview and G-code.
- Versions: save the whole job, roll back to any saved version (kept in the browser).

## Cad tab
- **2D:** line, rectangle, circle, arc, polygon, slot, trim, fillet, chamfer, dimensions; move / rotate / scale / mirror about a line / offset; linear and circular patterns; multi-select.
- **Constraints:** horizontal, vertical, parallel, perpendicular, equal, coincident, concentric, tangent, fix, length, radius / Ø, point distance, angle — solved live, chains stay joined.
- **3D:** base solid (outline × thickness with pockets / holes) plus a feature list — extrude (draft, top / bottom edge fillet or chamfer, shell), revolve, sweep, loft — each joined, cut or intersected; sketch on XY / XZ / YZ. Save STL or send the solid to 3D toolpaths.

## Safety
Always verify G-code with a dry run before cutting. No warranty.

© 2026 Ryan Nguyen
