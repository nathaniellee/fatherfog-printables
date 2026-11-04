# fatherfog-printables
Printables for the Fatherfog TTRPG for convention one-shot convenience

## Run

Use Node.js 22.12+ (or 20.19+).

```sh
npm install
npm run dev
```

Open the local URL shown by Vite. Choose **Print sheets** (or your browser's
print command) to print or save a PDF. Each character starts on a new page;
the print button is hidden. The default sheet fits on A4 or US Letter paper
and leaves blank, underlined spaces for current Health and Hope in pencil.

## Character data

Edit the `characters` array in `src/characters.js` to add or change characters.
Stats and saves in that file are **base values, before class adjustments**.
Choose `Worker`, `Philosopher`, `Stranger`, or `Hunter` for `class`; the sheet
automatically applies that class's adjustments and trait. Max Health is derived
from adjusted Strength; `maxHope`, `defense`, and `skillPoints` are stored directly.
Working Joe therefore displays Strength/Health 47, Intellect 28, Will 31,
Body 31, Mind 24, and Spirit 28.

Each skill has a `name`, a `stats` array containing one or more of `S`, `I`, `W`,
and a numeric `bonus`. Equipment is an array of strings. See Working Joe in the
data file for a complete example. No character-creation UI or persistence is needed.

## Checks

```sh
npm test
npm run lint
npm run build
npm run preview
```
