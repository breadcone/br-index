// Shared scripts for every page. Interactions get added here one at a time.

/* ---------------------------------------------------------
   Clean addresses
   The published site links to pages without ".html" (br-index.com/ceramics,
   and just br-index.com for the design homepage); scripts/build.sh rewrites
   the links when it publishes. The files here keep their ".html" links, so
   they still work when opened straight from the folder.
   pagePath() treats "/ceramics.html" and "/ceramics" (and "/index.html" and
   "/") as the same page. If someone arrives on an old ".html" address on the
   live site, the address bar is tidied to the clean one (no reload).
   --------------------------------------------------------- */
function pagePath(path) {
  return path.replace(/\.html$/, "").replace(/\/index$/, "/");
}
(function () {
  var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  if (/^https?:$/.test(location.protocol) && !local && /\.html$/.test(location.pathname)) {
    history.replaceState(history.state, "", pagePath(location.pathname) + location.search + location.hash);
  }
})();

/* ---------------------------------------------------------
   Index overlay (site navigation)
   Hovering or clicking "Index" in the header slides a panel in from the
   right edge, just below the header, so "Index" stays visible. With a
   mouse it slides back out shortly after the pointer leaves the panel.
   On touch screens, tapping "Index" again or tapping outside closes it;
   with a keyboard, Escape or tabbing out of the panel closes it.
   It has a title ("/design") and a serif line under it, then three groups (Case studies,
   Information, Correspondence). Hovering an entry draws the blue oval
   around its title; the page you're on keeps its oval.
   The content lives here once, so every page stays in sync: edit the
   INDEX object below to change it.
   This runs first so the oval script below picks up its links.
   --------------------------------------------------------- */
