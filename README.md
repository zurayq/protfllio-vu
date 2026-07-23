# zurayq.xyz v2

The personal portfolio of Abdulwahid Zurayq: a Computer Engineering student from Tripoli, based in İzmit, building games, interactive products, backend tools, and software systems.

## Architecture

- Python custom static-site generator
- Dedicated Jinja templates and small shared macros
- JSON structured content
- Markdown plus YAML front matter for project and game case files
- Tailwind CLI as the production CSS compiler
- vanilla JavaScript with route-specific loading
- clean-directory static HTML in `dist/`
- no React, Next.js, hydration, router, or client state framework

The homepage is deliberately quiet. Toolbox, Music, Travel, Lore, Wins, Languages, Game Lab, and the role-reveal prototype each have a dedicated template, visual system, script, mobile behavior, and reduced-motion path.

## Installation

Requirements are Node 20+, pnpm 9+, and Python 3.11+.

```bash
pnpm install
python -m pip install -r requirements.txt
```

## Development

```bash
pnpm dev
```

## Production build

```bash
pnpm build
pnpm preview
```

The build safely cleans `dist`, validates content, renders dedicated templates, compiles and minifies CSS, copies stable source assets and local vendor libraries, writes sitemap/robots/CNAME, and validates generated internal links. It never generates fake portraits, album art, or per-project placeholders.

Vercel settings remain:

- Framework Preset: Other
- Build Command: `pnpm build`
- Output Directory: `dist`

## Content and routes

Short structured content lives in `content/*.json`. Long project and game files live under `content/projects` and `content/games`. Add every new route to `EXPECTED_ROUTES` in `src/build.py`.

Shared document structure stays in `src/templates/layout.html`. Interactive pages use dedicated templates under `src/templates/random` or `src/templates/games`, plus matching scripts under `src/scripts`.

## Source assets

Permanent source art lives under `public/assets`:

- `profile/` contains stable illustrated portrait fallbacks.
- `projects/` contains six original project covers.
- `games/` contains the Imposter, Tower Defense, and locked-slot cases.
- `music/` contains thirteen individual original typographic cards.
- `travel/` contains two illustrated location cards.
- `toolbox/` contains the original technology symbol sheet.
- `world/countries.json` contains local Natural Earth geography.

To add real profile photos, place `me.jpg` and `me-alt.jpg` in `public/assets/profile` and update the two image paths in `src/templates/index.html`. Until then, the site uses the clearly labeled illustrated silhouettes. The build never creates or overwrites them.

Replace illustrated project covers with real screenshots when available, update the cover mapping in `src/build.py`, and keep explicit dimensions and descriptive alt text.

Place the real CV at `public/assets/documents/Abdulwahid_Zurayq_CV.pdf`. While it is absent, the header says `CV updating` and CV actions are omitted.

## Interactive architecture

Global JavaScript is limited to theme handling.

- Toolbox uses a fixed-step canvas loop, a 10×20 board, seven-bag pieces, hold, ghost, line clearing, levels, scoring, keyboard controls, and touch controls.
- Music uses the local Matter.js bundle, four walls, pointer constraints, velocity clamping, resizing, pause, tidy, reset, gravity, and static modes.
- Travel uses local D3, TopoJSON, and Natural Earth data for a draggable orthographic projection with real country outlines and geographic pins.
- Lore uses a keyboard-accessible file tree with hash-restored selection and copyable links.
- Wins and Languages use dedicated keyboard-operable selection interfaces.
- The role-reveal prototype requires a deliberate 400ms hold and hides its secret immediately on release.

The homepage loads none of the heavy interactive libraries.

## Accessibility and tests

The site provides semantic landmarks, one h1 per page, visible focus states, keyboard control, Arabic RTL, reduced-motion fallbacks, non-hover access to information, descriptive image alternatives, and static/list fallbacks for experimental pages.

```bash
python -m unittest discover -s tests -v
```

Tests cover content parsing, expected routes, metadata, headings, internal links, source assets, script isolation, interactive-route contracts, and forbidden framework dependencies.

## Licensing and attribution

The implementation and original visual assets in this repository are licensed under the MIT License; see `LICENSE`. No code or personal assets from reference portfolio owners were copied.

The local world map is derived from public-domain Natural Earth data through `world-atlas`; details are in `public/assets/world/README.txt`.
