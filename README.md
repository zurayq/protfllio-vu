# zurayq.xyz v2

The personal portfolio of Abdulwahid Zurayq: a Computer Engineering student from Tripoli, based in İzmit, building games, interactive products, backend tools, and software systems.

## Project overview

The site is a clean personal operating system. Recruiters get a direct professional path through Resources, Projects, and Game Lab; curious visitors get Lore, Toolbox, Music, Travel, Languages, and Wins.

## Design philosophy

The interface mixes a paper notebook, a README, an old utility, and a restrained indie-game menu. It uses warm paper colors, thin square borders, hard shadows, honest project status, and no giant hero, gradients, fake terminal typing, skill percentages, or invented metrics.

## Architecture

- Python custom static-site generator
- Jinja templates and macros
- JSON structured content
- Markdown plus YAML front matter for long project and game case files
- Tailwind CLI as the production CSS compiler
- vanilla JavaScript with route-specific loading
- clean-directory static HTML in `dist/`
- no React, Next.js, hydration, router, or client state framework

## Installation

Requirements are Node 20+, pnpm 9+, Python 3.11+, and uv.

```bash
pnpm install
uv sync
```

## Development

```bash
pnpm dev
```

This builds the current content and serves `dist/` at `http://127.0.0.1:3000`.

## Production build

```bash
uv run python src/build.py --output dist
pnpm build
pnpm preview
```

`pnpm build` safely cleans `dist`, validates content, renders HTML, compiles and minifies CSS, creates local SVG placeholders, copies assets, writes sitemap/robots/CNAME, and validates generated internal links.

## Deployment

The workflow in `.github/workflows/deploy.yml` runs on pushes to `main` and manual dispatch. Enable GitHub Pages with GitHub Actions as the source, point DNS at GitHub Pages, and keep `public/CNAME` set to `zurayq.xyz`. The workflow installs dependencies, runs tests, builds, uploads `dist`, and deploys only after success.

## Content editing

Short structured content lives in `content/*.json`. Personal facts belong in `content/profile.json`; shared page copy and SEO live in `content/site.json`. Templates should stay generic.

## Adding a project

Create `content/projects/<slug>.md` with unique `slug` and `route`, plus `title`, `category`, `filters`, `status`, `summary`, `stack`, `role`, nullable `links`, and the case-file headings used by the existing entries. Add its route to `EXPECTED_ROUTES` in `src/build.py`.

## Adding a game

Create `content/games/<slug>.md` with the same core metadata plus `platform`, `technology`, `last_updated`, and an honest status. Do not render store or playable links unless a real URL exists.

## Replacing profile photos

Add `public/assets/profile/me.jpg` and `public/assets/profile/me-alt.jpg`, then update the image paths in `src/templates/page.html`. Until then, the generator creates clearly labeled 1200×1500 local SVG placeholders. Never replace them with an invented person.

## Replacing generated thumbnails

Generated covers are written under `dist/assets/generated`. Put permanent real screenshots under `public/assets/projects` or `public/assets/games`, update the matching template/content asset path, and keep explicit dimensions and descriptive alt text.

## Adding real project links

Set `source` or `live` under the Markdown `links` mapping only after the URL exists publicly. Null links do not render. A repository-wide source link should be configured only after this site has its own public repository URL.

## Adding the CV PDF

Place the real file at `public/assets/documents/Abdulwahid_Zurayq_CV.pdf`. The build detects it automatically. While absent, the header says `CV updating` and every CV action is omitted so the site never ships a dead link.

## Dark mode

Theme selection uses the `.dark` selector. A tiny head script prevents flash, `theme.js` persists explicit choices as `localStorage.theme`, and system preference updates apply only when no explicit user choice exists.

## Interactive page architecture

Global JavaScript is limited to theme handling. Accordion, portrait, filtering, toolbox, language, travel, and music code load only on routes that need them. Music dynamically loads the local Matter.js bundle and has a static fallback. Travel uses a lightweight local SVG globe with a list fallback. The homepage loads neither.

## Accessibility

The site includes a skip link, semantic landmarks, one h1 per page, logical focus states, keyboard-operated accordions, filters, tabs, and inventory, an Arabic RTL panel, reduced-motion handling, non-hover access to essential information, descriptive image alternatives, mobile target sizes, and static/list fallbacks for experimental pages.

## Performance budgets

The generator tests the homepage HTML against the 90KB budget. CSS is minified in production. Homepage JavaScript stays small and excludes Matter.js, map libraries, Three.js, MathJax, client frameworks, analytics, and autoplay media. SVG placeholders need no raster optimization.

## Tests

```bash
uv run python -m unittest discover -s tests -v
```

Tests cover content parsing and counts, unique routes/slugs, generated pages, metadata, headings, internal-link validation, image alternatives, script isolation, production files, and forbidden framework dependencies.

## Licensing and attribution

The implementation and original generated visual assets in this repository are licensed under the MIT License; see `LICENSE`. The current v2 generator, templates, writing structure, and interactions are an original implementation. No code or personal assets from the named reference portfolio owners were copied into this rebuild, so the conditional reference attribution text is intentionally not claimed.