(function () {
  // One Index menu per portfolio, picked by the header's "br-index/…" label.
  // Each has a title and groups of entries; an empty group is left out.
  var RESUME = { text: "Resume", href: "https://freight.cargo.site/m/N3042622597460362339586141958857/Resume.pdf", external: true };
  var EMAIL = { text: "Email", href: "mailto:brian.le.de@gmail.com" };
  var LINKEDIN = { text: "LinkedIn", href: "https://www.linkedin.com/in/lebrians/", external: true };
  var INSTAGRAM = { text: "Instagram", href: "https://www.instagram.com/breadcone/", external: true };
  // An orchid entry: links to its photo on the orchids page, which opens
  // its popup (the #name is matched by the photo popup script below)
  function orchid(name) {
    return { text: name, href: "orchids.html#" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") };
  }
  // "About" opens the About dialog (built below), not a separate page.
  var ABOUT = { text: "About", href: "#about", about: true };
  var MENUS = {
    "br-index/design": {
      title: "/design",
      home: "index.html",
      subtitle: "", // optional line under the title (e.g. "Selected works from IBM")
      groups: [
        { label: "Case studies", items: [
          { text: "z/OS AI Framework", meta: "2024–2026", href: "projects/ai-framework.html" },
          { text: "Cloud Pak System", meta: "2018–2021", href: "projects/cloud-pak-system.html" },
          { text: "Cloud Pak AIOps", meta: "2021–2022", href: "projects/cloud-pak-aiops.html" }
        ] },
        { label: "Info", items: [ABOUT, RESUME] },
        { label: "Contact", items: [EMAIL, LINKEDIN] }
      ]
    },
    "br-index/ceramics": {
      title: "/ceramics",
      home: "ceramics.html",
      groups: [
        { label: "Objects", showCount: true, items: [
          { text: "Dendrobium", href: "ceramics.html#dendrobium" },
          { text: "Persimmon Fuyu", href: "ceramics.html#persimmon-fuyu" },
          { text: "Persimmon Hachiya", href: "ceramics.html#persimmon-hachiya" },
          { text: "Phalaenopsis", href: "ceramics.html#phalaenopsis" },
          { text: "Ritual in Algae", href: "ceramics.html#ritual-in-algae" },
          { text: "Ritual in Jade", href: "ceramics.html#ritual-in-jade" },
          { text: "Ritual in Oxide", href: "ceramics.html#ritual-in-oxide" },
          { text: "Ritual in Spring", href: "ceramics.html#ritual-in-spring" },
          { text: "Stone Fruit", href: "ceramics.html#stone-fruit" },
          { text: "The Gate", href: "ceramics.html#the-gate" },
          { text: "Trí Tuệ (Wisdom)", href: "ceramics.html#tri-tue-wisdom" },
          { text: "Từ Bi (Compassion)", href: "ceramics.html#tu-bi-compassion" }
        ] },
        // "Artist Statement" has no page yet
        { label: "Info", items: [{ text: "Artist Statement", href: "#", todo: true }] },
        { label: "Contact", items: [EMAIL, INSTAGRAM] }
      ]
    },
    "br-index/orchids": {
      title: "/orchids",
      home: "orchids.html",
      groups: [
        // Species and Hybrids show their labels even if emptied. Names are in
        // alphabetical order. Each opens that orchid's photo popup.
        { label: "Species", keep: true, items: [
          orchid("Bulbophyllum rothschildianum"),
          orchid("Cattleya luteola"),
          orchid("Dendrobium bellatulum"),
          orchid("Gastrochilus japonicus"),
          orchid("Laelia alaorii"),
          orchid("Phalaenopsis corningiana"),
          orchid("Platystele ovatilabia")
        ] },
        { label: "Hybrids", keep: true, items: [
          orchid("Brassavola David Sander"),
          orchid("Cattleya Peckhaviensis"),
          orchid("Phalaenopsis Sacha")
        ] },
        { label: "Contact", items: [EMAIL, INSTAGRAM] }
      ]
    }
  };
  var nameEl = document.querySelector(".site-header__name");
  var INDEX = MENUS[nameEl ? nameEl.textContent.trim() : ""] || MENUS["br-index/design"];

  // Work out the site root from this script's own address (js/main.js),
  // so links work from the homepage and from projects/ pages alike.
  var script = document.currentScript;
  // (On the live site the file is renamed with a fingerprint, e.g.
  // js/main.3f9a1c27b0.js; see scripts/build.sh.)
  var root = script ? script.src.replace(/js\/main(\.[0-9a-f]+)?\.js(\?.*)?$/, "") : "";
  function url(path) { return /^(https?:|mailto:)/.test(path) ? path : root + path; }

  // Each entry is a full-width cell: title in sans with an optional serif
  // line under it (the years).
  function cell(item) {
    var href = item.todo ? "#" : url(item.href);
    var target = new URL(href, location.href);
    var current = !item.todo && !target.hash && target.origin === location.origin &&
      pagePath(target.pathname) === pagePath(location.pathname);
    var ext = item.external ? ' target="_blank" rel="noopener"' : "";
    var cur = current ? ' aria-current="page"' : "";
    var todo = item.todo ? ' data-todo="no page yet"' : "";
    var about = item.about ? " data-about" : "";
    // Years are hidden for now (kept in INDEX); set SHOW_YEARS to true to bring them back
    var SHOW_YEARS = false;
    var meta = SHOW_YEARS && item.meta ? '<span class="index-cell__meta">' + item.meta + "</span>" : "";
    return '<li><a class="index-cell" href="' + href + '"' + ext + cur + todo + about + ">" +
      '<span class="index-cell__text"><span class="index-cell__title" data-oval>' + item.text + "</span>" + meta + "</span></a></li>";
  }
  // `compact`: single-line entries (no years) sit closer together
  function group(label, items, compact, keep) {
    if (!items.length && !keep) return "";
    return '<section class="index-sec' + (compact ? " index-sec--compact" : "") + '"><div class="index-sec__head"><h2 class="label">' + label + ":</h2></div>" +
      '<ul class="index-cells">' + items.map(cell).join("") + "</ul></section>";
  }
  function buildPanel(menu, withTitle) {
    menu = menu || INDEX;
    return (
      '<section class="index-sec index-sec--intro"><h2 class="index-title"><a class="index-title__link" href="' + url(menu.home) + '" aria-label="' + menu.title + ' home" data-oval>' + (withTitle ? menu.title : "") + "</a></h2>" +
      (menu.subtitle ? '<p class="index-sub">' + menu.subtitle + "</p>" : "") + "</section>" +
      menu.groups.map(function (g) {
        var label = g.showCount ? g.label + " (" + g.items.length + ")" : g.label;
        return group(label, g.items, true, g.keep);
      }).join("")
    );
  }

  // Section switcher: hovering the "br-index/…" label in the header (or
  // tapping it on a touch screen) drops down the other two portfolios. Built here so every page stays in sync.
  (function () {
    var nameLink = document.querySelector(".site-header__name");
    if (!nameLink) return;
    var SECTIONS = [
      { text: "br-index/design", href: "index.html" },
      { text: "br-index/ceramics", href: "ceramics.html" },
      { text: "br-index/orchids", href: "orchids.html" }
    ];
    var current = nameLink.textContent.trim();
    var wrap = document.createElement("div");
    wrap.className = "site-switch";
    nameLink.parentNode.insertBefore(wrap, nameLink);
    wrap.appendChild(nameLink);
    nameLink.setAttribute("aria-haspopup", "true");
    var list = document.createElement("ul");
    list.className = "site-switch__menu";
    list.innerHTML = SECTIONS.filter(function (s) { return s.text !== current; }).map(function (s) {
      var name = s.text.replace("br-index/", "");
      return '<li><a data-oval href="' + url(s.href) + '">br-index/<span class="site-section">' + name + "</span></a></li>";
    }).join("");
    wrap.appendChild(list);

    // Touch screens have no hover, so a tap on the label opens and closes
    // the dropdown. Tapping anywhere outside closes it.
    var touch = window.matchMedia("(hover: none), (max-width: 800px)");
    function setSwitchOpen(open) {
      wrap.classList.toggle("is-open", open);
      nameLink.setAttribute("aria-expanded", open ? "true" : "false");
    }
    nameLink.addEventListener("click", function (e) {
      if (!touch.matches) return;
      e.preventDefault();
      setSwitchOpen(!wrap.classList.contains("is-open"));
    });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) setSwitchOpen(false);
    });

    // Phones only (shown by the CSS): a chevron after the label, hinting
    // at the dropdown. The label itself is plain text and appears right away.
    var section = nameLink.querySelector(".site-section");
    if (section) {
      var chevron = document.createElement("img");
      chevron.className = "icon site-switch__chevron";
      chevron.src = url("images/icons/chevron-down.svg");
      chevron.alt = "";
      section.parentNode.insertBefore(chevron, section.nextSibling);
    }

    // Make the label cell as wide as the widest portfolio name, so the
    // dropdown below it is exactly the same width. Re-measured once the
    // fonts load and whenever the window changes size.
    function matchWidths() {
      wrap.style.width = "";
      var widest = Math.max(nameLink.offsetWidth, list.offsetWidth);
      wrap.style.width = widest + "px";
    }
    matchWidths();
    if (document.fonts) document.fonts.ready.then(matchWidths);
    window.addEventListener("resize", matchWidths);
  })();

  var trigger = document.querySelector(".site-header__index");
  if (!trigger) return;

  var overlay = document.createElement("nav");
  overlay.className = "box index-panel index-overlay";
  overlay.id = "index-overlay";
  overlay.setAttribute("aria-label", "Contents");
  overlay.innerHTML = buildPanel();

  var closeContentsButton = document.createElement("button");
  closeContentsButton.type = "button";
  closeContentsButton.className = "index-overlay__close";
  closeContentsButton.setAttribute("aria-label", "Close Contents");
  closeContentsButton.innerHTML = '<img src="' + url("images/icons/close.svg") + '" alt="">';
  overlay.querySelector(".index-title").after(closeContentsButton);

  // Every portfolio's panel is as wide as the design one, so the panel keeps
  // one width across the site. Measured from a hidden copy of the design
  // menu, again once fonts load and when the window changes size.
  // (On phones the CSS makes it full width instead.)
  function matchDesignWidth() {
    var probe = document.createElement("nav");
    probe.className = "box index-panel index-overlay";
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "visibility:hidden;transform:none;transition:none;";
    probe.innerHTML = buildPanel(MENUS["br-index/design"], true);
    document.body.appendChild(probe);
    overlay.style.setProperty("--index-width", probe.getBoundingClientRect().width + "px");
    probe.remove();
  }
  matchDesignWidth();
  if (document.fonts) document.fonts.ready.then(matchDesignWidth);
  window.addEventListener("resize", matchDesignWidth);
  // Placeholder entries (no page yet) do nothing when clicked
  overlay.querySelectorAll("[data-todo]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });
  // Placed right after the header, so Tab moves from "Index" straight into the panel
  var header = trigger.closest(".site-header");
  header.parentNode.insertBefore(overlay, header.nextSibling);

  // About dialog: opened by "About" in the Index panel. A landscape box, half
  // the window wide: the orb photo, name and location on the left; the
  // statement and access points on the right. Built here so it is in the page
  // before the hover-oval script runs. Stacks to one column on phones.
  var aboutDialog = document.createElement("dialog");
  aboutDialog.className = "about";
  aboutDialog.setAttribute("aria-label", "About Brian Lê");
  aboutDialog.innerHTML =
    '<button type="button" class="about__close" aria-label="Close about"><img class="icon" src="' + url("images/icons/close.svg") + '" alt=""></button>' +
    '<div class="about__grid">' +
      '<div class="about__side">' +
        // the same orb photo and moving light as the homepage (.orb-photo):
        // the light drifts on its own and follows the mouse when it's near.
        // (The earlier twinkling version is saved in parked/about-orb-twinkle.html.)
        '<div class="about__cover"><span class="orb-photo about__orb">' +
          '<img class="related__thumb" src="' + url("images/home/orb.avif") + '" width="800" height="800" alt="A frosted glass orb resting on a soft blue background">' +
          '<span class="orb-photo__light" aria-hidden="true"></span>' +
        '</span></div>' +
        '<div class="about__info">' +
          '<div class="about__cell"><p class="label">Name</p><p class="about__value">Brian Lê</p></div>' +
          '<div class="about__cell"><p class="label">Location</p><p class="about__value">New York City</p></div>' +
        "</div>" +
      "</div>" +
      '<div class="about__main">' +
        '<div class="about__text"><p class="label">About</p>' +
          "<p>Brian Lê is a Design Lead at IBM, working at the intersection of complex technology and human understanding. With a background in traditional graphic design, his practice emphasizes typography, information design, and visual systems to humanize mission-critical systems.</p>" +
          '<p class="about__resume"><a data-oval href="' + url(RESUME.href) + '" target="_blank" rel="noopener">Resume.pdf</a></p></div>' +
      "</div>" +
    "</div>";
  document.body.appendChild(aboutDialog);

  var aboutClose = aboutDialog.querySelector(".about__close");
  aboutClose.addEventListener("click", function () { aboutDialog.close(); });
  // A click on the dimmed backdrop (outside the box) also closes it
  aboutDialog.addEventListener("click", function (e) { if (e.target === aboutDialog) aboutDialog.close(); });
  var aboutReturnFocus = trigger;
  aboutDialog.addEventListener("close", function () { aboutReturnFocus.focus(); });
  document.querySelectorAll("[data-about]").forEach(function (aboutLink) {
    aboutLink.addEventListener("click", function (e) {
      e.preventDefault();
      aboutReturnFocus = overlay.contains(aboutLink) ? trigger : aboutLink;
      setOpen(false);
      aboutDialog.showModal();
    });
  });

  trigger.setAttribute("aria-controls", "index-overlay");
  trigger.setAttribute("aria-expanded", "false");

  // "/design" types itself in each time the panel opens, with the same
  // blue caret as the homepage intro; the caret stays and keeps blinking.
  // The slash is black, the rest blue. Reduced motion: it just appears.
  // The title is a link back to that portfolio's homepage; the typing
  // happens inside the link so its oval hover stays in place.
  var title = overlay.querySelector(".index-title__link");
  var titleRun = 0;
  function typeTitle() {
    var thisRun = ++titleRun;
    var text = INDEX.title;
    var wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    var section = document.createElement("span");
    section.className = "site-section";
    var chars = Array.from(text).map(function (ch, i) {
      var span = document.createElement("span");
      span.className = "type-char";
      span.textContent = ch;
      (i === 0 && ch === "/" ? wrap : section).appendChild(span);
      return span;
    });
    wrap.appendChild(section);
    var prev = title.querySelector(":scope > span[aria-hidden]");
    if (prev) prev.remove();
    Array.from(title.childNodes).forEach(function (n) { if (n.nodeType === 3) n.remove(); });
    title.insertBefore(wrap, title.firstChild);
    var last = chars[chars.length - 1];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      chars.forEach(function (c) { c.classList.add("is-shown"); });
      last.classList.add("is-caret", "is-done");
      return;
    }
    var i = 0;
    (function step() {
      if (thisRun !== titleRun) return;
      if (i > 0) chars[i - 1].classList.remove("is-caret");
      if (i === chars.length) { last.classList.add("is-caret", "is-done"); return; }
      chars[i].classList.add("is-shown", "is-caret");
      i++;
      // A steady, even pace: every letter takes the same time
      setTimeout(step, 110);
    })();
  }
  typeTitle();

  function setOpen(open) {
    if (open && !isOpen()) setTimeout(typeTitle, 120); // starts as the panel slides in
    document.documentElement.classList.toggle("index-open", open);
    trigger.setAttribute("aria-expanded", open ? "true" : "false");
  }
  function isOpen() { return document.documentElement.classList.contains("index-open"); }

  trigger.addEventListener("click", function (e) {
    e.preventDefault();
    setOpen(!isOpen());
  });

  closeContentsButton.addEventListener("click", function () {
    setOpen(false);
    trigger.focus({ preventScroll: true });
  });

  trigger.addEventListener("keydown", function (e) {
    if (e.key !== " ") return;
    e.preventDefault();
    if (!e.repeat) trigger.click();
  });

  document.addEventListener("click", function (e) {
    if (isOpen() && !overlay.contains(e.target) && !trigger.contains(e.target)) setOpen(false);
  });
  // Keyboard: tabbing out of the panel (anywhere but back to "Index") closes it
  overlay.addEventListener("focusout", function (e) {
    var to = e.relatedTarget;
    if (to && !overlay.contains(to) && !trigger.contains(to)) setOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) { setOpen(false); trigger.focus(); }
  });
})();

/* ---------------------------------------------------------
   Hand-drawn hover oval
   Any element with a `data-oval` attribute gets a blue pen-stroke oval
   drawn around it on hover (see .oval in styles.css).
   The oval is redrawn at its real pixel size whenever its box changes,
   so the line is the same thickness on every element.
   --------------------------------------------------------- */
