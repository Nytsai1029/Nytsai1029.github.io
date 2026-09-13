window.App = window.App || {};

App.theme = {
  storageKey: "score-theme",
  dark: false,
  busy: false,

  init() {
    this.root = document.documentElement;
    this.btn = document.getElementById("theme");
    this.veil = document.getElementById("theme-veil");
    if (!this.btn) return;

    this.svg = this.btn.querySelector(".theme-mark");
    this.core = this.btn.querySelector(".theme-core");
    this.cut = this.btn.querySelector(".theme-cut");
    this.rays = this.btn.querySelector(".theme-rays");
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let saved = "light";
    try { saved = localStorage.getItem(this.storageKey) || "light"; } catch (err) {}
    this.dark = saved === "dark" || this.root.classList.contains("theme-dark");
    this.commit(this.dark);
    this.setIcon(this.dark, true);

    this.btn.addEventListener("click", (event) => {
      event.stopPropagation();
      this.toggle();
    });
  },

  origin() {
    const svg = this.svg;
    const ctm = svg && svg.getScreenCTM && svg.getScreenCTM();
    if (ctm && svg.createSVGPoint) {
      const pt = svg.createSVGPoint();
      pt.x = 12;
      pt.y = 12;
      const p = pt.matrixTransform(ctm);
      return { x: p.x, y: p.y };
    }
    const box = (this.core || svg || this.btn).getBoundingClientRect();
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  },

  cover(x, y, box) {
    const left = x - box.left;
    const top = y - box.top;
    const r = Math.hypot(
      Math.max(left, box.width - left),
      Math.max(top, box.height - top)
    );
    return {
      x: left,
      y: top,
      r: r + 80,
      xPct: (left / box.width) * 100,
      yPct: (top / box.height) * 100,
    };
  },

  spot() {
    const view = this.origin();
    const screen = this.cover(view.x, view.y, {
      left: 0,
      top: 0,
      width: innerWidth,
      height: innerHeight,
    });
    return {
      x: screen.x,
      y: screen.y,
      r: screen.r,
      xPct: screen.xPct,
      yPct: screen.yPct,
      vx: view.x,
      vy: view.y,
      vr: screen.r,
    };
  },

  syncTokens() {
    const cs = getComputedStyle(this.root);
    App.WHEEL.ink = cs.getPropertyValue("--ink").trim() || "#161616";
    App.WHEEL.dim = cs.getPropertyValue("--dim").trim() || "#7a7a7a";
    if (App.grid && App.grid.syncInk) App.grid.syncInk();
  },

  syncAria() {
    if (!this.btn || !App.i18n || !App.i18n.t) return;
    this.btn.setAttribute("aria-pressed", this.dark ? "true" : "false");
    this.btn.setAttribute("aria-label", App.i18n.t(this.dark ? "theme.toLight" : "theme.toDark"));
  },

  commit(dark) {
    this.dark = dark;
    this.root.classList.toggle("theme-dark", dark);
    try { localStorage.setItem(this.storageKey, dark ? "dark" : "light"); } catch (err) {}
    if (!this.root.classList.contains("theme-switching")) {
      this.root.style.colorScheme = dark ? "dark" : "light";
    }
    this.syncTokens();
    this.syncAria();
  },

  holdChrome() {
    const cs = getComputedStyle(this.root);
    this.root.style.setProperty("--chrome-hold-page", cs.getPropertyValue("--page").trim() || "#ffffff");
    this.root.style.setProperty("--chrome-hold-scroll", cs.getPropertyValue("--scroll").trim() || "#e2e2e2");
    this.root.style.colorScheme = this.dark ? "dark" : "light";
    this.root.classList.add("theme-switching");
  },

  releaseChrome() {
    this.root.classList.remove("theme-switching");
    this.root.style.removeProperty("--chrome-hold-page");
    this.root.style.removeProperty("--chrome-hold-scroll");
    this.root.style.colorScheme = this.dark ? "dark" : "light";
  },

  setIcon(dark, immediate) {
    const dur = immediate || this.reduce ? 0 : (App.THEME.morphDur || 0.44);
    if (this.iconTl) this.iconTl.kill();
    this.iconTl = gsap.timeline();
    gsap.set(this.rays, { svgOrigin: "12 12" });
    if (dark) {
      this.iconTl.to(this.rays, {
        scale: 0.28,
        opacity: 0,
        rotation: 28,
        duration: dur * 0.72,
        ease: "power2.in",
      }, 0);
      this.iconTl.to(this.cut, { attr: { cx: 15.4, cy: 7 }, duration: dur, ease: "power2.inOut" }, 0);
      this.iconTl.to(this.core, { attr: { r: 7.15 }, duration: dur, ease: "power2.inOut" }, 0);
    } else {
      this.iconTl.to(this.rays, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: dur,
        ease: "power2.out",
      }, 0);
      this.iconTl.to(this.cut, { attr: { cx: 36, cy: 0 }, duration: dur, ease: "power2.inOut" }, 0);
      this.iconTl.to(this.core, { attr: { r: 5 }, duration: dur * 0.86, ease: "power2.inOut" }, 0);
    }
    return this.iconTl;
  },

  after(tl) {
    if (!tl) return Promise.resolve();
    const wait = tl.totalDuration();
    if (!wait) return Promise.resolve();
    return new Promise((resolve) => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      tl.eventCallback("onComplete", done);
      gsap.delayedCall(wait + 0.05, done);
    });
  },

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  async toggle() {
    if (this.busy || !this.btn) return;
    const next = !this.dark;
    if (this.reduce) {
      this.setIcon(next, true);
      this.commit(next);
      return;
    }

    this.busy = true;
    this.holdChrome();
    await this.after(this.setIcon(next, false));
    const spot = this.spot();

    try {
      if (typeof document.startViewTransition === "function") {
        await this.reveal(next, spot);
      } else {
        await this.wipe(spot, next);
      }
    } catch (err) {
      this.commit(next);
    }
    this.releaseChrome();
    this.busy = false;
  },

  async reveal(next, spot) {
    const wipe = (App.THEME.wipeDur || 0.9) * 1000;
    const vt = document.startViewTransition(() => this.commit(next));
    await vt.ready;
    const from = `circle(0% at ${spot.xPct}% ${spot.yPct}%)`;
    const to = `circle(220% at ${spot.xPct}% ${spot.yPct}%)`;
    this.root.animate(
      { opacity: [1, 1] },
      { duration: wipe, fill: "both", pseudoElement: "::view-transition-group(root)" }
    );
    const anim = this.root.animate(
      { clipPath: [from, to] },
      {
        duration: wipe,
        easing: "cubic-bezier(0.65, 0, 0.35, 1)",
        fill: "both",
        pseudoElement: "::view-transition-new(root)",
      }
    );
    await Promise.race([
      vt.finished.catch(() => {}),
      anim.finished.catch(() => {}),
      this.sleep(wipe + 120),
    ]);
  },

  wipe(spot, next) {
    const veil = this.veil;
    if (!veil) {
      this.commit(next);
      return Promise.resolve();
    }
    const page = next ? App.THEME.page.dark : App.THEME.page.light;
    const dur = App.THEME.wipeDur || 0.9;
    gsap.killTweensOf(veil);
    gsap.set(veil, {
      display: "block",
      backgroundColor: page,
      clipPath: `circle(0px at ${spot.vx}px ${spot.vy}px)`,
    });
    return new Promise((resolve) => {
      gsap.to(veil, {
        clipPath: `circle(${spot.vr}px at ${spot.vx}px ${spot.vy}px)`,
        duration: dur,
        ease: "power3.inOut",
        onComplete: () => {
          this.commit(next);
          gsap.set(veil, { display: "none", clipPath: "none", backgroundColor: "transparent" });
          resolve();
        },
      });
    });
  },
};
