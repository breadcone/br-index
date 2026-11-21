# Project: br-index.com (Brian Le portfolio)

A personal portfolio site for Brian Le, a designer at IBM (mainframe modernization and AI) who also makes ceramics and grows orchids. It is hosted on GitHub Pages, so everything must be static files that work without a build step.

## How to work with me
- Brian is a designer, not a developer. Explain what you changed in plain language, in a few sentences.
- Make one change at a time. Don't refactor or restyle things I didn't ask about.
- After a change, tell me which file to open in the browser to check it.
- If a request is ambiguous, ask one short question before building.
- Never delete files or images without asking first.
- Every new orchid or ceramics work gets its name added to the Contents menu in `js/main.js` (`MENUS`), in the right group (orchids: Species or Hybrids, written as `orchid("Name")` so it links to and opens that photo; ceramics: Works), in alphabetical order. Do this with every new addition, not only when asked.

## Tech rules
- Plain HTML, CSS, and JavaScript only. No frameworks, no npm packages, no build tools.
- One shared `css/styles.css` and one shared `js/main.js` for every page.
- Each page is its own `.html` file. Adding a project means copying `projects/_template.html` and filling it in.
- Use CSS variables for colors, spacing, and fonts so global changes happen in one place.
- Keep it fast: lazy-load images below the fold, use modern formats (WebP/AVIF) where possible, and don't add heavy libraries.
- Fully responsive. Check phone widths. The two-column layouts stack to one column on small screens.
- Accessible: real links and buttons, visible focus states, alt text on images, good contrast.
- Respect `prefers-reduced-motion`: any animation must switch off or simplify for those users.
- Publishing: on every push to `main`, GitHub runs `.github/workflows/deploy.yml`, which runs `scripts/build.sh`. That copies the site and renames `css/styles.css` and `js/main.js` to fingerprinted names (e.g. `styles.3f9a1c27b0.css`) so visitors never get stale CSS/JS. This is the only build step, and it only happens on GitHub; the files in the repo always stay plain and work as-is. Always link CSS/JS in pages exactly as `href="css/styles.css"` / `src="js/main.js"` (with `../` in subfolders) so the script can find them. GitHub Pages fixes every file's cache at 10 minutes; that can't be changed here.

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
AGENTS.md             This file
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
- Don't invent facts, numbers, or claims about my work. If text is missing, leave a clear `--` placeholder.

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
- No double borders. Wherever two boxes, cells, or panels meet (including dropdowns and panels hanging off the header line), the shared edge must be one 1px line. After every layout or styling change, check for double borders at desktop and phone widths and fix any you find, even if I didn't point them out. Watch for: an element drawing its own border right on top of a neighbor's border, reused cell styles that bring their own borders, and fractional pixel sizes (e.g. a 39.6px header) that make two overlapping lines look thick. Also watch for hidden first items: when the first row of a list is hidden, the next row's "line between rows" becomes a line on top of the parent's edge. The fix is to have only one side draw the line (e.g. drop the child's top border and start it just below the parent's line). Verify by checking the actual computed borders of every *visible* edge element in the browser, not by reading the CSS; a more specific rule can silently override the fix.