(function () {
  var SVG_NS = "http://www.w3.org/2000/svg";

  // The oval's shape on a 100 x 40 grid: a starting point, then five curves.
  // It ends a little past where it starts, like a quick loop drawn by hand.
  var SHAPE = [
    [12, 8],
    [30, 0], [80, 0], [95, 10],
    [102, 16], [100, 30], [88, 36],
    [70, 42], [25, 41], [8, 34],
    [-1, 29], [0, 14], [10, 7],
    [14, 4.5], [20, 3], [26, 2.5]
  ];

  // Small links use a closed loop that ends exactly where it starts
  // (no overlap). Their CSS sets --oval-closed: 1.
  var CLOSED = SHAPE.slice(0, 12).concat([[12, 8]]);

  // Links inside a `data-oval-vary` list each get their own slightly
  // different oval: every point is nudged a little and the loop tilts a bit.
  // The nudges come from the link's position in the page, so a link always
  // gets the same oval, but no two neighbours match.
  var varyCount = 0;
  function variedShape(seed) {
    function rand() { // small repeatable random numbers, -1 to 1
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280 * 2 - 1;
    }
    var tilt = rand() * 4;    // left side up or down by up to 4 units
    var stretch = rand() * 4; // a touch wider or narrower
    return SHAPE.map(function (p) {
      var x = p[0] + rand() * 3.5 + (p[0] - 50) / 50 * stretch;
      var y = p[1] + rand() * 3 + (50 - p[0]) / 50 * tilt;
      return [x, y];
    });
  }

  function buildPath(width, height, closed, shape) {
    var pts = (shape || (closed ? CLOSED : SHAPE)).map(function (p) {
      return (p[0] * width / 100).toFixed(1) + " " + (p[1] * height / 40).toFixed(1);
    });
    var d = "M " + pts[0];
    for (var i = 1; i < pts.length; i += 3) {
      d += " C " + pts[i] + ", " + pts[i + 1] + ", " + pts[i + 2];
    }
    return d;
  }

  function fit(svg) {
    var box = svg.getBoundingClientRect();
    if (!box.width || !box.height) return;
    svg.setAttribute("viewBox", "0 0 " + box.width + " " + box.height);
    var style = getComputedStyle(svg);
    var closed = style.getPropertyValue("--oval-closed").trim() === "1";
    svg.firstChild.setAttribute("d", buildPath(box.width, box.height, closed, svg.ovalShape));
  }

  var observer = "ResizeObserver" in window
    ? new ResizeObserver(function (entries) {
        entries.forEach(function (entry) { fit(entry.target); });
      })
    : null;

  function addOval(el) {
    if (el.querySelector(":scope > .oval")) return;
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "oval");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    var path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("pathLength", "1");
    svg.appendChild(path);
    if (el.closest("[data-oval-vary]")) svg.ovalShape = variedShape(++varyCount * 7919);
    el.appendChild(svg);

    fit(svg);
    if (observer) observer.observe(svg);
  }

  document.querySelectorAll("[data-oval]").forEach(addOval);
  window.addOval = addOval; // used by the intro to circle its key phrase
})();

/* ---------------------------------------------------------
   Collection and Archive dropdowns
   Clicking "Collection" opens a list of every photo, in two groups:
   Species, then Hybrids, each in alphabetical order. Choosing a name opens
   that photo's popup. The list is built from the grid itself, so new photos
   show up here as soon as they are added to the grid. The ceramics Archive
   lists works in their visual order, including in the shuffled grid.
   --------------------------------------------------------- */
(function () {
  var toggle = document.querySelector(".work-browser__toggle");
  if (!toggle) return;
  var panel = document.getElementById(toggle.getAttribute("aria-controls"));
  var section = toggle.closest(".work-browser");
  if (!panel || !section) return;

  var items = Array.from(section.querySelectorAll(".work-squares__item[data-kind]"));
  function nameOf(item) {
    var n = item.querySelector(".work-squares__name");
    return n ? n.textContent.trim() : "";
  }
  var closeBox = section.querySelector(".work-browser__close"); // phones only (CSS)
  function setOpen(open) {
    panel.hidden = !open;
    if (closeBox) closeBox.hidden = !open;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.classList.toggle("is-open", open);
  }
  function popupOpen() {
    return document.documentElement.classList.contains("lightbox-open");
  }

  function renderGroup(group) {
    var block = document.createElement("section");
    block.className = "index-sec index-sec--compact";
    if (group.label) {
      var headWrap = document.createElement("div");
      headWrap.className = "index-sec__head";
      var head = document.createElement("h3");
      head.className = "label";
      head.textContent = group.label;
      headWrap.appendChild(head);
      block.appendChild(headWrap);
    }
    var ul = document.createElement("ul");
    ul.className = "index-cells";
    group.items.forEach(function (item) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "index-cell";
      var wrap = document.createElement("span");
      wrap.className = "index-cell__text";
      var text = document.createElement("span");
      text.className = "index-cell__title";
      text.setAttribute("data-oval", "");
      text.textContent = nameOf(item);
      wrap.appendChild(text);
      btn.appendChild(wrap);
      // The list stays open behind the popup, so after closing the popup
      // you can pick the next name
      btn.addEventListener("click", function () {
        var photo = item.querySelector("img");
        if (photo) photo.click(); // the same click that opens the photo's popup
      });
      li.appendChild(btn);
      ul.appendChild(li);
      if (window.addOval) window.addOval(text);
    });
    block.appendChild(ul);
    panel.appendChild(block);
  }

  var archive = panel.id === "ceramics-archive-menu";
  if (archive) {
    var grid = section.querySelector(".work-squares");
    function renderArchive() {
      if (panel.hidden) return;
      // Explicitly positioned tiles can be displayed out of markup order.
      var positions = Array.from(grid.children).filter(function (item) {
        return item.matches(".work-squares__item:not([hidden])") && nameOf(item);
      }).map(function (item) {
        return { item: item, rect: item.getBoundingClientRect() };
      });
      positions.sort(function (a, b) {
        return Math.abs(a.rect.top - b.rect.top) < 1
          ? a.rect.left - b.rect.left
          : a.rect.top - b.rect.top;
      });
      panel.textContent = "";
      renderGroup({
        label: "Objects (" + positions.length + "):",
        items: positions.map(function (entry) { return entry.item; })
      });
    }

    new MutationObserver(renderArchive).observe(grid, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["data-cols", "data-order", "hidden"]
    });
    if (window.ResizeObserver) new ResizeObserver(renderArchive).observe(grid);
    toggle.addEventListener("click", function () {
      setOpen(panel.hidden);
      renderArchive();
    });
  } else {
    [{ label: "Species:", kind: "species" }, { label: "Hybrids:", kind: "hybrid" }].forEach(function (group) {
      group.items = items.filter(function (item) {
        return item.getAttribute("data-kind") === group.kind;
      }).sort(function (a, b) { return nameOf(a).localeCompare(nameOf(b)); });
      renderGroup(group);
    });
    toggle.addEventListener("click", function () { setOpen(panel.hidden); });
  }
  if (closeBox) closeBox.addEventListener("click", function () { setOpen(false); toggle.focus(); });
  // Escape and clicks outside close the list, except while a photo popup is
  // open: those close the popup only, and the list stays open.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden && !popupOpen()) { setOpen(false); toggle.focus(); }
  });
  document.addEventListener("click", function (e) {
    if (panel.hidden || section.contains(e.target) || e.target.closest(".lightbox")) return;
    setOpen(false);
  });
})();


/* ---------------------------------------------------------
   Typing intro + intro carousel
   The element with `data-type-in` types itself into place on page load,
   letter by letter, with a thin blue caret leading the way.
   Hovering a link with `data-intro` clears the line and quickly types that
   link's text in its place, and back on leave.
   The current line is always in aria-label, so screen readers get it whole.
   Visitors who prefer reduced motion see each line appear instantly.
   --------------------------------------------------------- */
