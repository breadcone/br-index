// Shared scripts for every page. Interactions get added here one at a time.

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
  var RESUME = { text: "Résumé", href: "https://freight.cargo.site/m/N3042622597460362339586141958857/Resume.pdf", external: true };
  var EMAIL = { text: "Email", href: "mailto:brian.le.de@gmail.com" };
  var LINKEDIN = { text: "LinkedIn", href: "https://www.linkedin.com/in/lebrians/", external: true };
  // [TODO] "About" has no page yet; point href at it once it exists.
  var ABOUT = { text: "About", href: "#", todo: true };
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
        { label: "Works", items: [
          { text: "Persimmons", href: "ceramics/persimmons.html" },
          { text: "Ritual Vessel no. 1", href: "ceramics/ritual-1.html" },
          // [TODO] Ritual Vessel no. 2 has a card on ceramics.html but no page yet
          { text: "Ritual Vessel no. 2", href: "#", todo: true }
        ] },
        // [TODO] "Artist Statement" has no page yet
        { label: "Info", items: [{ text: "Artist Statement", href: "#", todo: true }] },
        // [TODO] Instagram link (also "#" on ceramics.html)
        { label: "Contact", items: [EMAIL, { text: "Instagram", href: "#", todo: true }] }
      ]
    },
    "br-index/orchids": {
      title: "/orchids",
      home: "orchids.html",
      groups: [
        // [TODO] PLACEHOLDER orchids, not Brian's real collection. Replace with
        // real plants as { text: "Name", href: "orchids/name.html" }.
        // Species and Hybrids show their labels even if emptied.
        { label: "Species", keep: true, items: [
          { text: "Phalaenopsis amabilis", href: "#", todo: true },
          { text: "Dendrobium kingianum", href: "#", todo: true },
          { text: "Masdevallia veitchiana", href: "#", todo: true }
        ] },
        { label: "Hybrids", keep: true, items: [
          { text: "Paphiopedilum Maudiae", href: "#", todo: true },
          { text: "Oncidium Sharry Baby", href: "#", todo: true },
          { text: "Brassia Rex", href: "#", todo: true }
        ] },
        // [TODO] Instagram link
        { label: "Contact", items: [EMAIL, { text: "Instagram", href: "#", todo: true }] }
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

  var here = location.href.split("#")[0].split("?")[0];
  // Each entry is a full-width cell: title in sans with an optional serif
  // line under it (the years).
  function cell(item) {
    var href = item.todo ? "#" : url(item.href);
    var current = !item.todo && href === here;
    var ext = item.external ? ' target="_blank" rel="noopener"' : "";
    var cur = current ? ' aria-current="page"' : "";
    var todo = item.todo ? ' data-todo="no page yet"' : "";
    // Years are hidden for now (kept in INDEX); set SHOW_YEARS to true to bring them back
    var SHOW_YEARS = false;
    var meta = SHOW_YEARS && item.meta ? '<span class="index-cell__meta">' + item.meta + "</span>" : "";
    return '<li><a class="index-cell" href="' + href + '"' + ext + cur + todo + ">" +
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
      menu.groups.map(function (g) { return group(g.label, g.items, true, g.keep); }).join("")
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

    // The current portfolio is also listed, but only on touch screens (the
    // CSS hides it elsewhere): there, tapping the label opens the dropdown
    // instead of going home, so this row is the way home.
    if (SECTIONS.some(function (s) { return s.text === current; })) {
      var here = SECTIONS.filter(function (s) { return s.text === current; })[0];
      var hereItem = document.createElement("li");
      hereItem.className = "site-switch__current";
      hereItem.innerHTML = '<a data-oval href="' + url(here.href) + '" aria-current="page">br-index/<span class="site-section">' + here.text.replace("br-index/", "") + "</span></a>";
      list.insertBefore(hereItem, list.firstChild);
    }

    // Touch screens have no hover, so a tap on the label opens and closes
    // the dropdown. Tapping anywhere outside closes it.
    var touch = window.matchMedia("(hover: none)");
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

  // Phones only (shown by the CSS): the panel fills the screen, so a square
  // X box in its top-right corner, beside "/design", closes it.
  var panelClose = document.createElement("button");
  panelClose.type = "button";
  panelClose.className = "index-close";
  panelClose.setAttribute("aria-label", "Close index");
  panelClose.innerHTML = '<img class="icon" src="' + url("images/icons/close.svg") + '" alt="">';
  overlay.querySelector(".index-sec--intro").appendChild(panelClose);
  panelClose.addEventListener("click", function () {
    setOpen(false);
    trigger.focus();
  });

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
    clearTimeout(closeTimer);
    if (open && !isOpen()) setTimeout(typeTitle, 120); // starts as the panel slides in
    document.documentElement.classList.toggle("index-open", open);
    trigger.setAttribute("aria-expanded", open ? "true" : "false");
  }
  function isOpen() { return document.documentElement.classList.contains("index-open"); }

  trigger.addEventListener("click", function (e) {
    e.preventDefault();
    // A mouse has already opened it by hovering, so a click only keeps it open.
    // Taps and the keyboard toggle it, since they have no hover-off to close it.
    if (e.pointerType === "mouse") setOpen(true);
    else setOpen(!isOpen());
  });

  // Mouse hover: open on "Index", stay open while the pointer is over the
  // panel, close a moment after it leaves both (so small slips don't close it).
  var closeTimer;
  function hoverIn(e) {
    if (e.pointerType !== "mouse") return;
    clearTimeout(closeTimer);
    if (!isOpen()) setOpen(true);
  }
  function hoverOut(e) {
    if (e.pointerType !== "mouse") return;
    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () {
      if (!overlay.matches(":hover") && !trigger.matches(":hover")) setOpen(false);
    }, 250);
  }
  trigger.addEventListener("pointerenter", hoverIn);
  trigger.addEventListener("pointerleave", hoverOut);
  overlay.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") clearTimeout(closeTimer); });
  overlay.addEventListener("pointerleave", hoverOut);
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

  function buildPath(width, height, closed) {
    var pts = (closed ? CLOSED : SHAPE).map(function (p) {
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
    svg.firstChild.setAttribute("d", buildPath(box.width, box.height, closed));
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
    el.appendChild(svg);

    fit(svg);
    if (observer) observer.observe(svg);
  }

  document.querySelectorAll("[data-oval]").forEach(addOval);
  window.addOval = addOval; // used by the intro to circle its key phrase
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
      el.style.whiteSpace = "pre-line"; // keeps the &#10; line break
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
    function step() {
      if (thisRun !== run) return; // a newer line took over
      if (i > 0) chars[i - 1].classList.remove("is-caret");

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
  reserveHeight();
  if ("ResizeObserver" in window) new ResizeObserver(reserveHeight).observe(heading.parentNode);

  // Hover swap is switched off for now (too busy). Set to true to bring it back.
  var HOVER_SWAP = false;
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
  var photos = document.querySelectorAll(".work-card img:not(.icon), .work-grid img");
  if (!photos.length) return;

  var pop = document.createElement("div");
  // Same popup on every page and screen size (.lightbox--full in
  // css/styles.css): no white mat, just the 1px black line, glass behind,
  // as large as fits below the header.
  pop.className = "lightbox lightbox--full";
  pop.setAttribute("role", "dialog");
  pop.setAttribute("aria-modal", "true");
  pop.setAttribute("aria-label", "Enlarged photo");
  pop.innerHTML =
    '<div class="lightbox__frame">' +
      '<div class="box lightbox__box"><img class="lightbox__img" alt=""></div>' +
      '<button class="visually-hidden lightbox__close" type="button">Close photo</button>' +
    "</div>";
  document.body.appendChild(pop);
  var big = pop.querySelector(".lightbox__img");
  var closeBtn = pop.querySelector(".lightbox__close");
  var lastPhoto = null;

  // Every popup has the shape of the first Persimmons photo; other photos
  // are cropped to fill it (object-fit: cover in css/styles.css).
  var RATIO = 1800 / 1270;

  // Size the popup: as large as fits inside its padding (the page gutter).
  function sizeFor() {
    var ratio = RATIO;
    var popStyle = getComputedStyle(pop);
    var padX = (parseFloat(popStyle.paddingLeft) || 0) + (parseFloat(popStyle.paddingRight) || 0);
    var padY = (parseFloat(popStyle.paddingTop) || 0) + (parseFloat(popStyle.paddingBottom) || 0);
    // leave room for the box's 1px line on each side
    var line = 2;
    var maxW = pop.clientWidth - padX - line;
    var maxH = pop.clientHeight - padY - line;
    var width = Math.round(Math.min(maxW, maxH * ratio));
    big.style.width = width + "px";
    big.style.height = Math.round(width / ratio) + "px";
  }

  function open(photo) {
    lastPhoto = photo;
    sizeFor();
    // Show the page's photo at once, then swap in the high-detail file
    // (data-full) when it has loaded, so people can look closely. The page
    // itself keeps the lighter file.
    big.src = photo.currentSrc || photo.src;
    var fullSrc = photo.getAttribute("data-full");
    if (fullSrc) {
      var hi = new Image();
      hi.onload = function () { if (lastPhoto === photo) big.src = hi.src; };
      hi.src = fullSrc;
    }
    big.alt = photo.alt;
    document.documentElement.classList.add("lightbox-open");
    closeBtn.focus({ preventScroll: true });
  }
  function close() {
    document.documentElement.classList.remove("lightbox-open");
    if (lastPhoto) lastPhoto.focus({ preventScroll: true });
  }

  photos.forEach(function (photo) {
    photo.setAttribute("tabindex", "0");
    photo.setAttribute("role", "button");
    photo.setAttribute("aria-label", "Enlarge photo: " + photo.alt);
    photo.addEventListener("click", function () { open(photo); });
    photo.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(photo); }
    });
  });

  closeBtn.addEventListener("click", close);
  pop.addEventListener("click", close); // anywhere, photo included
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.documentElement.classList.contains("lightbox-open")) close();
  });
})();

