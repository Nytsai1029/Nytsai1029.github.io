window.App = window.App || {};

App.era = {
  open: false,
  busy: false,
  closing: false,
  scrollClose: false,
  origin: 0,
  nodes: [],
  ends: [],
  soons: [],
  reduce: false,
  drag: null,

  months(date) {
    const parts = String(date).split(".");
    return Number(parts[0]) * 12 + Number(parts[1] || 1) - 1;
  },

  rem() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  },

  labelGap() {
    const copy = this.nodes[0] && this.nodes[0].querySelector(".works-era-copy");
    const width = copy ? copy.getBoundingClientRect().width : 0;
    return Math.max(width, 10.4 * this.rem()) + 8;
  },

  xs() {
    const works = App.WORKS;
    const months = works.map((work) => this.months(work.date));
    const minM = Math.min.apply(null, months);
    const maxM = Math.max.apply(null, months);
    const maxLog = Math.log1p(maxM - minM) || 1;
    const viewW = this.view ? this.view.clientWidth : window.innerWidth;
    const unique = new Set(months).size;
    const span = Math.max(viewW * 1.15, Math.max(unique - 1, 1) * 88);
    const xs = months.map((m) => (Math.log1p(m - minM) / maxLog) * span);
    const order = works.map((_, i) => i).sort((a, b) => xs[a] - xs[b] || a - b);
    const dotGap = App.ERA.dotGap;
    const labelGap = this.labelGap();
    for (let n = 1; n < order.length; n++) {
      const prev = order[n - 1];
      const cur = order[n];
      let minAllowed = xs[prev] + dotGap;
      if (n >= 2) minAllowed = Math.max(minAllowed, xs[order[n - 2]] + labelGap);
      if (xs[cur] < minAllowed) xs[cur] = minAllowed;
    }
    return { xs, order };
  },

  fillNode(node, work) {
    const title = node.querySelector(".works-era-title");
    const role = node.querySelector(".works-era-role");
    const date = node.querySelector(".works-era-date");
    title.textContent = work.title;
    title.setAttribute("lang", "ja");
    role.textContent = App.i18n.workRole(work);
    if (App.i18n.locale === "ja") role.setAttribute("lang", "ja");
    else role.removeAttribute("lang");
    date.textContent = work.date;
    node.setAttribute("aria-label", work.title + " " + work.date);
  },

  fillSoon() {
    const text = App.i18n.t("works.soon");
    this.soons.forEach((el) => { el.textContent = text; });
  },

  makeNode(i) {
    const node = document.createElement("button");
    node.type = "button";
    node.className = "works-era-node";
    node.setAttribute("data-index", String(i));
    const dot = document.createElement("span");
    dot.className = "works-era-dot";
    dot.setAttribute("aria-hidden", "true");
    const copy = document.createElement("span");
    copy.className = "works-era-copy";
    const title = document.createElement("span");
    title.className = "works-era-title";
    const role = document.createElement("span");
    role.className = "works-era-role";
    const date = document.createElement("span");
    date.className = "works-era-date";
    copy.append(title, role, date);
    node.append(dot, copy);
    node.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (this.drag && this.drag.moved) return;
      this.closeTo(i);
    });
    return node;
  },

  makeEnd() {
    const el = document.createElement("span");
    el.className = "works-era-end";
    el.setAttribute("aria-hidden", "true");
    return el;
  },

  makeSoon() {
    const el = document.createElement("span");
    el.className = "works-era-soon";
    el.setAttribute("aria-hidden", "true");
    return el;
  },

  textBox(el) {
    const range = document.createRange();
    if (el.childNodes.length) range.selectNodeContents(el);
    else range.selectNode(el);
    const box = range.getBoundingClientRect();
    if (box.width > 1 && box.height > 1) return box;
    return el.getBoundingClientRect();
  },

  localPoint(el) {
    const box = this.textBox(el);
    const host = App.works.root;
    const hr = host.getBoundingClientRect();
    const sx = host.offsetWidth ? hr.width / host.offsetWidth : 1;
    const sy = host.offsetHeight ? hr.height / host.offsetHeight : 1;
    const cs = getComputedStyle(el);
    return {
      left: (box.left - hr.left) / sx,
      top: (box.top - hr.top) / sy,
      fontSize: parseFloat(cs.fontSize),
      letterSpacing: cs.letterSpacing,
      color: cs.color,
    };
  },

  ink() {
    return getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#161616";
  },

  dim() {
    return getComputedStyle(document.documentElement).getPropertyValue("--dim").trim() || "#7a7a7a";
  },

  extras() {
    return this.ends.concat(this.soons);
  },

  killAnims() {
    if (this.tlCall) {
      this.tlCall.kill();
      this.tlCall = null;
    }
    if (this.anim) {
      this.anim.forEach((tw) => tw.kill());
      this.anim = [];
    }
    if (this.tl) {
      this.tl.kill();
      this.tl = null;
    }
    if (this.flyTween) {
      this.flyTween.kill();
      this.flyTween = null;
    }
  },

  killFlyer() {
    if (this.flyTween) {
      this.flyTween.kill();
      this.flyTween = null;
    }
    if (!this.flyer) return;
    gsap.killTweensOf(this.flyer);
    this.flyer.remove();
    this.flyer = null;
  },

  restDate(el, color) {
    gsap.set(el, {
      x: 0,
      y: 0,
      scale: 1,
      autoAlpha: 1,
      fontSize: "",
      letterSpacing: "",
      color: color || "",
      transformOrigin: "0% 0%",
    });
  },

  moveDate(el, fromEl, toColor, duration, onDone) {
    gsap.killTweensOf(el);
    this.restDate(el);
    this.view.offsetWidth;
    const home = this.textBox(el);
    const from = this.textBox(fromEl);
    const homeSize = parseFloat(getComputedStyle(el).fontSize);
    const homeSpace = getComputedStyle(el).letterSpacing;
    const fromSize = parseFloat(getComputedStyle(fromEl).fontSize);
    const fromSpace = getComputedStyle(fromEl).letterSpacing;
    const fromColor = getComputedStyle(fromEl).color;
    if (!duration) {
      this.restDate(el, toColor);
      if (onDone) onDone();
      return;
    }
    this.flyTween = gsap.fromTo(el, {
      x: from.left - home.left,
      y: from.top - home.top,
      fontSize: fromSize,
      letterSpacing: fromSpace,
      color: fromColor,
      autoAlpha: 1,
      transformOrigin: "0% 0%",
    }, {
      x: 0,
      y: 0,
      fontSize: homeSize,
      letterSpacing: homeSpace,
      color: toColor,
      duration,
      ease: "power3.inOut",
      overwrite: true,
      force3D: false,
      transformOrigin: "0% 0%",
      onComplete: () => {
        gsap.set(el, { x: 0, y: 0 });
        if (onDone) onDone();
      },
    });
    this.flyTween.play(0);
  },

  returnDate(el, toEl, toColor, duration, onDone) {
    gsap.killTweensOf(el);
    this.view.offsetWidth;
    const from = this.textBox(el);
    const to = this.textBox(toEl);
    const toSize = parseFloat(getComputedStyle(toEl).fontSize);
    const toSpace = getComputedStyle(toEl).letterSpacing;
    if (!duration) {
      if (onDone) onDone();
      return;
    }
    this.flyTween = gsap.to(el, {
      x: (to.left - from.left) + (Number(gsap.getProperty(el, "x")) || 0),
      y: (to.top - from.top) + (Number(gsap.getProperty(el, "y")) || 0),
      fontSize: toSize,
      letterSpacing: toSpace,
      color: toColor,
      duration,
      ease: "power3.inOut",
      overwrite: true,
      force3D: false,
      transformOrigin: "0% 0%",
      onComplete: () => {
        if (onDone) onDone();
      },
    });
    this.flyTween.play(0);
  },

  renderClose(t) {
    const fade = Math.min(1, t / 0.55);
    gsap.set([this.lineLeft, this.lineRight], { scaleX: 1 - t });
    gsap.set(this.nodes.concat(this.extras()), { autoAlpha: 1 - fade });
  },

  build() {
    this.track.querySelectorAll(".works-era-node, .works-era-end, .works-era-soon").forEach((el) => el.remove());
    this.nodes = App.WORKS.map((_, i) => {
      const node = this.makeNode(i);
      this.track.appendChild(node);
      return node;
    });
    this.ends = [this.makeEnd(), this.makeEnd()];
    this.soons = [this.makeSoon()];
    this.ends.forEach((el) => this.track.appendChild(el));
    this.soons.forEach((el) => this.track.appendChild(el));
    this.fillSoon();
  },

  place(origin) {
    const packed = this.xs();
    const xs = packed.xs;
    const order = packed.order;
    const minX = Math.min.apply(null, xs);
    const maxX = Math.max.apply(null, xs);
    const viewW = this.view.clientWidth;
    const side = viewW * 0.5;
    const lineStart = minX - App.ERA.endPad;
    const lineEnd = maxX + App.ERA.endPad;
    const lineW = lineEnd - lineStart;
    const originX = side + (xs[origin] - lineStart);
    const leftLen = originX - side;
    const rightLen = side + lineW - originX;

    this.metrics = { xs, order, lineStart, lineEnd, lineW, side, originX, viewW, leftLen, rightLen };
    this.track.style.width = side + lineW + side + "px";

    gsap.set(this.lineLeft, {
      left: side,
      width: Math.max(leftLen, 0.5),
      yPercent: -50,
      transformOrigin: "right center",
    });
    gsap.set(this.lineRight, {
      left: originX,
      width: Math.max(rightLen, 0.5),
      yPercent: -50,
      transformOrigin: "left center",
    });
    gsap.set(this.ends[0], { left: side - 4.5, top: "50%", yPercent: -50 });
    gsap.set(this.ends[1], { left: side + lineW - 4.5, top: "50%", yPercent: -50 });
    gsap.set(this.soons[0], {
      left: side + lineW + 14,
      top: "50%",
      xPercent: 0,
      yPercent: -50,
    });

    this.nodes.forEach((node, i) => {
      const rank = order.indexOf(i);
      const isOrigin = i === origin;
      node.classList.toggle("is-origin", isOrigin);
      node.classList.toggle("is-above", rank % 2 === 0);
      node.classList.toggle("is-below", rank % 2 === 1);
      this.fillNode(node, App.WORKS[i]);
      gsap.set(node, {
        x: side + (xs[i] - lineStart),
        left: 0,
        top: "50%",
      });
      gsap.set(node.querySelector(".works-era-dot"), { xPercent: -50, yPercent: -50 });
      gsap.set(node.querySelector(".works-era-copy"), { xPercent: -50 });
    });

    this.view.scrollLeft = originX - viewW / 2;
  },

  slotText(slot) {
    return (slot && slot.querySelector(".works-date-text")) || slot;
  },

  liveDate() {
    return this.dateSlots[App.works.slot];
  },

  hideIdleDates() {
    this.dateSlots.forEach((el, i) => {
      el.style.pointerEvents = i === App.works.slot ? "auto" : "none";
    });
  },

  setGallery(on) {
    const copy = App.works.root.querySelector(".works-copy");
    const rail = App.works.rail;
    gsap.to([copy, rail], {
      autoAlpha: on ? 1 : 0,
      duration: this.reduce ? 0 : 0.36,
      ease: on ? "power2.out" : "power2.in",
      overwrite: "auto",
    });
  },

  lockDates(on) {
    this.dateSlots.forEach((el) => {
      el.style.pointerEvents = on ? "none" : "auto";
    });
    if (!on) this.hideIdleDates();
  },

  worksOpacity() {
    const raw = gsap.getProperty(App.works.root, "opacity");
    const op = parseFloat(raw);
    return Number.isFinite(op) ? op : parseFloat(getComputedStyle(App.works.root).opacity);
  },

  pageLeaving() {
    const op = this.worksOpacity();
    if (this.scrollClose) return !(op > 0.55);
    return op <= 0.5;
  },

  pageGone() {
    return this.worksOpacity() <= 0.02;
  },

  openFrom(index) {
    if (this.open || this.busy || this.closing || !App.works.visible()) return;
    this.busy = true;
    this.ignoreClose = true;
    this.origin = index;
    App.works.eraOpen = true;
    App.works.busy = true;
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.killAnims();
    this.root.classList.add("is-open");
    this.root.style.pointerEvents = "none";
    this.root.setAttribute("aria-hidden", "false");
    this.place(index);
    gsap.set(this.nodes.concat(this.extras()), { autoAlpha: 0, opacity: 0, visibility: "hidden" });
    gsap.set([this.lineLeft, this.lineRight], { scaleX: 0 });

    const slot = this.liveDate();
    const originNode = this.nodes[index];
    const originDate = originNode.querySelector(".works-era-date");
    const dur = this.reduce ? 0 : App.ERA.openDur;
    const lineDur = this.reduce ? 0 : App.ERA.lineDur;

    this.view.scrollLeft = this.metrics.originX - this.metrics.viewW / 2;
    gsap.set(originNode, { visibility: "visible", opacity: 1 });
    gsap.set(originDate, { visibility: "visible", opacity: 1, autoAlpha: 1 });
    this.view.offsetWidth;

    gsap.set(slot, { autoAlpha: 0, x: 0, y: 0, scale: 1 });
    this.setGallery(false);
    this.dateSlots.forEach((el) => {
      if (el !== slot) gsap.to(el, { autoAlpha: 0, duration: dur * 0.35, overwrite: true });
    });

    this.moveDate(originDate, this.slotText(slot), this.ink(), dur);

    this.anim = [];
    const lineAt = this.reduce ? 0 : dur * 0.22;
    this.anim.push(gsap.delayedCall(lineAt, () => {
      this.anim.push(gsap.to([this.lineLeft, this.lineRight], {
        scaleX: 1,
        duration: lineDur,
        ease: "power2.inOut",
      }));
    }));
    this.anim.push(gsap.delayedCall(this.reduce ? 0 : Math.max(0, lineAt + lineDur - 0.2), () => {
      this.anim.push(gsap.to(this.extras(), {
        autoAlpha: 1,
        duration: this.reduce ? 0 : 0.3,
        ease: "power1.out",
      }));
    }));

    const maxDist = Math.max.apply(null, this.metrics.xs.map((x) => Math.abs(x - this.metrics.xs[index]))) || 1;
    let lastDelay = 0;
    this.nodes.forEach((node, i) => {
      const dist = Math.abs(this.metrics.xs[i] - this.metrics.xs[index]) / maxDist;
      const delay = this.reduce ? 0 : lineDur * dist * 0.7 + dur * 0.22;
      lastDelay = Math.max(lastDelay, delay);
      const parts = [
        node.querySelector(".works-era-dot"),
        node.querySelector(".works-era-title"),
        node.querySelector(".works-era-role"),
      ];
      if (i !== index) parts.push(node.querySelector(".works-era-date"));
      gsap.set(node, { visibility: "visible", opacity: 1 });
      gsap.set(parts, { autoAlpha: 0 });
      this.anim.push(gsap.delayedCall(delay, () => {
        this.anim.push(gsap.to(parts, {
          autoAlpha: 1,
          duration: this.reduce ? 0 : 0.32,
          ease: "power2.out",
        }));
      }));
    });
    this.tlCall = gsap.delayedCall(lastDelay + 0.32, () => {
      this.lockDates(true);
      this.root.style.pointerEvents = "";
      this.open = true;
      this.busy = false;
      gsap.delayedCall(0.2, () => { this.ignoreClose = false; });
    });
  },

  layoutWork(index) {
    const n = App.WORKS.length;
    index = ((index % n) + n) % n;
    const from = App.works.active;
    App.works.active = index;
    App.works.layout(false, from);
    const copySlot = App.works.slots[App.works.slot];
    App.works.fillCopy(copySlot, App.WORKS[index]);
    gsap.set(copySlot, { autoAlpha: 1, x: 0, y: 0, scale: 1 });
    gsap.set(App.works.slots[App.works.slot ^ 1], { autoAlpha: 0, x: 0, y: 0, scale: 1 });
    App.works.fillDate(this.liveDate(), App.WORKS[index]);
  },

  applyWork(index) {
    this.layoutWork(index);
    const date = this.liveDate();
    gsap.set(date, { autoAlpha: 1, x: 0, y: 0, scale: 1, clearProps: "color,transform" });
    gsap.set(this.slotText(date), { x: 0, y: 0 });
    gsap.set(App.works.dateSlots[App.works.slot ^ 1], { autoAlpha: 0, x: 0, y: 0, scale: 1 });
    this.lockDates(false);
  },

  commitClose(index, laidOut) {
    const extras = this.extras();
    this.killFlyer();
    this.killAnims();
    if (this.scrollTw) {
      this.scrollTw.kill();
      this.scrollTw = null;
    }
    this.nodes.forEach((node) => node.classList.remove("is-flying"));
    this.root.classList.remove("is-open");
    this.root.style.pointerEvents = "";
    this.root.setAttribute("aria-hidden", "true");
    gsap.set(this.nodes.concat(extras), { autoAlpha: 0 });
    gsap.set([this.lineLeft, this.lineRight], { scaleX: 0 });
    if (laidOut) this.lockDates(false);
    else this.applyWork(index == null ? this.origin : index);
    const copy = App.works.root.querySelector(".works-copy");
    gsap.set([copy, App.works.rail], { autoAlpha: 1 });
    this.open = false;
    this.busy = false;
    this.closing = false;
    this.scrollClose = false;
    App.works.eraOpen = false;
    App.works.busy = false;
  },

  beginScrollClose() {
    if (this.scrollTw) {
      this.scrollClose = true;
      this.closing = true;
      this.scrollTw.play();
      return;
    }
    this.killFlyer();
    this.killAnims();
    this.scrollClose = true;
    this.closing = true;
    this.busy = true;
    this.nodes.forEach((node) => node.classList.remove("is-flying"));
    gsap.set([this.lineLeft, this.lineRight], {
      transformOrigin: (i) => (i === 0 ? "right center" : "left center"),
    });
    const scale = Number(gsap.getProperty(this.lineLeft, "scaleX"));
    const start = 1 - (Number.isFinite(scale) ? scale : 1);
    this.scrollProxy = { t: start };
    this.scrollTw = gsap.to(this.scrollProxy, {
      t: 1,
      duration: this.reduce ? 0.001 : App.ERA.closeDur,
      ease: "power2.inOut",
      overwrite: true,
      onUpdate: () => this.renderClose(this.scrollProxy.t),
      onReverseComplete: () => {
        this.renderClose(0);
        this.closing = false;
        this.scrollClose = false;
        this.busy = false;
        this.open = true;
        this.root.style.pointerEvents = "";
        this.lockDates(true);
      },
    });
  },

  syncPage() {
    if (this.closing && !this.scrollClose) return;
    if (!this.open && !this.busy && !this.scrollClose) return;
    if (this.scrollClose && this.pageGone()) {
      this.commitClose(this.origin);
      return;
    }
    const leaving = this.pageLeaving();
    if (this.scrollTw) {
      if (leaving) this.scrollTw.play();
      else this.scrollTw.reverse();
      return;
    }
    if (leaving && (this.open || this.busy) && !this.pendingScroll) {
      this.pendingScroll = true;
      requestAnimationFrame(() => {
        this.pendingScroll = false;
        if (!this.scrollTw && this.pageLeaving() && (this.open || this.busy)) {
          this.beginScrollClose();
        }
      });
    }
  },

  closeTo(index, instant) {
    if (this.scrollTw) {
      this.scrollTw.kill();
      this.scrollTw = null;
      this.scrollClose = false;
    }
    if (this.closing && !instant) return;
    if (!this.open && !this.busy) return;
    this.closing = true;
    this.busy = true;
    this.killAnims();
    const dur = (this.reduce || instant) ? 0 : App.ERA.closeDur;
    const targetIndex = index == null ? this.origin : index;
    const extras = this.extras();
    const slot = this.liveDate();
    const fromNode = this.nodes[targetIndex];
    const fromDate = fromNode && fromNode.querySelector(".works-era-date");

    const finish = () => this.commitClose(targetIndex, true);

    gsap.set([this.lineLeft, this.lineRight], {
      transformOrigin: (i) => (i === 0 ? "right center" : "left center"),
    });

    if (dur === 0 || !fromDate) {
      this.commitClose(targetIndex);
      return;
    }

    this.layoutWork(targetIndex);
    this.setGallery(true);
    const text = this.slotText(slot);
    this.restDate(text, this.dim());
    gsap.set(slot, { autoAlpha: 0, x: 0, y: 0, scale: 1, color: this.dim() });
    this.view.offsetWidth;
    this.moveDate(text, fromDate, this.dim(), dur, finish);
    gsap.set(slot, { autoAlpha: 1 });
    gsap.set(fromDate, { autoAlpha: 0 });

    this.anim = [];
    this.nodes.forEach((node, i) => {
      const parts = [
        node.querySelector(".works-era-dot"),
        node.querySelector(".works-era-title"),
        node.querySelector(".works-era-role"),
      ];
      if (i !== targetIndex) parts.push(node.querySelector(".works-era-date"));
      this.anim.push(gsap.to(parts, {
        autoAlpha: 0,
        duration: dur * 0.4,
        ease: "power2.in",
      }));
    });
    this.anim.push(gsap.to(extras, {
      autoAlpha: 0,
      duration: dur * 0.4,
      ease: "power2.in",
    }));
    this.anim.push(gsap.to([this.lineLeft, this.lineRight], {
      scaleX: 0,
      duration: dur,
      ease: "power2.inOut",
      overwrite: "auto",
    }));
  },

  relocalize() {
    if (!this.nodes.length) return;
    this.fillSoon();
    this.nodes.forEach((node, i) => this.fillNode(node, App.WORKS[i]));
  },

  bindPan() {
    this.view.addEventListener("wheel", (event) => {
      if (!this.open) return;
      let dx = event.deltaX;
      if (event.shiftKey && Math.abs(event.deltaY) >= Math.abs(dx)) dx = event.deltaY;
      if (Math.abs(dx) <= Math.abs(event.deltaY) && !event.shiftKey) return;
      event.preventDefault();
      event.stopPropagation();
      this.view.scrollLeft += dx;
    }, { passive: false, capture: true });

    this.view.addEventListener("pointerdown", (event) => {
      if (!this.open || event.button) return;
      if (event.target.closest(".works-era-copy")) {
        this.drag = { moved: false };
        return;
      }
      this.drag = {
        x: event.clientX,
        left: this.view.scrollLeft,
        moved: false,
      };
      this.view.setPointerCapture(event.pointerId);
    });
    this.view.addEventListener("pointermove", (event) => {
      if (!this.drag || this.drag.x == null) return;
      const dx = event.clientX - this.drag.x;
      if (Math.abs(dx) > 4) this.drag.moved = true;
      this.view.scrollLeft = this.drag.left - dx;
    });
    const endDrag = () => {
      if (!this.drag) return;
      const moved = this.drag.moved;
      this.drag = moved ? { moved: true } : null;
      if (moved) gsap.delayedCall(0.05, () => { this.drag = null; });
    };
    this.view.addEventListener("pointerup", endDrag);
    this.view.addEventListener("pointercancel", endDrag);
    this.view.addEventListener("click", (event) => {
      if (!this.open || this.ignoreClose || this.busy) return;
      if (event.target.closest(".works-era-node")) return;
      if (this.drag && this.drag.moved) return;
      this.closeTo(this.origin);
    });
  },

  watchPage() {
    gsap.ticker.add(() => this.syncPage());
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && (this.open || this.busy)) this.closeTo(this.origin);
    });
    window.addEventListener("resize", () => {
      if (!this.open || this.busy || this.closing) return;
      const left = this.view.scrollLeft;
      this.place(this.origin);
      gsap.set([this.lineLeft, this.lineRight], { scaleX: 1 });
      gsap.set(this.nodes.concat(this.extras()), { autoAlpha: 1 });
      this.nodes.forEach((node) => {
        gsap.set([
          node.querySelector(".works-era-dot"),
          node.querySelector(".works-era-title"),
          node.querySelector(".works-era-role"),
          node.querySelector(".works-era-date"),
        ], { autoAlpha: 1 });
      });
      this.view.scrollLeft = left;
    });
  },

  init() {
    this.root = document.getElementById("works-era");
    if (!this.root) return;
    this.view = this.root.querySelector(".works-era-view");
    this.track = this.root.querySelector(".works-era-track");
    this.lineLeft = this.root.querySelector(".works-era-line.is-left");
    this.lineRight = this.root.querySelector(".works-era-line.is-right");
    this.dateSlots = [...document.querySelectorAll(".works-date-slot")];
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.build();
    this.hideIdleDates();
    this.dateSlots.forEach((el) => {
      el.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.openFrom(App.works.active);
      });
    });
    this.bindPan();
    this.watchPage();
  },
};