(function () {
  var el = document.querySelector("[data-type-in]");
  if (!el) return;
  var heading = el.closest("h1") || el;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // The phrase to circle in this page's own line, e.g. "designer"
  var circle = el.getAttribute("data-circle");
  var pageText = el.textContent.trim();

  // Where the phrase sits in a line (only in the page's own line)
  function markRange(text) {
    if (!circle || text !== pageText) return null;
    var k = text.toLowerCase().indexOf(circle.toLowerCase());
    return k < 0 ? null : [k, k + circle.length];
  }
  function drawCircle(mark) {
    if (!mark || !window.addOval) return;
    window.addOval(mark);
    requestAnimationFrame(function () { mark.classList.add("is-drawn"); });
  }
  var run = 0; // increases each time typing restarts, so an older run stops

  function typeIn(text, startDelay, speed) {
    speed = speed || 1; // lower is faster
    var thisRun = ++run;
    heading.setAttribute("aria-label", text);

    var range = markRange(text);
    var mark = null;

    if (reduceMotion) {
      el.textContent = "";
      if (range) {
        mark = document.createElement("span");
        mark.className = "intro-mark";
        mark.textContent = text.slice(range[0], range[1]);
        el.append(text.slice(0, range[0]), mark, text.slice(range[1]));
        drawCircle(mark);
      } else {
        el.textContent = text;
      }
      el.classList.add("is-ready");
      return;
    }

    var wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    var chars = Array.from(text).map(function (ch, idx) {
      var span = document.createElement("span");
      span.className = "type-char";
      // A line break in the text (&#10; in the HTML) becomes a space plus a
      // real line break, so the words never run together
      if (ch === "\n") {
        span.textContent = " ";
        span.appendChild(document.createElement("br"));
      } else {
        span.textContent = ch;
      }
      if (range && idx === range[0]) {
        mark = document.createElement("span");
        mark.className = "intro-mark";
        wrap.appendChild(mark);
      }
      (range && idx >= range[0] && idx < range[1] ? mark : wrap).appendChild(span);
      return span;
    });

    el.textContent = "";
    el.appendChild(wrap);
    el.classList.add("is-ready");

    var i = 0;
    var end = chars.length;
    // With `data-type-circle-only`, the rest of the line is there from the
    // start and only the circled phrase types in (the caret waits just
    // before it), then the oval draws and the caret goes away.
    var circleOnly = range && el.hasAttribute("data-type-circle-only");
    if (circleOnly) {
      chars.forEach(function (c, idx) {
        if (idx < range[0] || idx >= range[1]) c.classList.add("is-shown");
      });
      i = range[0];
      end = range[1];
      speed *= 1.3; // a touch slower, since only a word or two types in
      if (i > 0) chars[i - 1].classList.add("is-caret");
    }

    function step() {
      if (thisRun !== run) return; // a newer line took over
      if (i > 0) chars[i - 1].classList.remove("is-caret");

      if (circleOnly && i === end) {
        drawCircle(mark);
        return;
      }

      if (i === chars.length) {
        // Finished: the caret stays at the end and keeps blinking
        chars[chars.length - 1].classList.add("is-caret", "is-done");
        drawCircle(mark);
        return;
      }

      chars[i].classList.add("is-shown", "is-caret");
      var ch = chars[i].textContent;
      i++;

      // Slight, natural rhythm: a touch longer after spaces and punctuation
      var delay = (45 + Math.random() * 25) * speed;
      if (ch === " ") delay += 30 * speed;
      if (ch === "." || ch === ",") delay += 160 * speed;
      setTimeout(step, delay);
    }

    setTimeout(step, startDelay);
  }

  typeIn(el.textContent.trim(), 350);

  // Hover swap: the line clears and the new line types in quickly in its place
  var defaultText = el.textContent.trim();

  function swapTo(text) {
    heading.setAttribute("aria-label", text);
    if (reduceMotion) { ++run; el.textContent = text; return; }
    typeIn(text, 0, 0.35);
  }

  // Reserve enough height for the longest line, so swapping text never moves
  // the links below (otherwise a taller line could push the hovered link out
  // from under the mouse and make it flicker back and forth).
  var allLines = [defaultText].concat(
    Array.from(document.querySelectorAll("[data-intro]")).map(function (a) { return a.getAttribute("data-intro"); })
  );
  function reserveHeight() {
    var probe = heading.cloneNode(false);
    probe.removeAttribute("aria-label");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;min-height:0;white-space:pre-line;width:" + heading.offsetWidth + "px";
    heading.parentNode.appendChild(probe);
    var tallest = 0;
    allLines.forEach(function (line) {
      probe.textContent = line;
      tallest = Math.max(tallest, probe.offsetHeight);
    });
    probe.remove();
    heading.style.minHeight = tallest + "px";
  }
  // Hover swap is switched off for now (too busy). Set to true to bring it back.
  // Only reserve the extra height when it's on; otherwise the intro box
  // keeps exactly its own 3 lines.
  var HOVER_SWAP = false;
  if (HOVER_SWAP) {
    reserveHeight();
    if ("ResizeObserver" in window) new ResizeObserver(reserveHeight).observe(heading.parentNode);
    if (document.fonts) document.fonts.ready.then(reserveHeight);
  }
  if (HOVER_SWAP) document.querySelectorAll("[data-intro]").forEach(function (link) {
    var show = function () { swapTo(link.getAttribute("data-intro")); };
    var reset = function () { swapTo(defaultText); };
    link.addEventListener("mouseenter", show);
    link.addEventListener("focus", show);
    link.addEventListener("mouseleave", reset);
    link.addEventListener("blur", reset);
  });
})();

/* ---------------------------------------------------------
   Project menu (case study pages)
   The card opens on hover through CSS; this adds tap and keyboard support.
   - The menu link for the section you're reading keeps its blue oval.
   - While the card is open, clicking the square button goes to the next section, or from the last section to the
     next project.
   --------------------------------------------------------- */
(function () {
  var menu = document.querySelector(".project-menu");
  if (!menu) return;
  var button = menu.querySelector(".project-menu__button");

  // Section links (#...) in page order, and the next-project links
  var sectionLinks = Array.from(menu.querySelectorAll('a[href^="#"]')).filter(function (a) {
    return a.getAttribute("href").length > 1 && document.getElementById(a.getAttribute("href").slice(1));
  });
  var projectLinks = Array.from(menu.querySelectorAll("a")).filter(function (a) {
    return sectionLinks.indexOf(a) === -1;
  });
  var nextHref = "#";

  function setOpen(open) {
    menu.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
  }


  // Active section + what "next" points to
  var ticking = false;
  function updateActive() {
    ticking = false;
    var line = window.innerHeight * 0.4;
    var activeIndex = 0;
    sectionLinks.forEach(function (a, i) {
      var section = document.getElementById(a.getAttribute("href").slice(1));
      if (section.getBoundingClientRect().top <= line) activeIndex = i;
    });
    sectionLinks.forEach(function (a, i) {
      var on = i === activeIndex;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });

    var next = sectionLinks[activeIndex + 1];
    if (next) {
      nextHref = next.getAttribute("href");
      button.setAttribute("aria-label", "Next section: " + next.textContent.trim());
    } else {
      nextHref = projectLinks.length ? projectLinks[0].getAttribute("href") : "#";
      button.setAttribute("aria-label", "Next project" + (projectLinks.length ? ": " + projectLinks[0].textContent.trim() : ""));
    }
  }
  function requestUpdate() {
    if (!ticking) { ticking = true; requestAnimationFrame(updateActive); }
  }
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  updateActive();

  // Button: when the card is showing it goes to "next"; otherwise it opens
  // the card. A first tap on a touch screen only opens it.
  var lastPointer = "mouse";
  button.addEventListener("pointerdown", function (e) { lastPointer = e.pointerType; });
  button.addEventListener("click", function () {
    var openNow = menu.classList.contains("is-open") ||
      (lastPointer !== "touch" && menu.matches(":hover, :focus-within"));
    lastPointer = "mouse";
    if (!openNow) { setOpen(true); return; }
    setOpen(false);
    button.blur();
    if (nextHref.charAt(0) === "#") {
      if (nextHref.length > 1) {
        document.getElementById(nextHref.slice(1)).scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        });
        history.replaceState(null, "", nextHref);
      }
    } else {
      window.location.href = nextHref;
    }
  });

  menu.addEventListener("mouseleave", function () { setOpen(false); });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      setOpen(false);
      a.blur();
    });
  });
  document.addEventListener("click", function (e) {
    if (!menu.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    setOpen(false);
    if (menu.contains(document.activeElement)) document.activeElement.blur();
  });
})();

