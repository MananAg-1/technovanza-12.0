/* =====================================================================
   cursor.js — premium dual-ring cursor
   No canvas, no WebGL. Pure CSS transforms (GPU composite layer).
   Two elements:
     .cur-dot   — 6 px solid dot, snaps instantly to pointer
     .cur-ring  — 40 px ring, lags behind with spring lerp
   On link hover  → ring expands + fills, dot hides
   On click       → ring punches in then bounces out
   ===================================================================== */

(function () {

  /* ── elements ──────────────────────────────────────────────────── */
  var dot  = document.createElement("div");
  var ring = document.createElement("div");
  dot.className  = "cur-dot";
  ring.className = "cur-ring";
  dot.setAttribute("aria-hidden",  "true");
  ring.setAttribute("aria-hidden", "true");
  document.body.append(dot, ring);

  /* ── state ─────────────────────────────────────────────────────── */
  var mx = -200, my = -200;   /* mouse (screen px)  */
  var rx = -200, ry = -200;   /* ring position      */
  var visible   = false;
  var hovering  = false;
  var clicking  = false;
  var rafId     = null;

  /* ── spring constants ──────────────────────────────────────────── */
  var EASE = 0.13;            /* ring follow speed (lower = more lag) */

  /* ── helpers ───────────────────────────────────────────────────── */
  function move(el, x, y) {
    el.style.transform = "translate3d(" + x + "px," + y + "px,0)";
  }

  function setHover(target) {
    if (!(target instanceof Element)) return;
    var isLink = target.closest("a,button,[role='button']");
    var isText = target.closest("input,textarea,[contenteditable='true']");
    hovering = !!(isLink || isText);
    ring.classList.toggle("cur-ring--hover", !!isLink);
    ring.classList.toggle("cur-ring--text",  !!isText);
    dot.classList.toggle("cur-dot--hidden",  !!isLink || !!isText);
  }

  /* ── RAF loop ──────────────────────────────────────────────────── */
  function tick() {
    /* spring lerp for the ring */
    rx += (mx - rx) * EASE;
    ry += (my - ry) * EASE;

    move(dot,  mx, my);
    move(ring, rx, ry);

    rafId = requestAnimationFrame(tick);
  }

  /* ── events ────────────────────────────────────────────────────── */
  document.addEventListener("pointermove", function (e) {
    mx = e.clientX;
    my = e.clientY;
    if (!visible) {
      /* on first move snap ring too so it doesn't slide in from corner */
      rx = mx; ry = my;
      dot.classList.add("cur-dot--visible");
      ring.classList.add("cur-ring--visible");
      visible = true;
    }
  });

  document.addEventListener("mouseover", function (e) { setHover(e.target); });

  document.addEventListener("mousedown", function () {
    ring.classList.add("cur-ring--click");
  });

  document.addEventListener("mouseup", function () {
    ring.classList.remove("cur-ring--click");
  });

  /* start loop */
  rafId = requestAnimationFrame(tick);

})();
