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
| `english-practice/` | **English that marks itself.** Hub for the English material, in three worlds: Quests, Use of English and 5th form. Each world wears the look of the pieces it holds. 5th form pieces (*English 1: Get ready!*, *Dan's trip to Iceland*, *Shmackular Fantabular*) and the Present Perfect Quest live on their own class sites and are linked from here. |
| `english-practice/past-simple/` | Past Simple Quest — five chapters in one file. |
| `english-practice/present-perfect/` | Frozen early copy of the Present Perfect Quest, no longer linked. The hub points to the live class site (`/Present-Perfect/`), which has all seven stops. |
| `english-practice/units/` | Use of English sessions, unit 5 games and practice, tests and the final exam practice. |
| `english-practice/reading/` | Reading comprehension sets (B1+) and the *Boy in the Girls' Bathroom* trivia. |
| `imaginarium-demo/` | The Imaginarium Machine, a creative-writing app for A2 learners. |
| `ehoba-walkthrough/` | Scrubbed walkthrough of EHOBA, the survey-processing agent. All data shown is synthetic. |

## Conventions

- Every page carries `Copyright Prof Dan M. Mecikovsky` in a footer that stays
  visible on every screen.
- Classroom pages never collect student data: no accounts, no logins, nothing
  leaves the browser. The only exception is the opt-in "send my result" button on
  the live class sites, which the student has to press.
- The EHOBA walkthrough uses fictional hotel names and 99-series identifiers
  only; no real government survey data is published here.