// Mobile image viewer for case studies.
(function () {
  var photos = document.querySelectorAll(".case-study .cs-panel img");
  if (!photos.length) return;

  var mobile = window.matchMedia("(max-width: 800px)");
  var viewer = document.createElement("dialog");
  viewer.className = "cs-image-viewer";
  viewer.setAttribute("aria-label", "Enlarged case study image");
  viewer.innerHTML =
    '<button class="cs-image-viewer__close" type="button" aria-label="Close enlarged image" autofocus>' +
      '<img class="cs-image-viewer__image" alt="">' +
    '</button>';
  document.body.appendChild(viewer);

  var closeButton = viewer.querySelector(".cs-image-viewer__close");
  var enlarged = viewer.querySelector(".cs-image-viewer__image");

  function open(photo, fromPointer) {
    if (!mobile.matches || viewer.open) return;
    photo.focus({ preventScroll: true });
    viewer.classList.toggle("cs-image-viewer--pointer", fromPointer);
    closeButton.setAttribute("aria-label", "Close enlarged image: " + photo.alt);
    enlarged.alt = photo.alt;
    enlarged.src = photo.currentSrc || photo.src;
    viewer.showModal();
  }

  function updateTriggers() {
    if (!mobile.matches && viewer.open) viewer.close();
    photos.forEach(function (photo) {
      if (mobile.matches) {
        photo.tabIndex = 0;
        photo.setAttribute("role", "button");
        photo.setAttribute("aria-haspopup", "dialog");
        photo.setAttribute("aria-label", "Enlarge image: " + photo.alt);
      } else {
        photo.removeAttribute("tabindex");
        photo.removeAttribute("role");
        photo.removeAttribute("aria-haspopup");
        photo.removeAttribute("aria-label");
      }
    });
  }

  photos.forEach(function (photo) {
    photo.addEventListener("click", function (event) {
      open(photo, event.detail > 0);
    });
    photo.addEventListener("keydown", function (event) {
      if (!mobile.matches || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      open(photo, false);
    });
  });
  closeButton.addEventListener("click", function () { viewer.close(); });
  viewer.addEventListener("click", function (event) {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener("keydown", function () {
    viewer.classList.remove("cs-image-viewer--pointer");
  });
  mobile.addEventListener("change", updateTriggers);
  updateTriggers();
})();

/* ---------------------------------------------------------
   Image popup (ceramics work cards)
   Clicking a photo opens it larger. Every popup has the same shape and
   size as the first Persimmons photo (1800 × 1270); other photos are
   cropped to fill it. It grows from the center with the same timing as the
   other boxes, and folds back the same way. There is no visible close
   button: a click anywhere, or Escape, closes it. A hidden "Close photo"
   button stays for keyboard and screen-reader users.
   --------------------------------------------------------- */
(function () {
  // Enable grid popups on an entire grid or on an individual tile.
  var gridPhotos = "[data-popup-native] .work-squares img, .work-squares__item[data-popup-native] img";
  var photos = document.querySelectorAll(".work-card img:not(.icon), .work-grid img, " + gridPhotos);
  var nativeSize = false;
  if (!photos.length) return;

  // Site root, worked out from this script's address, so the close icon
  // loads from any page (also with the fingerprinted name on the live site)
  var iconRoot = document.currentScript ? document.currentScript.src.replace(/js\/main(\.[0-9a-f]+)?\.js(\?.*)?$/, "") : "";

  var pop = document.createElement("div");
  // Same popup on every page and screen size (.lightbox--full in
  // css/styles.css): no white mat, just the 1px black line, glass behind,
  // as large as fits below the header.
  pop.className = "lightbox lightbox--full";
  pop.setAttribute("role", "dialog");
  pop.setAttribute("aria-modal", "true");
  pop.setAttribute("aria-label", "Enlarged photo");
  pop.innerHTML =
    '<div class="lightbox__viewport"><div class="lightbox__center"><div class="lightbox__frame">' +
      '<div class="box lightbox__box">' +
        '<div class="lightbox__media"><img class="lightbox__img" alt=""><section class="lightbox__thumbs" aria-label="Gallery photos" hidden></section></div>' +
        '<div class="lightbox__meta" hidden></div>' +
      "</div>" +
      // Keep the close control available to keyboard and screen reader users.
      '<button class="lightbox__close" type="button" aria-label="Close photo"><img class="icon" src="' + iconRoot + 'images/icons/close.svg" alt=""></button>' +
    "</div></div></div>";
  document.body.appendChild(pop);
  var viewport = pop.querySelector(".lightbox__viewport");
  var frame = pop.querySelector(".lightbox__frame");
  var big = pop.querySelector(".lightbox__img");
  var closeBtn = pop.querySelector(".lightbox__close");
  viewport.setAttribute("tabindex", "-1"); // can take focus, but isn't a Tab stop
  // Remember whether the last input was a pointer or the keyboard.
  var usedPointer = false;
  document.addEventListener("pointerdown", function () { usedPointer = true; }, true);
  document.addEventListener("keydown", function () { usedPointer = false; }, true);
  var lastPhoto = null;
  var meta = pop.querySelector(".lightbox__meta");
  var thumbs = pop.querySelector(".lightbox__thumbs");
  var gallery = []; // the open photo's set of full-size photos (empty: just one photo)
  var popupWidth;
  var swipeStart = null;
  var swipeClosed = false;
  var fragmentPhotos = new Map();
  // Entries from a previous page load must be dismissed in place after refresh.
  var popupSession = performance.timeOrigin;

  // Grid items with more than one photo list them on the tile:
  // data-gallery (full-size files) and data-gallery-thumbs (small files),
  // space-separated, in the same order. The first is the grid photo.
  // Clicking a thumbnail shows that photo; the popup stays open.
  function showPhoto(k) {
    big.src = gallery[k];
    var description = thumbs.children[k].getAttribute("data-photo-alt");
    if (description) big.alt = description;
    Array.prototype.forEach.call(thumbs.children, function (b, j) {
      b.setAttribute("aria-current", j === k ? "true" : "false");
    });
  }
  function fillGallery(item) {
    thumbs.textContent = "";
    var full = nativeSize && item ? item.getAttribute("data-gallery") : null;
    gallery = full ? full.trim().split(/\s+/) : [];
    if (gallery.length < 2) {
      gallery = [];
      thumbs.hidden = true;
      return;
    }
    var small = (item.getAttribute("data-gallery-thumbs") || "").trim().split(/\s+/);
    var descriptions = (item.getAttribute("data-gallery-alt") || "").split("|");
    gallery.forEach(function (src, k) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "lightbox__thumb";
      b.setAttribute("aria-label", descriptions[k] || ("Photo " + (k + 1) + " of " + gallery.length));
      if (descriptions[k]) b.setAttribute("data-photo-alt", descriptions[k]);
      var im = document.createElement("img");
      im.src = small[k] || src;
      im.alt = "";
      b.appendChild(im);
      b.addEventListener("click", function (e) {
        e.stopPropagation(); // a thumbnail click doesn't close the popup
        showPhoto(k);
      });
      thumbs.appendChild(b);
      new Image().src = src; // load ahead so switching is instant
    });
    thumbs.hidden = false;
  }

  // Orchid popups get a small strip under the photo: the name, then the
  // species cross and year crossed for hybrids, or the natural origin for
  // species. The data comes from data-* attributes on each grid item.
  function fillMeta(item) {
    if (closeBtn.parentNode === meta) frame.appendChild(closeBtn);
    meta.textContent = "";
    var ceramics = item && item.getAttribute("data-kind") === "ceramics";
    pop.classList.toggle("lightbox--ceramics", !!ceramics);
    if (!nativeSize || !item || !item.getAttribute("data-kind")) {
      meta.hidden = true;
      return;
    }
    var nameEl = item.querySelector(".work-squares__name");
    if (ceramics) {
      var year = item.querySelector(".work-squares__year");
      [
        ["Title:", nameEl.textContent.replace(/,$/, "")],
        ["Year:", item.getAttribute("data-year") || (year && year.textContent) || "--"],
        ["Dimensions:", item.getAttribute("data-dimensions") || "--"],
        ["Materials:", item.getAttribute("data-materials")]
      ].forEach(function (entry, index) {
        if (!entry[1]) return;
        var cell = document.createElement("div");
        cell.className = "lightbox__work-cell";
        if (index === 2) cell.classList.add("lightbox__work-cell--dimensions");
        var label = document.createElement("p");
        label.className = "work-card__label";
        label.textContent = entry[0];
        var value = document.createElement("p");
        value.className = index === 0 ? "work-card__title" : "work-card__value";
        value.textContent = entry[1];
        cell.appendChild(label);
        cell.appendChild(value);
        meta.appendChild(cell);
      });
      meta.hidden = false;
      return;
    }
    var name = document.createElement("p");
    name.className = "lightbox__meta-name";
    name.textContent = nameEl ? nameEl.textContent : "";
    meta.appendChild(name);
    // The details sit together in one group, under a divider after the name
    var details = document.createElement("div");
    details.className = "lightbox__meta-details";
    meta.appendChild(details);
    // A row: a bold label, then the value in the lighter weight
    function row(label, value) {
      var p = document.createElement("p");
      p.className = "lightbox__meta-row";
      var lab = document.createElement("span");
      lab.className = "lightbox__meta-label";
      lab.textContent = label;
      p.appendChild(lab);
      p.appendChild(document.createTextNode(" " + value));
      details.appendChild(p);
    }
    if (item.getAttribute("data-kind") === "hybrid") {
      row("Hybrid cross:", item.getAttribute("data-cross") || "--");
    } else {
      row("Species native to:", item.getAttribute("data-origin") || "--");
    }
    meta.hidden = false;
  }

  // Height of the strip at a given photo width (0 when there is no strip)
  function metaHeight(width) {
    if (meta.hidden) return 0;
    meta.style.width = width + "px";
    return meta.offsetHeight;
  }

  // Every popup has the shape of the first Persimmons photo; other photos
  // are cropped to fill it (object-fit: cover in css/styles.css).
  // Pages marked data-popup-phone="square" (all ceramics pages) use a
  // square instead on phones.
  var RATIO = 1800 / 1270;
  var phoneQuery = window.matchMedia("(max-width: 800px)");

  var squareOnPhone = !!document.querySelector('[data-popup-phone="square"]');

  function sizeCeramics(maxW, maxH) {
    meta.style.width = "";
    if (phoneQuery.matches) {
      if (closeBtn.parentNode !== frame) frame.appendChild(closeBtn);
      var pixelLimit = 1080 / (window.devicePixelRatio || 1);
      var size = Math.max(1, Math.floor(Math.min(maxW, pixelLimit)));
      meta.style.width = size + "px";
      thumbs.style.width = size + "px";
      big.style.width = size + "px";
      big.style.height = size + "px";
    } else {
      if (closeBtn.parentNode !== meta) meta.appendChild(closeBtn);
      var ratio = RATIO * 0.9;
      var height = Math.max(1, Math.floor(Math.min(maxH, (maxW - meta.offsetWidth) / ratio)));
      big.style.width = Math.round(height * ratio) + "px";
      big.style.height = height + "px";
    }
  }

  // On phones the popup scrolls, so a height change doesn't resize the photo.
  function sizeFor() {
    var phone = phoneQuery.matches;
    var ratio = squareOnPhone && phone ? 1 : RATIO;
    var sizingBox = phone ? viewport : pop;
    var popStyle = getComputedStyle(sizingBox);
    var padX = (parseFloat(popStyle.paddingLeft) || 0) + (parseFloat(popStyle.paddingRight) || 0);
    var padY = (parseFloat(popStyle.paddingTop) || 0) + (parseFloat(popStyle.paddingBottom) || 0);
    // leave room for the box's 1px line on each side
    var line = 2;
    popupWidth = sizingBox.clientWidth;
    var maxW = popupWidth - padX - line;
    var maxH = phone ? Infinity : pop.clientHeight - padY - line;
    if (!thumbs.hidden) {
      var thumbnailParent = phone ? big.parentNode : frame;
      if (thumbs.parentNode !== thumbnailParent) thumbnailParent.appendChild(thumbs);
      if (!phone) {
        // Keep the stack the same width across galleries that have up to five photos.
        var stackWidth = Math.max(2, Math.min(104, Math.floor((maxH - 1) / Math.max(5, gallery.length))));
        thumbs.style.width = stackWidth + "px";
        maxW -= stackWidth;
      }
    }
    if (pop.classList.contains("lightbox--ceramics")) {
      sizeCeramics(maxW, maxH);
      return;
    }
    var width;
    if (nativeSize) {
      var orchidLimit = 1296 / (window.devicePixelRatio || 1);
      width = Math.floor(Math.min(orchidLimit, maxW, maxH));
      if (!phone) {
        for (var i = 0; i < 2; i++) {
          width = Math.max(1, Math.floor(Math.min(width, maxH - metaHeight(width))));
        }
      }
      if (phone) thumbs.style.width = width + "px";
      meta.style.width = width + "px";
      ratio = 1;
    } else {
      width = Math.round(Math.min(maxW, maxH * ratio));
    }
    big.style.width = width + "px";
    big.style.height = Math.round(width / ratio) + "px";
  }

  function show(photo) {
    var trigger = photo.closest("a[data-popup-id]") || photo;
    if (lastPhoto === trigger) return;
    swipeStart = null;
    swipeClosed = false;
    lastPhoto = trigger;
    nativeSize = photo.matches(gridPhotos);
    fillMeta(photo.closest(".work-squares__item"));
    fillGallery(photo.closest(".work-squares__item"));
    var fullSrc = photo.getAttribute("data-full");
    big.alt = photo.alt;
    if (gallery.length) {
      showPhoto(0);
    } else {
      // Keep the page photo visible if the larger file is slow or unavailable.
      big.src = photo.currentSrc || photo.src;
      if (fullSrc) {
        var hi = new Image();
        hi.onload = function () {
          if (lastPhoto === trigger && !gallery.length) {
            big.src = hi.src;
          }
        };
        hi.src = fullSrc;
      }
    }
    sizeFor();
    viewport.scrollTop = 0;
    document.documentElement.classList.add("lightbox-open");
    // Keyboard users land on the close control. Mouse and touch users get
    // focus on the popup itself, so the hidden X doesn't flash into view.
    if (usedPointer) viewport.focus({ preventScroll: true });
    else closeBtn.focus({ preventScroll: true });
  }

  function open(photo) {
    var link = photo.closest("a[data-popup-id]");
    if (link) {
      var hash = "#" + link.dataset.popupId;
      if (location.hash !== hash) {
        if (fragmentPhotos.has(location.hash)) {
          history.replaceState(history.state, "", hash);
        } else {
          history.pushState({ portfolioPopup: popupSession }, "", hash);
        }
      }
    }
    show(photo);
  }

  function hide(restoreFocus) {
    document.documentElement.classList.remove("lightbox-open");
    if (restoreFocus !== false && lastPhoto) lastPhoto.focus({ preventScroll: true });
    lastPhoto = null;
  }

  function close(restoreFocus) {
    if (!lastPhoto) return;
    hide(restoreFocus);
    if (!fragmentPhotos.has(location.hash)) return;
    if (history.state && history.state.portfolioPopup === popupSession) {
      history.back();
    } else {
      history.replaceState(history.state, "", location.pathname + location.search);
    }
  }

  // Start downloading the high-detail file as soon as a finger or mouse
  // presses on a photo, so the sharp version is ready sooner
  function preload(photo) {
    var src = photo.getAttribute("data-full");
    if (src && !photo._preloaded) { photo._preloaded = true; new Image().src = src; }
  }

  photos.forEach(function (photo) {
    var link = photo.closest("a[data-popup-id]");
    if (link) {
      fragmentPhotos.set("#" + link.dataset.popupId, photo);
      if (link.dataset.popupAlias) fragmentPhotos.set("#" + link.dataset.popupAlias, photo);
      link.setAttribute("aria-haspopup", "dialog");
      link.addEventListener("pointerdown", function () { preload(photo); });
      link.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        open(photo);
      });
      return;
    }
    photo.addEventListener("pointerdown", function () { preload(photo); });
    photo.setAttribute("tabindex", "0");
    photo.setAttribute("role", "button");
    photo.setAttribute("aria-label", "Enlarge photo: " + photo.alt);
    photo.addEventListener("click", function () { open(photo); });
    photo.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(photo); }
    });
  });

  if (fragmentPhotos.size) {
    function closeContents() {
      document.documentElement.classList.remove("index-open");
      var trigger = document.querySelector(".site-header__index");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    }

    function syncPopup() {
      var photo = fragmentPhotos.get(location.hash);
      if (!photo) {
        if (lastPhoto) hide();
        return;
      }
      closeContents();
      open(photo);
    }

    // A same-page Contents link uses the History API, just like a tile.
    document.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var link = e.target.closest(".index-overlay a[href]");
      if (!link || link.origin !== location.origin || pagePath(link.pathname) !== pagePath(location.pathname)) return;
      var photo = fragmentPhotos.get(link.hash);
      if (!photo) return;
      e.preventDefault();
      closeContents();
      open(photo);
    });
    window.addEventListener("popstate", syncPopup);
    window.addEventListener("hashchange", syncPopup);
    syncPopup();
  }

  // Re-fit on rotation or desktop resize, ignoring phone toolbar changes.
  window.addEventListener("resize", function () {
    if (document.documentElement.classList.contains("lightbox-open") &&
        (!phoneQuery.matches || viewport.clientWidth !== popupWidth)) sizeFor();
  });

  var touchMenuQuery = window.matchMedia("(hover: none), (max-width: 800px)");
  var header = document.querySelector(".site-header");
  if (header) {
    header.addEventListener("click", function (e) {
      if (!touchMenuQuery.matches || !document.documentElement.classList.contains("lightbox-open")) return;
      var trigger = e.target.closest(".site-header__index, .site-header__name");
      if (!trigger) return;
      close(false);
      trigger.focus({ preventScroll: true });
    }, true);
  }

  pop.addEventListener("pointerdown", function (e) {
    swipeStart = null;
    swipeClosed = false;
    if (phoneQuery.matches && e.pointerType === "touch" && e.isPrimary) {
      swipeStart = { id: e.pointerId, x: e.clientX, y: e.clientY };
    }
  });
  pop.addEventListener("pointercancel", function () { swipeStart = null; });
  pop.addEventListener("pointerup", function (e) {
    if (!swipeStart || e.pointerId !== swipeStart.id) return;
    var x = e.clientX - swipeStart.x;
    var y = e.clientY - swipeStart.y;
    swipeStart = null;
    if (x < 65 || x < Math.abs(y) * 1.5) return;
    swipeClosed = true;
    close();
  });
  pop.addEventListener("click", function (e) {
    // A swipe that starts on a thumbnail should never select that photo.
    if (!swipeClosed) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    swipeClosed = false;
  }, true);

  closeBtn.addEventListener("click", close);
  pop.addEventListener("click", close); // anywhere, photo included
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.documentElement.classList.contains("lightbox-open")) close();
  });
})();

