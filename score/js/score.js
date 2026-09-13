window.App = window.App || {};

App.score = {
  nudges: [],
  svg: null,
  host: null,
  dirty: false,

  wrapFly(el) {
    const g = document.createElementNS(App.NS, "g");
    g.classList.add("fly");
    const nudge = document.createElementNS(App.NS, "g");
    nudge.classList.add("nudge");
    el.parentNode.insertBefore(g, el);
    g.appendChild(nudge);
    nudge.appendChild(el);
    return { fly: g, nudge };
  },

  wrapNudge(el) {
    const nudge = document.createElementNS(App.NS, "g");
    nudge.classList.add("nudge");
    el.parentNode.insertBefore(nudge, el);
    nudge.appendChild(el);
    return nudge;
  },

  strokeLength(el) {
    try {
      return el.getTotalLength();
    } catch (err) {
      return 0;
    }
  },

  makeMotion() {
    const dir = Math.random() < 0.5 ? -1 : 1;
    return {
      x: dir * (280 + Math.random() * 460),
      y: 16 + Math.random() * 32,
      scale: 1.24 + Math.random() * 0.36,
    };
  },

  prepare() {
    const markup = window.SCORE_SVG;
    if (!markup) {
      console.error("Score SVG data missing.");
      return null;
    }

    const score = document.getElementById("score");
    score.innerHTML = markup;
    const svg = score.querySelector("svg");
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    const frameLines = [];
    const frameFills = [];
    const flyItems = [];

    [...svg.children].forEach((el) => {
      if (el.tagName === "title" || el.tagName === "desc") return;
      const cls = el.getAttribute("class") || "";
      if (App.FRAME.has(cls)) {
        if (cls === "StaffLines" || cls === "BarLine") frameLines.push(el);
        else frameFills.push(el);
      } else {
        flyItems.push(el);
      }
    });

    const lineLens = frameLines.map((el) => {
      const len = this.strokeLength(el);
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
      return len;
    });

    const measured = flyItems.map((el) => {
      const b = el.getBBox();
      return { el, x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width };
    });
    measured.sort((a, b) => a.x - b.x || a.y - b.y);

    const clustered = [];
    measured.forEach((item) => {
      const last = clustered[clustered.length - 1];
      const isolated = item.w > 96;
      if (!isolated && last && Math.abs(item.x - last.x) < 34) {
        last.items.push(item);
        last.x = last.items.reduce((s, n) => s + n.x, 0) / last.items.length;
      } else {
        clustered.push({ x: item.x, motion: this.makeMotion(), items: [item] });
      }
    });

    const flies = [];
    this.nudges = [];
    clustered.forEach((cluster) => {
      cluster.items.sort((a, b) => a.y - b.y);
      cluster.items.forEach((item) => {
        const wrapped = this.wrapFly(item.el);
        flies.push({
          el: wrapped.fly,
          x: item.x,
          y: item.y,
          fromX: cluster.motion.x,
          fromY: cluster.motion.y,
          fromScale: cluster.motion.scale,
        });
        this.nudges.push({ el: wrapped.nudge, x: item.x, y: item.y, on: false });
      });
    });
    flies.sort((a, b) => a.x - b.x || a.y - b.y);

    [...frameLines, ...frameFills].forEach((el) => {
      let b;
      try {
        b = el.getBBox();
      } catch (err) {
        return;
      }
      const nudge = this.wrapNudge(el);
      this.nudges.push({
        el: nudge,
        x: b.x + b.width / 2,
        y: b.y + b.height / 2,
        on: false,
      });
    });

    gsap.set(frameFills, { autoAlpha: 0 });
    flies.forEach((item) => {
      gsap.set(item.el, {
        x: item.fromX,
        y: item.fromY,
        scale: item.fromScale,
        autoAlpha: 0,
        transformOrigin: "50% 50%",
        force3D: false,
      });
    });
    gsap.set(score, { autoAlpha: 1 });

    this.svg = svg;
    this.host = document.getElementById("about-score");
    gsap.ticker.add(() => this.nudge());

    return { svg, score, frameLines, frameFills, flies, lineLens };
  },

  nudge() {
    if (!this.svg || !this.host || !this.nudges.length) return;
    try {
      const op = Number(gsap.getProperty(this.host, "opacity"));
      if (!(op > 0.12)) {
        if (this.dirty) {
          this.nudges.forEach((item) => item.el.setAttribute("transform", "translate(0 0)"));
          this.dirty = false;
        }
        return;
      }

      const ctm = this.svg.getScreenCTM();
      if (!ctm) return;
      const inv = ctm.inverse();
      const box = this.svg.getBoundingClientRect();
      const radius = Math.min(box.width, box.height) * 0.34;
      const push = 16;
      const mx = App.mouse.x;
      const my = App.mouse.y;
      let any = false;

      for (let i = 0; i < this.nudges.length; i++) {
        const item = this.nudges[i];
        const sx = ctm.a * item.x + ctm.c * item.y + ctm.e;
        const sy = ctm.b * item.x + ctm.d * item.y + ctm.f;
        const dx = sx - mx;
        const dy = sy - my;
        const dist = Math.hypot(dx, dy);
        const influence = Math.max(0, 1 - dist / radius);
        if (influence <= 0) {
          if (item.on) {
            item.el.setAttribute("transform", "translate(0 0)");
            item.on = false;
          }
          continue;
        }
        const eased = influence * influence * (3 - 2 * influence);
        const angle = Math.atan2(dy, dx) || 0;
        const px = Math.cos(angle) * eased * push;
        const py = Math.sin(angle) * eased * push;
        const ux = inv.a * px + inv.c * py;
        const uy = inv.b * px + inv.d * py;
        item.el.setAttribute("transform", "translate(" + ux + " " + uy + ")");
        item.on = true;
        any = true;
      }
      this.dirty = any;
    } catch (err) {}
  },
};
