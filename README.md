# Abdulwahid Zurayq — portfolio foundation

An original, content-driven portfolio for Abdulwahid Zurayq: a Computer Engineering student from Libya, based in Türkiye, building games, interactive products, and software systems.

The design combines a field notebook, a lightweight indie-game launcher, and a project archive. It stays useful for recruiters without pretending Abdulwahid already has a long professional game-development history.

## What is included

- Next.js App Router with TypeScript
- Tailwind CSS plus a small, original token-based design system
- Static homepage, project archive, Game Lab, Lore, Toolbox, and Contact routes
- Statically generated software and game case files
- Persistent light/dark theme
- Persistent Recruiter Mode with real content reordering and direct copy
- Accessible mobile navigation, status labels, focus states, portrait swap, and gallery dialog
- Small keyboard Easter egg that respects reduced motion
- Editable structured content in "src/content"
- Sitemap, robots configuration, canonical URLs, Open Graph metadata, Twitter metadata, and JSON-LD
- No-op analytics event layer
- Local SVG placeholders with no borrowed photos or screenshots
- Vitest coverage for project routing utilities

## Local setup

Requirements:

- Node.js 20.9 or newer
- npm 10 or newer

Install and start:

    npm install
    npm run dev

Open http://localhost:3000.

## Commands

    npm run dev        # local development server
    npm run build      # production build
    npm run start      # serve the production build
    npm run lint       # ESLint
    npm run typecheck  # TypeScript without emitting files
    npm run test       # Vitest utility tests
    npm run check      # lint, typecheck, and tests

## Content map

All personal information belongs in "src/content":

- "profile.ts" — name, biography, education, status, availability, social links, and CV path
- "projects.ts" — games, software projects, feature states, case-file writing, and links
- "experience.ts" — professional experience; placeholder data is disabled
- "quests.ts" — homepage current-quest cards
- "lore.ts" — save-file timeline and languages
- "toolbox.ts" — current, learning, academic, and future tool groups
- "ui.ts" — shared interface strings for future localization

Do not add personal copy directly to page components when it can live in these files.

## Add a software project

1. Add a Project object to "src/content/projects.ts".
2. Use category "software".
3. Choose an honest status.
4. Put the cover in "public/images/projects".
5. Add public source or live URLs only when they exist.
6. Run "npm run check" and "npm run build".

The project automatically appears at "/projects" and generates "/projects/[slug]".

## Add a game

Follow the same process but use category "game" and place art in "public/images/games". The game appears in Game Lab and generates "/game-lab/[slug]".

Keep feature lists conservative:

- available — confirmed working now
- inProgress — actively being built
- planned — intended, not promised

If there is no playable build, leave "liveUrl" empty. The interface will not render a dead Play button.

## Add experience

1. Add a verified entry to "src/content/experience.ts".
2. Set "enabled" to true.
3. Set "placeholder" to false or remove it.
4. Include only confirmed organizations, dates, roles, and highlights.
5. Optional gallery images belong in "public/images/experience".

Gallery items support an image, descriptive alt text, and a caption. The included modal uses the native modal dialog behavior for focus containment, closes with Escape, includes a visible close button, and locks background scrolling.

## Replace the profile images

Current files:

- "public/images/profile/portrait-main.svg" — 720 by 900
- "public/images/profile/portrait-alt.svg" — 720 by 900

Use portrait images with the same 4:5 aspect ratio. Update the paths, dimensions, and alt text in "src/components/interactive/photo-swap.tsx" if the filenames or size change.

The alternate image is an enhancement only. The main biography never depends on it.

## Replace project art

Every current cover is an original abstract SVG placeholder, not a fake screenshot.

Recommended replacement sizes:

- Game Lab cover: 1120 by 800 or larger
- Software covers: 960 by 600 or larger
- Social preview: 1200 by 630

Keep essential copy in HTML, not inside images. Update "coverAlt" whenever a cover changes.

## Add the real CV

The current CV link downloads "public/documents/cv-placeholder.txt".

To replace it:

1. Add a verified PDF at "public/documents/abdulwahid-zurayq-cv.pdf".
2. Change "profile.links.cv" in "src/content/profile.ts".
3. Remove the placeholder text file.

The prominent Recruiter Mode CV action updates automatically.

## Recruiter Mode

Recruiter Mode is a client-side preference stored under "zurayq-recruiter-mode".

When enabled it:

- replaces casual intro and section copy with direct descriptions
- moves software projects, verified experience, and technologies upward
- shows role interests
- emphasizes the CV action
- removes side-quest content and Easter-egg hints

It changes the existing document with data attributes and CSS ordering, so there is no reload and no duplicate recruiter-only page to maintain.

## Analytics

"src/lib/analytics.ts" dispatches a browser custom event named "zurayq:analytics". No network request or third-party tracking is active.

Tracked interactions currently include:

- project_opened
- recruiter_mode_enabled
- recruiter_mode_disabled
- cv_clicked
- game_play_clicked

To connect a provider later, add one small client adapter that listens for the event and forwards only the approved event name and properties. Document consent, retention, and privacy behavior before enabling it.

## Future translations

The first version is English only. No non-functional language switcher is shown.

Before adding Turkish or Arabic:

1. Move remaining generic page strings into locale dictionaries beside "src/content/ui.ts".
2. Add locale-aware routes or a small internationalization layer.
3. Provide complete translations before exposing a switcher.
4. Set the document direction to RTL for Arabic.
5. Test long labels, mixed-language project names, and the mobile header.
6. Keep text out of replacement artwork where possible.

The layouts use logical alignment and flexible grids so RTL support can be added without rebuilding the component system.

## Deploy to Vercel

1. Push the repository to a Git provider.
2. Import it into Vercel.
3. Keep the detected framework preset as Next.js.
4. Use the default install and build commands.
5. Set the production domain to "zurayq.xyz".
6. Confirm DNS and then test canonical, sitemap, and social-preview URLs.

No environment variables are required for the current version. Add them only when a real backend or analytics provider is introduced.

## Before publishing

- Replace both portrait placeholders.
- Replace or approve each project cover.
- Add the real CV.
- Confirm every project feature state.
- Add real project URLs when public.
- Add verified experience or leave the empty state.
- Confirm language proficiency labels.
- Replace TODO lore entries with real stories.
- Test LinkedIn and GitHub links.
- Generate a PNG social preview if a target platform does not accept SVG.

## Reference, attribution, and assets

The attached MIT-licensed andrewvu.me repository was studied as visual and structural research only. This project uses a different Next.js architecture, component system, information hierarchy, content model, visual proportions, accent system, interactions, and original CSS.

No reference photographs, biographies, project descriptions, organizations, social links, thumbnails, gallery images, or other personal assets are included. No meaningful code was copied from the reference, so its license notice is not incorporated into this codebase. If reference code is deliberately adapted later, preserve its MIT notice and document that change here.

The placeholder SVGs in "public/images" were created for this project and may be replaced freely.

This project’s code is licensed under the included MIT License. Personal content and future personal photographs remain Abdulwahid Zurayq’s property unless stated otherwise.