/* ---------------------------------------------------------
   Orb photo highlight
   By default the highlight on the glass orb photo drifts slowly left and
   right on its own. When the mouse comes near the orb (within a circle
   wider than the photo), it follows the mouse's left/right position instead, then eases
   back into the slow drift when the mouse moves away. It moves straight
   across the glass at a fixed height. The drift only runs while the photo
   is on screen. Off for reduced motion.
   --------------------------------------------------------- */
(function () {
  var photos = document.querySelectorAll(".orb-photo");
  if (!photos.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ORB = { x: 0.52, y: 0.5125, r: 0.2075 }; // matches --orb-x/y/r in the CSS
  var SWING = 0.75 * ORB.r;                   // how far the highlight travels either side of center
  var DRIFT_SECONDS = 12;                     // one full left-right-left drift
  var mouse = null;
  var state = Array.from(photos).map(function () {
    // starting spot: a little left of center (40% of the way to the left end)
    return { x: ORB.x - SWING * 0.4, y: ORB.y, phase: Math.asin(-0.4), following: false };
  });
  var visible = Array.from(photos).map(function () { return true; });
  var running = false;
  var last = null;

  // How close the mouse must be to start following: a circle around the
  // orb's center, well beyond the photo itself (at least 240px).
  function range(box) { return Math.max(240, box.width * 1.8); }
  // How far left/right the mouse moves to carry the light from one end to
  // the other (kept the same as before, so the light stays as responsive).
  function span(box) { return Math.max(160, box.width * 1.25) * 0.75; }

  // How quickly the light catches up, per second of time rather than per
  // frame, so it moves at the same speed on every screen and browser
  // (Safari often runs at 30 frames a second, which used to halve it).
  // Higher = quicker. Following the mouse is quick; drifting is gentle.
  var FOLLOW_SPEED = 8;
  var DRIFT_SPEED = 3.6;

  function target(box, s, dt) {
    var cx = box.left + box.width * ORB.x;
    var cy = box.top + box.height * ORB.y;
    if (mouse && Math.hypot(mouse.x - cx, mouse.y - cy) <= range(box)) {
      // Following: only the mouse's left/right position counts.
      s.following = true;
      var t = Math.max(-1, Math.min(1, (mouse.x - cx) / span(box)));
      return { x: ORB.x + t * SWING, y: ORB.y, speed: FOLLOW_SPEED };
    }
    if (s.following) {
      // Just left the range: pick up the drift from where the light is now.
      s.following = false;
      s.phase = Math.asin(Math.max(-1, Math.min(1, (s.x - ORB.x) / SWING)));
    }
    s.phase += dt * (2 * Math.PI / DRIFT_SECONDS);
    return { x: ORB.x + Math.sin(s.phase) * SWING, y: ORB.y, speed: DRIFT_SPEED };
  }

  // Only touch a setting when its value actually changed (saves the
  // browser from redrawing the glow when nothing moved).
  function set(photo, s, name, value) {
    if (s.last[name] === value) return;
    s.last[name] = value;
    photo.style.setProperty(name, value);
  }

  function frame(now) {
    var dt = last === null ? 1 / 60 : Math.min(0.1, (now - last) / 1000);
    last = now;
    var any = false;
    // Measure every photo first, then change them all. Measuring after a
    // change forces the browser to redo the page layout mid-frame, which
    // is what made it sluggish (Safari especially).
    var boxes = Array.prototype.map.call(photos, function (photo, i) {
      return visible[i] ? photo.getBoundingClientRect() : null;
    });
    photos.forEach(function (photo, i) {
      if (!visible[i]) return;
      any = true;
      var s = state[i];
      if (!s.last) s.last = {};
      var box = boxes[i];
      var t = target(box, s, dt);
      var k = 1 - Math.exp(-t.speed * dt);
      s.x += (t.x - s.x) * k;
      s.y += (t.y - s.y) * k;
      set(photo, s, "--hx", (s.x * 100).toFixed(2) + "%");
      set(photo, s, "--hy", (s.y * 100).toFixed(2) + "%");
      // white in the middle, turning the same pink as the highlight moves toward either side
      var side = Math.max(-1, Math.min(1, (s.x - ORB.x) / (0.75 * ORB.r)));
      set(photo, s, "--pink", Math.abs(side).toFixed(3));
      // bend the highlight to follow the orb's surface. d is how far across
      // the orb it sits (0 = middle, 1 = edge); a line drawn down a ball
      // curves more the nearer it is to the edge, with radius r / d.
      var w = box.width;
      var d = (s.x - ORB.x) / ORB.r;
      var dir = d < 0 ? -1 : 1;
      var ad = Math.max(0.12, Math.abs(d));
      var hr = (ORB.r / ad) * w;
      var fs = Math.sqrt(Math.max(0.15, 1 - d * d));
      set(photo, s, "--hr", hr.toFixed(1) + "px");
      set(photo, s, "--hcx", (s.x * w - dir * hr).toFixed(1) + "px");
      set(photo, s, "--ht", (w * 0.06 * fs).toFixed(1) + "px");
      set(photo, s, "--fs", fs.toFixed(3));
      // shadow slides the opposite way from the highlight, staying under the orb
      var sx = ORB.x - (s.x - ORB.x) * 0.9;
      var sy = ORB.y + ORB.r * 1.02 - (s.y - ORB.y) * 0.25;
      set(photo, s, "--sx", (sx * 100).toFixed(2) + "%");
      set(photo, s, "--sy", (sy * 100).toFixed(2) + "%");
      // light focused through the glass lands in the shadow, a little closer to the orb
      var cx = ORB.x - (s.x - ORB.x) * 0.55;
      set(photo, s, "--cx", (cx * 100).toFixed(2) + "%");
      set(photo, s, "--cy", ((sy - 0.004) * 100).toFixed(2) + "%");
      // faint wash on the backdrop, on the same side as the light
      var lx = ORB.x + (s.x - ORB.x) * 3;
      set(photo, s, "--lx", (lx * 100).toFixed(2) + "%");
    });
    if (any) requestAnimationFrame(frame);
    else { running = false; last = null; }
  }
  function kick() { if (!running) { running = true; requestAnimationFrame(frame); } }

  // pause the drift while the photo is scrolled out of view
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        visible[Array.prototype.indexOf.call(photos, e.target)] = e.isIntersecting;
      });
      kick();
    });
    photos.forEach(function (photo) { io.observe(photo); });
  }

  window.addEventListener("mousemove", function (e) { mouse = { x: e.clientX, y: e.clientY }; }, { passive: true });
  document.addEventListener("mouseleave", function () { mouse = null; });
  kick();
})();



