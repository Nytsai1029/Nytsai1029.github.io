window.App = window.App || {};

App.works = {
  active: 0,
  slot: 0,
  busy: false,
  cards: [],
  observer: null,

  wrapDelta(i, active, n) {
    let d = ((i - active) % n + n) % n;
    if (d > n / 2) d -= n;
    return d;
  },

  indexAt(active, d, n) {
    return ((active + d) % n + n) % n;
  },

  visible() {
    if (!this.root) return false;
    const opacity = Number(gsap.getProperty(this.root, "opacity"));
    return opacity > 0.55 && this.root.style.visibility !== "hidden";
  },

  gap() {
    const width = this.gallery ? this.gallery.getBoundingClientRect().width : 1200;
    return Math.max(App.GALLERY.gap, width * 0.02);
  },

  cardW(i, abs) {
    const el = this.cards[i];
    const w = el && el.offsetWidth ? el.offsetWidth : 240;
    return w * this.scaleAt(abs);
  },

  scaleAt(abs) {
    const scale = App.GALLERY.scale;
    if (abs <= 1) return gsap.utils.interpolate(scale[0], scale[1], abs);
    if (abs <= 2) return gsap.utils.interpolate(scale[1], scale[2], abs - 1);
    return scale[2] * 0.92;
  },

  opacityAt(abs) {
    const opacity = App.GALLERY.opacity;
    if (abs <= 1) return gsap.utils.interpolate(opacity[0], opacity[1], abs);
    if (abs <= 2) return gsap.utils.interpolate(opacity[1], opacity[2], abs - 1);
    return 0;
  },

  xFor(i, active) {
    const n = App.WORKS.length;
    const d = this.wrapDelta(i, active, n);
    if (Math.abs(d) < 0.001) return 0;
    const sign = Math.sign(d);
    const steps = Math.round(Math.abs(d));
    const gap = this.gap();
    let x = 0;
    for (let k = 0; k < steps; k++) {
      const inner = this.indexAt(active, sign * k, n);
      const outer = this.indexAt(active, sign * (k + 1), n);
      x += this.cardW(inner, k) / 2 + gap + this.cardW(outer, k + 1) / 2;
    }
    return sign * x;
  },

  fillCopy(slotEl, work) {
    const title = slotEl.querySelector(".works-title");
    const role = slotEl.querySelector(".works-role");
    title.textContent = work.title;
    title.setAttribute("lang", "ja");
    role.textContent = App.i18n.workRole(work);
    if (App.i18n.locale === "ja") role.setAttribute("lang", "ja");
    else role.removeAttribute("lang");
    slotEl.querySelector(".works-btn-detail").href = work.detail;
    slotEl.querySelector(".works-btn-amazon").href = work.amazon;
    slotEl.querySelector(".works-btn-detail").textContent = App.i18n.t("works.detail");
    slotEl.querySelector(".works-btn-amazon").textContent = App.i18n.t("works.amazon");
  },

  fillDate(slotEl, work) {
    slotEl.textContent = work.date;
  },

  syncSeam() {
    const n = App.WORKS.length;
    const dA = this.wrapDelta(0, this.active, n);
    const dB = this.wrapDelta(n - 1, this.active, n);
    const show = Math.abs(dA) <= 2.05 && Math.abs(dB) <= 2.05 && Math.abs(dA - dB) === 1;
    if (!show) {
      gsap.set(this.seam, { autoAlpha: 0 });
      return;
    }
    const a = this.cards[0].getBoundingClientRect();
    const b = this.cards[n - 1].getBoundingClientRect();
    const rail = this.rail.getBoundingClientRect();
    const left = a.left < b.left ? a : b;
    const right = a.left < b.left ? b : a;
    const gap = right.left - left.right;
    if (gap < 4 || gap > 120) {
      gsap.set(this.seam, { autoAlpha: 0 });
      return;
    }
    gsap.set(this.seam, {
      autoAlpha: 0.95,
      x: (left.right + right.left) / 2 - (rail.left + rail.width / 2),
      height: Math.min(left.height, right.height),
    });
  },

  layout(animate, fromActive) {
    const n = App.WORKS.length;
    this.cards.forEach((el, i) => {
      const d = this.wrapDelta(i, this.active, n);
      const abs = Math.abs(d);
      if (animate && fromActive != null) {
        const prev = this.wrapDelta(i, fromActive, n);
        if (Math.abs(prev) > 2.05 && abs <= 2.05) {
          gsap.set(el, {
            x: this.xFor(i, fromActive),
            scale: this.scaleAt(Math.abs(prev)),
            autoAlpha: 0,
            xPercent: -50,
            yPercent: -50,
          });
        }
      }
      el.style.pointerEvents = abs <= 2.05 ? "auto" : "none";
      const vars = {
        x: this.xFor(i, this.active),
        y: 0,
        xPercent: -50,
        yPercent: -50,
        scale: this.scaleAt(abs),
        autoAlpha: abs <= 2.05 ? this.opacityAt(abs) : 0,
        zIndex: 20 - Math.round(abs * 4),
        duration: App.GALLERY.dur,
        ease: "power3.out",
        overwrite: "auto",
      };
      if (animate) gsap.to(el, vars);
      else gsap.set(el, vars);
    });
    if (animate) {
      gsap.to({}, {
        duration: App.GALLERY.dur,
        ease: "power3.out",
        onUpdate: () => this.syncSeam(),
        onComplete: () => this.syncSeam(),
      });
    } else {
      this.syncSeam();
    }
  },

  swapCopy(dir) {
    const incoming = this.slots[this.slot ^ 1];
    const outgoing = this.slots[this.slot];
    const inDate = this.dateSlots[this.slot ^ 1];
    const outDate = this.dateSlots[this.slot];
    const work = App.WORKS[this.active];
    this.fillCopy(incoming, work);
    this.fillDate(inDate, work);
    this.slot ^= 1;
    const dur = App.GALLERY.copyDur;
    const delay = dur * App.GALLERY.copyOverlap;
    const groups = [[outgoing, outDate], [incoming, inDate]];
    gsap.killTweensOf(groups.flat());
    gsap.fromTo(groups[0], { x: 0, autoAlpha: 1 }, {
      x: -32 * dir,
      autoAlpha: 0,
      duration: dur,
      ease: "power2.in",
    });
    gsap.fromTo(groups[1], { x: 32 * dir, autoAlpha: 0 }, {
      x: 0,
      autoAlpha: 1,
      duration: dur,
      delay,
      ease: "power2.out",
    });
  },

  goTo(index, dirHint) {
    const n = App.WORKS.length;
    index = ((index % n) + n) % n;
    if (index === this.active) return;
    const dir = dirHint || Math.sign(this.wrapDelta(index, this.active, n)) || 1;
    const from = this.active;
    this.active = index;
    this.layout(true, from);
    this.swapCopy(dir);
  },

  step(dir) {
    if (this.busy || !this.visible()) return;
    this.busy = true;
    this.goTo(this.active + dir, dir);
    gsap.delayedCall(App.GALLERY.dur * 0.82, () => {
      this.busy = false;
    });
  },

  onCardClick(i) {
    if (this.busy || !this.visible()) return;
    const d = this.wrapDelta(i, this.active, App.WORKS.length);
    if (Math.abs(d) < 0.001) return;
    this.busy = true;
    this.goTo(i, Math.sign(d));
    gsap.delayedCall(App.GALLERY.dur * 0.82, () => {
      this.busy = false;
    });
  },

  bindSwipe() {
    let startX = 0;
    let startY = 0;
    let dragging = false;
    this.gallery.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch") return;
      startX = event.clientX;
      startY = event.clientY;
      dragging = true;
    });
    window.addEventListener("pointerup", (event) => {
      if (!dragging) return;
      dragging = false;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy) * 1.25) {
        this.step(dx < 0 ? 1 : -1);
      }
    });
  },

  init() {
    this.root = document.getElementById("works");
    this.gallery = this.root.querySelector(".works-gallery");
    this.rail = this.root.querySelector(".works-rail");
    this.seam = this.root.querySelector(".works-seam");
    this.slots = [...this.root.querySelectorAll(".works-copy-slot")];
    this.dateSlots = [...this.root.querySelectorAll(".works-date-slot")];

    App.WORKS.forEach((work, i) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "works-card";
      card.setAttribute("aria-label", work.title);
      const img = document.createElement("img");
      img.src = work.image;
      img.alt = work.title;
      img.referrerPolicy = "no-referrer";
      img.draggable = false;
      img.addEventListener("load", () => this.layout(false));
      card.appendChild(img);
      card.addEventListener("click", () => this.onCardClick(i));
      this.rail.appendChild(card);
    });

    this.cards = [...this.rail.querySelectorAll(".works-card")];
    this.fillCopy(this.slots[0], App.WORKS[0]);
    this.fillDate(this.dateSlots[0], App.WORKS[0]);
    gsap.set([this.slots[0], this.dateSlots[0]], { autoAlpha: 1, x: 0 });
    gsap.set([this.slots[1], this.dateSlots[1]], { autoAlpha: 0, x: 0 });
    gsap.set(this.seam, {
      autoAlpha: 0,
      xPercent: -50,
      yPercent: -50,
      left: "50%",
      top: "50%",
    });
    this.layout(false);

    if (typeof Observer !== "undefined") {
      this.observer = Observer.create({
        target: this.gallery,
        type: "touch",
        lockAxis: true,
        tolerance: 50,
        preventDefault: false,
        onLeft: () => this.step(1),
        onRight: () => this.step(-1),
      });
    }

    this.bindSwipe();
    window.addEventListener("resize", () => this.layout(false));
  },

  relocalize() {
    if (!this.slots || !this.slots.length) return;
    const work = App.WORKS[this.active];
    this.fillCopy(this.slots[this.slot], work);
    this.fillDate(this.dateSlots[this.slot], work);
  },
};
