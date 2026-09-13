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

  toUser(el, lx, ly) {
    const list = el.transform && el.transform.baseVal;
    if (!list || !list.numberOfItems) return { x: lx, y: ly };
    let x = lx;
    let y = ly;
    for (let i = 0; i < list.numberOfItems; i++) {
      const m = list.getItem(i).matrix;
      const nx = m.a * x + m.c * y + m.e;
      const ny = m.b * x + m.d * y + m.f;
      x = nx;
      y = ny;
    }
    return { x, y };
  },

  measure(el) {
    let box;
    try {
      box = el.getBBox();
    } catch (err) {
      return null;
    }
    const cls = el.getAttribute("class") || "";
    let lx = box.x + box.width / 2;
    let ly = box.y + box.height / 2;
    if (cls === "Clef") {
      lx = 0;
      ly = 0;
    } else if (cls === "Bracket" || cls === "Brace") {
      lx = 0;
      ly = box.y + box.height / 2;
    }
    const pt = this.toUser(el, lx, ly);
    const right = this.toUser(el, box.x + box.width, ly);
    return {
      el,
      x: pt.x,
      y: pt.y,
      w: Math.abs(right.x - pt.x) * 2,
    };
  },

  clientToUser(clientX, clientY) {
    const svg = this.svg;
    const rect = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    const vbW = vb && vb.width ? vb.width : 1;
    const vbH = vb && vb.height ? vb.height : 1;
    const scale = Math.min(rect.width / vbW, rect.height / vbH) || 1;
    const ox = rect.left + (rect.width - vbW * scale) / 2;
    const oy = rect.top + (rect.height - vbH * scale) / 2;
    return {
      x: (clientX - ox) / scale + (vb.x || 0),
      y: (clientY - oy) / scale + (vb.y || 0),
      scale,
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

    const measured = flyItems.map((el) => this.measure(el)).filter(Boolean);
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
        this.nudges.push({ el: wrapped.nudge, x: item.x, y: item.y, px: 0, py: 0, on: false });
      });
    });
    flies.sort((a, b) => a.x - b.x || a.y - b.y);

    [...frameLines, ...frameFills].forEach((el) => {
      const item = this.measure(el);
      if (!item) return;
      const nudge = this.wrapNudge(el);
      this.nudges.push({
        el: nudge,
        x: item.x,
        y: item.y,
        px: 0,
        py: 0,
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
          this.nudges.forEach((item) => {
            item.px = 0;
            item.py = 0;
            item.el.setAttribute("transform", "translate(0 0)");
            item.on = false;
          });
          this.dirty = false;
        }
        return;
      }

      const mouse = this.clientToUser(App.mouse.tx, App.mouse.ty);
      const box = this.svg.getBoundingClientRect();
      const radius = Math.min(box.width, box.height) * 0.34 / mouse.scale;
      const push = 16 / mouse.scale;
      const mx = mouse.x;
      const my = mouse.y;
      const dt = gsap.ticker.deltaRatio(60);
      const follow = 1 - Math.pow(0.8, dt);
      const rest = 1 - Math.pow(0.965, dt);
      let any = false;

      for (let i = 0; i < this.nudges.length; i++) {
        const item = this.nudges[i];
        const dx = item.x - mx;
        const dy = item.y - my;
        const dist = Math.hypot(dx, dy);
        const influence = dist > 0 ? Math.max(0, 1 - dist / radius) : 1;
        let ux = 0;
        let uy = 0;
        if (influence > 0) {
          const eased = influence * influence * (3 - 2 * influence);
          const angle = dist > 0 ? Math.atan2(dy, dx) : 0;
          ux = Math.cos(angle) * eased * push;
          uy = Math.sin(angle) * eased * push;
        }
        const k = influence > 0 ? follow : rest;
        item.px += (ux - item.px) * k;
        item.py += (uy - item.py) * k;
        if (influence <= 0 && item.px * item.px + item.py * item.py < 0.04) {
          if (item.on) {
            item.px = 0;
            item.py = 0;
            item.el.setAttribute("transform", "translate(0 0)");
            item.on = false;
          }
          continue;
        }
        item.el.setAttribute("transform", "translate(" + item.px + " " + item.py + ")");
        item.on = true;
        any = true;
      }
      this.dirty = any;
    } catch (err) {}
  },
};