/* ==========================================================
   Case study pull quotes type themselves in
   Each .cs-quote types letter by letter (blue caret leading) the first
   time it scrolls into view, whether by scrolling or by jumping there
   from the Contents menu. The letters hold their space while hidden,
   so nothing below moves. Screen readers get the whole quote at once.
   Visitors who prefer reduced motion just see the quotes.
   ========================================================== */
(function () {
  var quotes = document.querySelectorAll(".cs-quote");
  if (!quotes.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  var lastCaret = null; // only the newest quote keeps a blinking caret

  function prepare(quote) {
    var full = document.createElement("span");
    full.className = "visually-hidden";
    full.textContent = quote.innerText;

    var wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    var chars = [];
    Array.from(quote.childNodes).forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        Array.from(node.textContent).forEach(function (ch) {
          var span = document.createElement("span");
          span.className = "type-char";
          span.textContent = ch;
          wrap.appendChild(span);
          chars.push(span);
        });
      } else {
        wrap.appendChild(node.cloneNode(true)); // e.g. a <br>
      }
    });

    quote.textContent = "";
    quote.append(full, wrap);
    return chars;
  }

  function type(chars) {
    if (lastCaret) lastCaret.classList.remove("is-caret", "is-done");
    var i = 0;
    function step() {
      if (i > 0) chars[i - 1].classList.remove("is-caret");
      if (i === chars.length) {
        var last = chars[chars.length - 1];
        last.classList.add("is-caret", "is-done");
        lastCaret = last;
        return;
      }
      chars[i].classList.add("is-shown", "is-caret");
      var ch = chars[i].textContent;
      i++;
      var delay = 40 + Math.random() * 25;
      if (ch === " ") delay += 25;
      if (/[.,?!]/.test(ch)) delay += 160;
      setTimeout(step, delay);
    }
    setTimeout(step, 300);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      type(e.target._chars);
    });
  }, { threshold: 0.6 });

  quotes.forEach(function (quote) {
    quote._chars = prepare(quote);
    io.observe(quote);
  });
})();

/* ---------------------------------------------------------
   Ceramics: list / grid view switcher
   PARKED: ceramics.html has no switcher right now, so this does nothing.
   It needs .view-toggle, .work-list (around the cards) and .work-tiles.
   The grid is built from the list cards, so a new work only needs
   adding once (as a card): each tile uses the card's first photo
   and title, and links to the card's page if it has one.
   The chosen view is remembered in this browser.
   --------------------------------------------------------- */
(function () {
  var toggle = document.querySelector(".view-toggle");
  var list = document.querySelector(".work-list");
  var tiles = document.querySelector(".work-tiles");
  if (!toggle || !list || !tiles) return;

  // [TEST] Repeats the works to fill extra rows while trying out the grid.
  // Set back to 1 to show each work once.
  var TEST_REPEAT = 3;

  for (var r = 0; r < TEST_REPEAT; r++)
  list.querySelectorAll(".work-card").forEach(function (card) {
    var photo = card.querySelector(".work-gallery img");
    var title = card.querySelector(".work-card__title");
    var link = card.querySelector("a.work-card__head");
    if (!photo) return;

    var tile = document.createElement(link ? "a" : "div");
    tile.className = "work-tile";
    if (link) tile.href = link.getAttribute("href");

    var img = photo.cloneNode();
    img.removeAttribute("class");
    img.loading = "lazy";
    tile.appendChild(img);

    var meta = document.createElement("div");
    meta.className = "work-tile__meta";
    meta.innerHTML =
      '<div class="work-card__cell"><p class="work-card__label">Title:</p>' +
      '<p class="work-card__title"></p></div>';
    meta.querySelector(".work-card__title").textContent = title ? title.textContent : "";
    tile.insertBefore(meta, img); // title strip above the photo

    tiles.appendChild(tile);
  });

  var buttons = toggle.querySelectorAll("[data-view]");

  function show(view) {
    var grid = view === "grid";
    list.hidden = grid;
    tiles.hidden = !grid;
    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-view") === view ? "true" : "false");
    });
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var view = b.getAttribute("data-view");
      show(view);
      try { localStorage.setItem("ceramics-view", view); } catch (e) {}
    });
  });

  var saved = null;
  try { saved = localStorage.getItem("ceramics-view"); } catch (e) {}
  show(saved === "grid" ? "grid" : "list");
})();

/* ---------------------------------------------------------
   Compact right column: no unwanted line breaks
   The timeline rows and the card headers (title, label, years) should
   each sit on one line. Whenever any of them would wrap at the current
   window size (and always on phones), the whole group switches to its
   compact layout (.is-compact in styles.css): the timeline shows just the
   role and years, and the cards drop the Timeline/Year cell so the title
   gets the full width. Re-checked when fonts load and the window resizes.
   --------------------------------------------------------- */
