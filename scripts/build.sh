#!/bin/sh
# Builds the published copy of the site into _site/ (run by GitHub on every
# push; see .github/workflows/deploy.yml). You never need to run this yourself.
#
# What it does: copies the site, then renames css/styles.css and js/main.js
# to names that include a short fingerprint of their contents
# (e.g. css/styles.3f9a1c27b0.css) and points every page at the new names.
# When the CSS or JS changes, the name changes, so browsers can't reuse an
# old copy. Images, fonts and pages keep their names.
#
# The files you edit stay exactly as they are. To try it locally:
#   sh scripts/build.sh && python3 -m http.server 8124 -d _site
set -eu

cd "$(dirname "$0")/.."
OUT=_site

rm -rf "$OUT"
mkdir -p "$OUT"

# Copy everything except tooling and notes that don't belong on the site
tar -cf - \
  --exclude ./.git \
  --exclude ./.github \
  --exclude ./.claude \
  --exclude ./scripts \
  --exclude ./_site \
  --exclude ./parked \
  --exclude ./images/ceramics \
  --exclude ./CLAUDE.md \
  --exclude ./.gitattributes \
  --exclude ./.gitignore \
  --exclude '*.DS_Store' \
  . | tar -xf - -C "$OUT"

# Publish the ceramics photos referenced by the site, including popup and
# detail images. Keep unused crops and full-resolution originals in the repo.
python3 - "$OUT" <<'PY'
import html
import shutil
import sys
from pathlib import Path
from urllib.parse import unquote

output = Path(sys.argv[1])
references = "\n".join(
    unquote(html.unescape(file.read_text(encoding="utf-8")))
    for file in output.rglob("*")
    if file.is_file() and file.suffix in {".html", ".css", ".js"}
)

for photo in Path("images/ceramics").rglob("*"):
    if photo.is_file() and photo.as_posix() in references:
        destination = output / photo
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(photo, destination)
PY

fingerprint() {
  shasum -a 256 "$1" | cut -c1-10
}

CSS_HASH=$(fingerprint css/styles.css)
JS_HASH=$(fingerprint js/main.js)

mv "$OUT/css/styles.css" "$OUT/css/styles.$CSS_HASH.css"
mv "$OUT/js/main.js" "$OUT/js/main.$JS_HASH.js"

# Point every page's <link href> and <script src> at the new names
# (comments that mention the files are left alone)
find "$OUT" -name '*.html' -exec perl -pi -e "
  s#(href=\"(?:\\.\\./)*css/styles)\\.css\"#\$1.$CSS_HASH.css\"#g;
  s#(src=\"(?:\\.\\./)*js/main)\\.js\"#\$1.$JS_HASH.js\"#g;
" {} +

# Fail loudly if any page still points at the old names
if grep -rlE '(href="(\.\./)*css/styles\.css"|src="(\.\./)*js/main\.js")' "$OUT" --include='*.html'; then
  echo "Some pages still point at the un-versioned CSS/JS (listed above)." >&2
  exit 1
fi

echo "Built $OUT: css/styles.$CSS_HASH.css, js/main.$JS_HASH.js"