/* ---------------------------------------------------------
   Orb photo highlight
   By default the highlight on the glass orb photo drifts slowly left and
   right on its own. When the mouse comes within a short distance of the
   photo, it follows the mouse's left/right position instead, then eases
   back into the slow drift when the mouse moves away. It moves straight
   across the glass at a fixed height. The drift only runs while the photo
   is on screen. Off for reduced motion.
   --------------------------------------------------------- */
(function () {
  var photos = document.querySelectorAll(".orb-photo");
  if (!photos.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ORB = { x: 0.52, y: 0.51, r: 0.205 };   // matches --orb-x/y/r in the CSS
  var SWING = 0.75 * ORB.r;                   // how far the highlight travels either side of center
  var DRIFT_SECONDS = 12;                     // one full left-right-left drift
  var mouse = null;
  var state = Array.from(photos).map(function () {
    return { x: ORB.x + SWING * 0.5, y: ORB.y, phase: Math.PI / 6, following: false };
  });
  var visible = Array.from(photos).map(function () { return true; });
  var running = false;
  var last = null;

  // How close the mouse must be to start following: a circle around the
  // photo's center, a bit bigger than the photo itself (at least 160px).
  function range(box) { return Math.max(160, box.width * 1.25); }

  function target(photo, s, dt) {
    var box = photo.getBoundingClientRect();
    var cx = box.left + box.width * ORB.x;
    var cy = box.top + box.height * ORB.y;
    var r = range(box);
    if (mouse && Math.hypot(mouse.x - cx, mouse.y - cy) <= r) {
      // Following: only the mouse's left/right position counts.
      s.following = true;
      var t = Math.max(-1, Math.min(1, (mouse.x - cx) / (r * 0.75)));
      return { x: ORB.x + t * SWING, y: ORB.y, ease: 0.05 }; // lower = slower, smoother catch-up
    }
    if (s.following) {
      // Just left the range: pick up the drift from where the light is now.
      s.following = false;
      s.phase = Math.asin(Math.max(-1, Math.min(1, (s.x - ORB.x) / SWING)));
    }
    s.phase += dt * (2 * Math.PI / DRIFT_SECONDS);
    return { x: ORB.x + Math.sin(s.phase) * SWING, y: ORB.y, ease: 0.06 };
  }

  function frame(now) {
    var dt = last === null ? 0 : Math.min(0.1, (now - last) / 1000);
    last = now;
    var any = false;
    photos.forEach(function (photo, i) {
      if (!visible[i]) return;
      any = true;
      var s = state[i];
      var t = target(photo, s, dt);
      s.x += (t.x - s.x) * t.ease;
      s.y += (t.y - s.y) * t.ease;
      photo.style.setProperty("--hx", (s.x * 100).toFixed(2) + "%");
      photo.style.setProperty("--hy", (s.y * 100).toFixed(2) + "%");
      // white in the middle, turning the same pink as the highlight moves toward either side
      var side = Math.max(-1, Math.min(1, (s.x - ORB.x) / (0.75 * ORB.r)));
      photo.style.setProperty("--pink", Math.abs(side).toFixed(3));
      // bend the highlight to follow the orb's surface. d is how far across
      // the orb it sits (0 = middle, 1 = edge); a line drawn down a ball
      // curves more the nearer it is to the edge, with radius r / d.
      var w = photo.getBoundingClientRect().width;
      var d = (s.x - ORB.x) / ORB.r;
      var dir = d < 0 ? -1 : 1;
      var ad = Math.max(0.12, Math.abs(d));
      var hr = (ORB.r / ad) * w;
      var fs = Math.sqrt(Math.max(0.15, 1 - d * d));
      photo.style.setProperty("--hr", hr.toFixed(1) + "px");
      photo.style.setProperty("--hcx", (s.x * w - dir * hr).toFixed(1) + "px");
      photo.style.setProperty("--ht", (w * 0.06 * fs).toFixed(1) + "px");
      photo.style.setProperty("--fs", fs.toFixed(3));
      // shadow slides the opposite way from the highlight, staying under the orb
      var sx = ORB.x - (s.x - ORB.x) * 0.9;
      var sy = ORB.y + ORB.r * 1.02 - (s.y - ORB.y) * 0.25;
      photo.style.setProperty("--sx", (sx * 100).toFixed(2) + "%");
      photo.style.setProperty("--sy", (sy * 100).toFixed(2) + "%");
      // light focused through the glass lands in the shadow, a little closer to the orb
      var cx = ORB.x - (s.x - ORB.x) * 0.55;
      photo.style.setProperty("--cx", (cx * 100).toFixed(2) + "%");
      photo.style.setProperty("--cy", ((sy - 0.004) * 100).toFixed(2) + "%");
      // faint wash on the backdrop, on the same side as the light
      var lx = ORB.x + (s.x - ORB.x) * 3;
      photo.style.setProperty("--lx", (lx * 100).toFixed(2) + "%");
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
    { toggle: ".card .work-card__head", test: ".card .work-card__head .work-card__label, .card .work-card__head .work-card__title, .card .work-card__head .work-card__value" }
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