(function () {
  var phone = window.matchMedia("(max-width: 800px)");

  // How many lines an element's text takes up (text only, so icons and the
  // hover oval drawing don't count)
  function lineCount(el) {
    var rects = [];
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var range = document.createRange();
    while (walker.nextNode()) {
      var node = walker.currentNode;
      if (!node.textContent.trim() || !node.parentElement || node.parentElement.offsetParent === null) continue;
      range.selectNodeContents(node);
      Array.from(range.getClientRects()).forEach(function (r) { if (r.width > 0) rects.push(r); });
    }
    var size = parseFloat(getComputedStyle(el).fontSize) || 16;
    var tops = rects.map(function (r) { return r.top; }).sort(function (a, b) { return a - b; });
    var lines = tops.length ? 1 : 0;
    for (var i = 1; i < tops.length; i++) {
      if (tops[i] - tops[i - 1] > size * 0.6) lines++;
    }
    return lines;
  }

  // Each group: the elements that switch together, and the lines to test
  var groups = [
    { toggle: ".timeline", test: ".timeline dt, .timeline dd" },
    // (Ceramics cards, .work-card--mosaic, are left out: their year lives
    // only in the header, so it must never be hidden)
    { toggle: ".card:not(.work-card--mosaic) .work-card__head", test: ".card:not(.work-card--mosaic) .work-card__head :is(.work-card__label, .work-card__title, .work-card__value)" }
  ].map(function (g) {
    return { toggle: Array.from(document.querySelectorAll(g.toggle)), test: g.test };
  }).filter(function (g) { return g.toggle.length; });
  if (!groups.length) return;

  function fit() {
    groups.forEach(function (g) {
      g.toggle.forEach(function (el) { el.classList.remove("is-compact"); });
      var wraps = phone.matches || Array.from(document.querySelectorAll(g.test)).some(function (el) {
        return el.offsetParent !== null && lineCount(el) > 1;
      });
      if (wraps) g.toggle.forEach(function (el) { el.classList.add("is-compact"); });
    });
  }

  var queued = false;
  function queueFit() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; fit(); });
  }

  fit();
  if (document.fonts) document.fonts.ready.then(fit);
  window.addEventListener("resize", queueFit);
})();


/* ==========================================================
   Homepage card Objective box: measure its full height so the
   slide-down can animate to it (with a soft bounce in styles.css).
   ========================================================== */
(function () {
  var boxes = document.querySelectorAll(".card__objective");
  if (!boxes.length) return;
  function measure() {
    boxes.forEach(function (box) {
      var t = box.style.transition;
      box.style.transition = "none";
      box.style.height = "auto";
      box.style.setProperty("--open-h", box.offsetHeight + "px");
      box.style.height = "";
      box.offsetHeight; // apply before restoring the animation
      box.style.transition = t;
    });
  }
  measure();
  window.addEventListener("resize", measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
})();


/* ---------------------------------------------------------
   Works grid size (ceramics home)
   The 2x / 3x / 4x buttons set the number of grid columns, with a quick,
   quiet crossfade: the grid (photos and lines together) fades out to the
   white of the box, changes while hidden, then fades back in a little more
   slowly. Visitors who prefer reduced motion get the switch instantly.
   --------------------------------------------------------- */
(function () {
  var browser = document.querySelector(".work-browser");
  if (!browser) return;
  var grid = browser.querySelector(".work-squares");
  var buttons = browser.querySelectorAll(".work-browser__cols button");
  if (!grid) return; // the 2x / 3x / 4x buttons are optional (the orchids page leaves them out)
  var archivePreviews = document.querySelectorAll("[data-archive-preview-grid]");

  // Keep the object count in step with the grid.
  var items = Array.prototype.slice.call(grid.querySelectorAll(".work-squares__item"));
  var objects = browser.querySelector(".work-browser__objects");
  if (objects) objects.textContent = ("00" + items.length).slice(-3);

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var FADE_OUT = 120, FADE_IN = 240;
  var running = null, pending;

  // Fades the grid out, makes the change while it's hidden, fades it back in
  function swap(change) {
    if (reduceMotion.matches || !grid.animate) {
      change();
      return;
    }
    clearTimeout(pending);
    if (running) running.cancel();
    running = grid.animate([{ opacity: 1 }, { opacity: 0 }], { duration: FADE_OUT, easing: "ease-out", fill: "forwards" });
    pending = setTimeout(function () {
      change();
      if (running) running.cancel();
      running = grid.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FADE_IN, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
    }, FADE_OUT);
  }

  function updateCols(n) {
    grid.setAttribute("data-cols", n);
    archivePreviews.forEach(function (preview) { preview.setAttribute("data-cols", n); });
  }

  var orderButtons = browser.querySelectorAll(".work-browser__order button[data-order]");

  // Phones start on 2x (desktop keeps the page's own default). Set straight
  // away, before the page is seen, so there's no crossfade on load.
  var phoneGrid = window.matchMedia("(max-width: 800px)");
  if (buttons.length && phoneGrid.matches) {
    updateCols("2");
    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-cols") === "2" ? "true" : "false");
    });
  }

  var currentCols = grid.getAttribute("data-cols");
  var currentOrder = "curated";

  // Score each shared horizontal or vertical edge once. Color groups
  // describe the ceramic itself, so the backdrop doesn't skew the shuffle.
  function colorConflicts(sequence, cols) {
    var colors = sequence.map(function (item) { return item.dataset.color; });
    var conflicts = 0;
    colors.forEach(function (color, i) {
      if (!color) return;
      if (i % cols !== 0 && color === colors[i - 1]) conflicts++;
      if (i >= cols && color === colors[i - cols]) conflicts++;
    });
    return conflicts;
  }

  function randomOrder(cols) {
    var best = items;
    var bestScore = Infinity;
    // Try several shuffled grids and keep the one with the fewest
    // same-color neighbors. Even a mostly green collection can be shuffled.
    for (var attempt = 0; attempt < 300 && bestScore > 0; attempt++) {
      var candidate = items.slice();
      for (var i = candidate.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var item = candidate[i];
        candidate[i] = candidate[j];
        candidate[j] = item;
      }
      if (candidate.every(function (item, index) { return item === grid.children[index]; })) continue;
      var score = colorConflicts(candidate, cols);
      if (score < bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    return best;
  }

  function updateGrid() {
    swap(function () {
      updateCols(currentCols);
      if (!orderButtons.length) return;
      grid.setAttribute("data-order", currentOrder);
      var cols = Number(currentCols) || 2;
      var sequence = currentOrder === "random" ? randomOrder(cols) : items;
      sequence.forEach(function (item) { grid.appendChild(item); });
    });
  }

  var sortNote = browser.querySelector(".work-browser__sort-text");

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cols = btn.getAttribute("data-cols");
      if (cols === currentCols) return;
      currentCols = cols;
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
      updateGrid();
    });
  });

  orderButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-order");
      if (key === currentOrder && key !== "random") return;
      currentOrder = key;
      orderButtons.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
      if (sortNote) sortNote.textContent = btn.getAttribute("data-label");
      updateGrid();
    });
  });

  // Show (orchids page): Species / Hybrids / All. Hides the photos of the
  // other kind (each photo's data-kind), with the same quick crossfade.
  // All is the default.
  var filterButtons = browser.querySelectorAll(".work-browser__order button[data-filter]");
  var currentFilter = "all";
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-filter");
      filterButtons.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
      if (key === currentFilter) return;
      currentFilter = key;
      swap(function () {
        items.forEach(function (item) {
          item.hidden = key !== "all" && item.getAttribute("data-kind") !== key;
        });
      });
    });
  });
})();

// Browser mockup auto-scroll (case studies). The screen inside [data-autoscroll]
// scrolls down in short, eased steps with reading pauses, rests at the bottom,
// then glides back to the top. Hover, touch, wheel, or keyboard focus hands
// control to the visitor; it picks up again a moment after they leave.
// Off for prefers-reduced-motion (the screen can still be scrolled by hand).
(function () {
  var mocks = document.querySelectorAll("[data-autoscroll]");
  if (!mocks.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var STEP = 0.4;        // share of the visible screen moved per step
  var STEP_MS = 1100;    // how long each step takes
  var PAUSE_MS = 1800;   // reading pause between steps
  var END_PAUSE_MS = 2600;
  var RESUME_MS = 1200;  // wait after the visitor leaves before resuming

  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  mocks.forEach(function (mock) {
    var view = mock.querySelector(".cs-browser__viewport");
    if (!view) return;
    var held = false, visible = false, timer = null, anim = null;

    function stop() {
      clearTimeout(timer); timer = null;
      if (anim) { cancelAnimationFrame(anim); anim = null; }
    }

    function glide(to, ms, done) {
      var from = view.scrollTop, start = null;
      function frame(now) {
        if (start === null) start = now;
        var t = Math.min(1, (now - start) / ms);
        view.scrollTop = from + (to - from) * ease(t);
        if (t < 1) anim = requestAnimationFrame(frame);
        else { anim = null; done(); }
      }
      anim = requestAnimationFrame(frame);
    }

    function next() {
      if (held || !visible || document.hidden) return;
      var max = view.scrollHeight - view.clientHeight;
      if (max <= 1) return;
      if (view.scrollTop >= max - 1) {
        glide(0, STEP_MS * 1.6, function () { timer = setTimeout(next, PAUSE_MS); });
      } else {
        var to = Math.min(max, view.scrollTop + view.clientHeight * STEP);
        glide(to, STEP_MS, function () {
          timer = setTimeout(next, to >= max - 1 ? END_PAUSE_MS : PAUSE_MS);
        });
      }
    }

    function schedule(ms) { stop(); if (!held && visible) timer = setTimeout(next, ms); }
    function hold() { held = true; stop(); }
    function release() { held = false; schedule(RESUME_MS); }

    mock.addEventListener("mouseenter", hold);
    mock.addEventListener("mouseleave", function () {
      if (!mock.contains(document.activeElement)) release();
    });
    view.addEventListener("focus", hold);
    view.addEventListener("blur", function () { if (!mock.matches(":hover")) release(); });
    view.addEventListener("touchstart", hold, { passive: true });
    view.addEventListener("touchend", function () { held = false; schedule(RESUME_MS * 3); }, { passive: true });
    view.addEventListener("wheel", function () { if (!held) { stop(); schedule(RESUME_MS * 2); } }, { passive: true });

    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) schedule(PAUSE_MS); else stop();
    }, { threshold: 0.5 }).observe(mock);

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else schedule(PAUSE_MS);
    });
  });
})();
