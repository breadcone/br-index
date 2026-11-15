# Project: br-index.com (Brian Le portfolio)

A personal portfolio site for Brian Le, a designer at IBM (mainframe modernization and AI) who also makes ceramics and grows orchids. It is hosted on GitHub Pages, so everything must be static files that work without a build step.

## How to work with me
- Brian is a designer, not a developer. Explain what you changed in plain language, in a few sentences.
- Make one change at a time. Don't refactor or restyle things I didn't ask about.
- After a change, tell me which file to open in the browser to check it.
- If a request is ambiguous, ask one short question before building.
- Never delete files or images without asking first.

## Tech rules
- Plain HTML, CSS, and JavaScript only. No frameworks, no npm packages, no build tools.
- One shared `css/styles.css` and one shared `js/main.js` for every page.
- Each page is its own `.html` file. Adding a project means copying `projects/_template.html` and filling it in.
- Use CSS variables for colors, spacing, and fonts so global changes happen in one place.
- Keep it fast: lazy-load images below the fold, use modern formats (WebP/AVIF) where possible, and don't add heavy libraries.
- Fully responsive. Check phone widths. The two-column layouts stack to one column on small screens.
- Accessible: real links and buttons, visible focus states, alt text on images, good contrast.
- Respect `prefers-reduced-motion`: any animation must switch off or simplify for those users.

## Folder structure
```
index.html            Homepage
index-menu.html       The "Index" page (list of all entries)
projects/             One HTML file per case study (+ _template.html)
ceramics.html
orchids.html
css/styles.css
js/main.js
images/               Optimized images only
CLAUDE.md             This file
```

## Design system (match the current Cargo site)
**Overall feel:** quiet, editorial, archive-like. Like an index or catalogue. Lots of white boxes, thin black lines, big confident type. Nothing decorative beyond the gradient and the work itself.

**Layout**
- Sticky top bar: "Brian Le" in italic serif on the left, "Index" in italic serif on the right, with a 1px black line underneath.
- Page background: a vertical gradient from near-white at the top to a soft periwinkle blue at the bottom. Content sits in white boxes on top of it.
- Boxes: white background, 1px solid black border, square corners (no border radius), no shadows.
- Homepage is two columns. Left column holds stacked boxes separated by 1px lines (intro statement, related entries, access points). Right column holds the role box, the timeline box, and project cards.
- Project cards: a box with the title on the left, a short description on the right, a small square arrow button (↗) in the top-right corner, then a large image below.
- Case study pages: one large bordered box. Left column is text (about 1/3 width), right column is a light gray (#eee) media panel holding images with captions underneath.
- Case studies are divided into numbered sections (1, 2, 3...) with a small hand-drawn style arrow, and small colored pill labels such as "Process" (blue tint, blue text) and "To-be" (green tint, green text).
- Previous/next navigation: square bordered arrow buttons fixed in the bottom corners of the case study pages.

**Typography**
- Sans-serif: **Alte Haas Grotesk** (Regular 400 and Bold 700). A free Helvetica-style grotesque. Fallback: "Helvetica Neue", Helvetica, Arial, sans-serif.
- Serif: **Gramercy Variable**, always in italic, weights around 300 to 700 (nav is bold italic, small labels are light italic). Used for the nav, small labels ("Related entries:", "Access points:"), the company/location lines, and pull quotes. Fallback: Georgia, serif italic. Gramercy may be licensed only for Cargo sites, so before self-hosting it, check its license. If it can't be used, substitute a similar free italic serif (e.g. Newsreader Italic or Source Serif 4 Italic from Google Fonts) and tell me.
- Hero statement and link lists: very large Alte Haas Grotesk, line height about 1.1, letter-spacing about -0.02em.
- Body text: regular sans around 18-20px, generous line height.
- Section headings inside case studies: bold sans, same size as body.
- Pull quotes: italic serif, centered in the text column.

**Color**
- Black `#000` for text and borders, white `#fff` for boxes.
- Gradient background: near-white (`#f7f9ff`) to periwinkle (`#8fb0f5`). [Adjust to match current site]
- Accent blue for pills and the interaction highlights: `#1f3fd8`. [Adjust]
- Light gray `#eee` for media panels.

## Voice and content
- Write in first person, plain and confident. Short sentences. No buzzwords or filler.
- Case study structure: overview, The Challenge, Objectives, then numbered sections showing process and outcome.
- Don't invent facts, numbers, or claims about my work. If text is missing, leave a clear `[TODO]` placeholder.

## Interactions (micro-interactions)
Keep them subtle and fast (150-300ms), in the same restrained spirit as the design. Ideas queued up:
- Hovering "pottery making" or "orchid growing" on the homepage swaps the thumbnail image.
- The hand-drawn oval around a project title draws itself like a pen stroke.
- Arrow buttons shift slightly on hover.
- Project cards get a gentle hover state.
Add these one at a time, only when I ask.

## Don'ts
- No dark mode, no pop-ups, no auto-playing media, no cookie banners, no tracking scripts.
- No rounded corners or drop shadows unless I say so.
- Don't change copy I've written without asking.
