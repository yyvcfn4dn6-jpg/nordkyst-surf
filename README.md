# Nordkyst Surf

Kattegat windswell forecast for North Zealand surf spots (Lynæs, Liseleje, Tisvildeleje, Rågeleje/Udsholt, Gilleleje, Hornbæk, Ålsgårde/Hellebæk) with a session log that calibrates the model.

- Wind: DMI HARMONIE-AROME 2 km (via Open-Meteo), ECMWF IFS as second run
- Waves: own fetch/duration-limited Kattegat windswell model (`js/kwm.js`), cross-checked with DWD EWAM wind-sea
- Installable web app (PWA): open the GitHub Pages link on your phone → Add to Home Screen

## Peniche Surf (`/peniche/`)

Sibling app for Peniche & Baleal, Portugal (Supertubos, Molhe Leste, Consolação, Meio da Baía, Cantinho da Baía, Baleal Norte, Lagide). Same layout, different physics:

- Waves: Atlantic **groundswell** partitions (primary, secondary, wind-sea) from Météo-France MFWAM, ECMWF WAM and NOAA GFS-Wave; per-beach swell window + shelter, Komar–Gaughan breaking height (`peniche/js/psm.js`)
- Wind: Météo-France AROME (`meteofrance_seamless`) + ECMWF IFS – decides clean vs. blown out per beach orientation
- Tide: sea-level forecast, per-spot tide preference
- **Comfort size**: set your max wave; ratings drop above it, spots flag "Too big for you", and an Ocean-state card shows when the coast is clean, lumpy, big or stormy
