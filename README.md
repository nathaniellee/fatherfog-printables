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
- Health and Hope show a blank current value followed by `/ maximum`.
- Defense is blank at zero and otherwise shows the entered score.
- Stats and saves appear side by side, each with three equal-width boxes showing
  centered uppercase labels above their centered values.
- Skills use three aligned columns for name, related stats (e.g. `I • W`, without
  brackets), and signed bonus. Rows retain horizontal rules without vertical
  dividers, with Skill Points immediately afterwards.
- Equipment is a vertical list beside Skills, using equal-width columns.

All scores are entered directly; class selection changes traits only, without
applying any automatic stat adjustments. The initial character is illustrative,
not a rules-validated character. Edits are held in memory and reset on reload.
Equipment tables, character storage and other expanded-sheet features are not
included in this first iteration.

## Validate

```sh
npm test
npm run build
```
