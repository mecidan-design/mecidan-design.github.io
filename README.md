# mecidan-design.github.io

Dan Martín Mecikovsky's portfolio. Everything here is static HTML: no build
step, no framework, no backend. Each page is self-contained and runs offline
once it has loaded — that is the point, not an accident, because these tools
are used on school machines.

## Structure

The site is organised as three collections, not a list of files.

| Path | What it is |
| --- | --- |
| `/` | Portfolio homepage. |
| `philosophy/` | **Philosophy, made walkable.** Hub for the classroom philosophy material. |
| `philosophy/descartes/` | The complete Descartes unit: five scrollytelling lessons, the 3D wax simulation, the tribunal argument game. |
| `escape-cartesiano/` | *El Edificio* — the six-floor Cartesian escape room (single file, art and voice-over embedded). |
| `interactive-lessons/` | The standalone lessons (Plato's cave, feudalism to modernity, the demolition). `index.html` redirects to `philosophy/`. |
| `english-practice/` | **English that marks itself.** Hub for the English material. |
| `english-practice/past-simple/` | Past Simple Quest — five chapters in one file. |
| `english-practice/present-perfect/` | Present Perfect Quest — six stops, units 13 and 14. |
| `english-practice/units/` | Use of English sessions, unit games and tests. |
| `english-practice/reading/` | Reading trivia. |
| `imaginarium-demo/` | The Imaginarium Machine, a creative-writing app for A2 learners. |
| `ehoba-walkthrough/` | Scrubbed walkthrough of EHOBA, the survey-processing agent. All data shown is synthetic. |

## Conventions

- Every page carries `Copyright Prof Dan M. Mecikovsky` in a footer that stays
  visible on every screen.
- Classroom pages never collect student data: no accounts, no logins, nothing
  leaves the browser.
- The EHOBA walkthrough uses fictional hotel names and 99-series identifiers
  only; no real government survey data is published here.
