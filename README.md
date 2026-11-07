# fatherfog-printables
Printables for the Fatherfog TTRPG for convention one-shot convenience

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local URL shown by Vite. Edit the example character on the left and
view the printable sheet on the right. Use **Print character sheet** to print
or save as PDF; turn off browser headers and footers in the print dialog.
Letter and A4 paper are supported. Long lists can continue onto additional pages.

## Character sheets

- Name, class and its traits appear first.
- Health and Hope show a blank current value followed by `/ maximum`, without
  additional current/maximum captions.
- Defense is blank at zero and otherwise shows the entered score.
- Stats and saves appear side by side, each with three equal-width columns showing
  centered uppercase labels above bordered circles with their values centered inside.
  The group titles are omitted from the visible sheet.
- Skills use three aligned columns for name, related stats (e.g. `I • W`, without
  brackets), and signed bonus. Rows retain horizontal rules without vertical
  dividers, with Skill Points immediately afterwards.
- Equipment is a vertical list beside Skills, using equal-width columns.

All scores are entered directly; class selection changes traits only, without
applying any automatic stat adjustments. The initial character is illustrative,
not a rules-validated character. Equipment tables and other expanded-sheet
features are not included in this first iteration.

## Saving characters

Use **Save character** to store a named character in local storage, then choose
it from **Saved characters** to load every field into the editor and preview.
For a loaded character, **Save changes** updates that entry (including renames);
**Save as new** creates a separate copy. Copies may have the same name.
Switching characters with unsaved edits asks for confirmation.

Saving is explicit, not automatic. Unsaved edits reset on reload; saved characters
remain available in the dropdown. Data belongs to this browser profile and site
address (including port), not an account, and clearing site data removes it.
Storage errors appear in the editor. Invalid or unsupported saved data is not
silently discarded or overwritten.

## Validate

```sh
npm test
npm run build
```
