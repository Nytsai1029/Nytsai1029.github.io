window.App = window.App || {};

App.service = {
  open: false,
  busy: false,
  closing: false,
  active: null,
  reduce: false,

  copy(id) {
    const pack = App.SERVICE_COPY[App.i18n.locale] || App.SERVICE_COPY.zh;
    return pack[id] || App.SERVICE_COPY.zh[id] || [];
  },

  opacity() {
    if (!this.root) return 0;
    const raw = Number(gsap.getProperty(this.root, "opacity"));
    if (Number.isFinite(raw)) return raw;
    return parseFloat(getComputedStyle(this.root).opacity) || 0;
  },

  visible() {
    return this.opacity() > 0.55 && this.root.style.visibility !== "hidden";
  },

  pageLeaving() {
    if (this.scrollClose) return !(this.opacity() > 0.55);
    return this.opacity() <= 0.5;
  },

  pageGone() {
    return this.opacity() <= 0.02;
  },

  others(except) {
    return this.items.filter((item) => item !== except);
  },

  titleOf(item) {
    return item.querySelector(".service-title");
  },

  backOf(item) {
    return item.querySelector(".service-back");
  },

  detailOf(item) {
    return item.querySelector(".service-detail");
  },

  armBack(item, on) {
    const back = this.backOf(item);
    if (!back) return;
    back.setAttribute("aria-hidden", on ? "false" : "true");
    back.tabIndex = on ? 0 : -1;
  },

  kill() {
    if (this.tl) {
      this.tl.kill();
      this.tl = null;
    }
    if (this.scrollTw) {
      this.scrollTw.kill();
      this.scrollTw = null;
    }
  },

  add(parent, tag, className, text, lang) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    if (lang) el.setAttribute("lang", lang);
    parent.appendChild(el);
    return el;
  },

  bindAway(el) {
    el.addEventListener("click", (event) => event.stopPropagation());
  },

  extLink(parent, className, href, text, lang) {
    const a = this.add(parent, "a", className, text, lang);
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    this.bindAway(a);
    return a;
  },

  addFigure(parent, spec, item) {
    if (typeof spec === "string") spec = App.SERVICE_FIGURES[spec];
    if (!spec) return;
    const kind = spec.ink === "light" ? "is-light" : "is-ink";
    const fig = this.add(parent, "figure", spec.wide ? "service-figure is-wide " + kind : "service-figure " + kind);
    const img = this.add(fig, "img", "");
    img.src = spec.src;
    img.alt = spec.alt || "";
    img.addEventListener("load", () => {
      if (this.open && this.active === item && !this.busy) this.fitDetail();
    });
  },

  streamHref(id) {
    return "https://w.soundcloud.com/player/?url=" + encodeURIComponent("https://api.soundcloud.com/tracks/" + id);
  },

  wavPath(name) {
    return "sound/service/" + encodeURI(name) + ".wav";
  },

  fill(item) {
    const id = item.getAttribute("data-service");
    const body = item.querySelector(".service-detail-body");
    if (!id || !body) return;
    body.replaceChildren();
    this.copy(id).forEach((block) => {
      if (block.h) this.add(body, "h4", "service-h", block.h);
      (block.p || []).forEach((text) => this.add(body, "p", "service-p", text));
      if (block.figure) this.addFigure(body, block.figure, item);
      if (block.figures) {
        const wrap = this.add(body, "div", "service-figures");
        block.figures.forEach((key) => this.addFigure(wrap, key, item));
      }
      if (block.note) this.add(body, "p", "service-note", block.note, "en");
      if (block.ext && App.SERVICE_EXT[block.ext]) {
        const p = this.add(body, "p", "service-ext");
        this.extLink(p, "service-link", App.SERVICE_EXT[block.ext], "MAYURA", "en");
      }
      if (block.groups) {
        (App.SERVICE_LISTS[block.groups] || []).forEach((group) => {
          this.add(body, "p", "service-group", group.label, "en");
          const ul = this.add(body, "ul", "service-list", null, "en");
          group.items.forEach((entry) => {
            const li = this.add(ul, "li", "");
            if (entry.pdf) this.extLink(li, "service-link", entry.pdf, entry.name, "en");
            else li.textContent = entry.name || entry;
          });
        });
      }
      if (block.streams) {
        const ul = this.add(body, "ul", "service-list", null, "en");
        (App.SERVICE_LISTS[block.streams] || []).forEach((entry) => {
          const li = this.add(ul, "li", "");
          this.extLink(li, "service-link", this.streamHref(entry.id), entry.name, "en");
        });
      }
      if (block.list === "library") {
        const table = this.add(body, "table", "service-table", null, "en");
        const head = this.add(table, "thead", "");
        const hr = this.add(head, "tr", "");
        this.add(hr, "th", "", "Sample");
        this.add(hr, "th", "", App.i18n.t("service.listen"));
        this.add(hr, "th", "", App.i18n.t("service.download"));
        const tb = this.add(table, "tbody", "");
        (App.SERVICE_LISTS.library || []).forEach((name) => {
          const src = this.wavPath(name);
          const tr = this.add(tb, "tr", "");
          this.add(tr, "td", "service-sample-name", name);
          const listen = this.add(tr, "td", "");
          const audio = this.add(listen, "audio", "service-audio");
          audio.controls = true;
          audio.preload = "none";
          audio.setAttribute("controlsList", "nodownload");
          const source = this.add(audio, "source", "");
          source.src = src;
          source.type = "audio/wav";
          const dlCell = this.add(tr, "td", "");
          const a = this.extLink(dlCell, "service-btn", src, App.i18n.t("service.download"));
          a.removeAttribute("target");
          a.setAttribute("download", name + ".wav");
        });
      }
    });
  },

  pauseMedia() {
    if (!this.root) return;
    this.root.querySelectorAll("audio").forEach((el) => {
      el.pause();
    });
  },

  flipSet(el, from) {
    const to = el.getBoundingClientRect();
    gsap.set(el, { x: from.left - to.left, y: from.top - to.top });
  },

  ruleSize(detail) {
    const rule = detail.querySelector(".service-detail-rule");
    if (!rule) return 18;
    const box = rule.getBoundingClientRect();
    const style = getComputedStyle(rule);
    return box.height + (parseFloat(style.marginTop) || 0) + (parseFloat(style.marginBottom) || 0);
  },

  room() {
    if (!this.active) return 120;
    const inner = this.inner.getBoundingClientRect();
    const title = this.titleOf(this.active).getBoundingClientRect();
    const pad = parseFloat(getComputedStyle(this.inner).paddingBottom) || 0;
    return Math.max(96, inner.bottom - pad - title.bottom);
  },

  fitDetail() {
    if (!this.active) return;
    const detail = this.detailOf(this.active);
    const body = detail.querySelector(".service-detail-body");
    const ruleH = this.ruleSize(detail);
    const content = body.scrollHeight + ruleH;
    const max = this.room();
    const height = Math.min(content, max);
    const overflow = content > max + 1;
    gsap.set(detail, { height: height, overflow: "hidden" });
    gsap.set(body, { overflow: overflow ? "auto" : "hidden" });
    body.scrollTop = 0;
  },

  lock(on) {
    this.items.forEach((item) => {
      const hit = item.querySelector(".service-hit");
      if (!hit) return;
      if (!on) {
        hit.disabled = false;
        return;
      }
      hit.disabled = item !== this.active;
    });
  },

  resetLayout() {
    this.root.classList.remove("is-open");
    this.items.forEach((item) => {
      item.classList.remove("is-active");
      const title = this.titleOf(item);
      const detail = this.detailOf(item);
      const back = this.backOf(item);
      const hit = item.querySelector(".service-hit");
      gsap.set([item, title, detail, this.head], { clearProps: "all" });
      gsap.set(detail, { height: 0, autoAlpha: 0, overflow: "hidden" });
      if (back) gsap.set(back, { clearProps: "all" });
      this.armBack(item, false);
      detail.setAttribute("aria-hidden", "true");
      if (hit) {
        hit.disabled = false;
        hit.setAttribute("aria-expanded", "false");
      }
    });
  },

  commitClose() {
    this.pauseMedia();
    this.kill();
    this.resetLayout();
    this.open = false;
    this.busy = false;
    this.closing = false;
    this.scrollClose = false;
    this.active = null;
    this.root.removeAttribute("data-open");
  },

  openItem(item) {
    if (this.busy || this.closing || !this.visible()) return;
    if (this.open) {
      if (item === this.active) this.close();
      return;
    }
    const title = this.titleOf(item);
    const back = this.backOf(item);
    const detail = this.detailOf(item);
    const body = detail.querySelector(".service-detail-body");
    const rest = this.others(item);
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.busy = true;
    this.active = item;
    this.kill();
    const fadeDur = this.reduce ? 0 : App.SERVICE.fadeDur;
    const titleDur = this.reduce ? 0 : App.SERVICE.titleDur;
    const bodyDur = this.reduce ? 0 : App.SERVICE.bodyDur;
    const from = title.getBoundingClientRect();

    this.tl = gsap.timeline({
      onComplete: () => {
        this.open = true;
        this.busy = false;
        this.fitDetail();
        this.lock(true);
      },
    });
    this.tl.to(this.head, { autoAlpha: 0, duration: fadeDur, ease: "power2.out" }, 0);
    this.tl.to(rest, { autoAlpha: 0, duration: fadeDur, ease: "power2.out" }, 0);
    this.tl.add(() => {
      this.root.classList.add("is-open");
      item.classList.add("is-active");
      this.root.setAttribute("data-open", item.getAttribute("data-service"));
      item.querySelector(".service-hit").setAttribute("aria-expanded", "true");
      detail.setAttribute("aria-hidden", "false");
      if (back) gsap.set(back, { autoAlpha: 0 });
      void this.inner.offsetWidth;
      this.flipSet(title, from);
      this.detailH = Math.min(body.scrollHeight + this.ruleSize(detail), this.room());
      gsap.set(detail, { height: 0, autoAlpha: 1, overflow: "hidden" });
      gsap.set(body, { y: this.reduce ? 0 : -18, autoAlpha: this.reduce ? 1 : 0 });
    });
    this.tl.to(title, {
      x: 0,
      y: 0,
      duration: titleDur,
      ease: "power2.inOut",
      force3D: true,
    });
    this.tl.to(detail, {
      height: () => this.detailH || 0,
      duration: bodyDur,
      ease: "power2.out",
    }, titleDur === 0 ? ">" : "-=0.08");
    this.tl.to(body, {
      y: 0,
      autoAlpha: 1,
      duration: bodyDur === 0 ? 0 : bodyDur * 0.88,
      ease: "power2.out",
    }, "<");
    if (back) {
      this.tl.to(back, {
        autoAlpha: 1,
        duration: fadeDur,
        ease: "power2.out",
        onStart: () => this.armBack(item, true),
      }, "<");
    }
  },

  close(instant) {
    if (this.scrollTw) {
      this.scrollTw.kill();
      this.scrollTw = null;
      this.scrollClose = false;
    }
    if (!this.open && !this.busy) return;
    if (this.closing && !instant) return;
    const item = this.active;
    if (!item) {
      this.commitClose();
      return;
    }
    this.closing = true;
    this.busy = true;
    this.pauseMedia();
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.kill();
    const title = this.titleOf(item);
    const back = this.backOf(item);
    const detail = this.detailOf(item);
    const body = detail.querySelector(".service-detail-body");
    const rest = this.others(item);
    const dur = (this.reduce || instant) ? 0 : App.SERVICE.closeDur;
    const fadeDur = (this.reduce || instant) ? 0 : App.SERVICE.fadeDur;
    this.armBack(item, false);
    if (dur === 0) {
      this.commitClose();
      return;
    }
    const from = title.getBoundingClientRect();
    this.lock(false);
    this.tl = gsap.timeline({
      onComplete: () => this.commitClose(),
    });
    this.tl.to(body, { y: -12, autoAlpha: 0, duration: dur * 0.72, ease: "power2.in" }, 0);
    this.tl.to(detail, { height: 0, duration: dur, ease: "power2.in" }, 0);
    if (back) this.tl.to(back, { autoAlpha: 0, duration: fadeDur, ease: "power2.in" }, 0);
    this.tl.add(() => {
      this.root.classList.remove("is-open");
      item.classList.remove("is-active");
      void this.inner.offsetWidth;
      this.flipSet(title, from);
    });
    this.tl.to(title, { x: 0, y: 0, duration: dur, ease: "power2.inOut", force3D: true });
    this.tl.to(this.head, { autoAlpha: 1, duration: fadeDur, ease: "power2.out" }, "-=0.12");
    this.tl.to(rest, { autoAlpha: 1, duration: fadeDur, ease: "power2.out" }, "<");
  },

  beginScrollClose() {
    if (this.scrollTw) {
      this.scrollClose = true;
      this.closing = true;
      this.scrollTw.play();
      return;
    }
    this.kill();
    this.pauseMedia();
    this.scrollClose = true;
    this.closing = true;
    this.busy = true;
    const item = this.active;
    const detail = item ? this.detailOf(item) : null;
    const back = item ? this.backOf(item) : null;
    const rest = item ? this.others(item) : [];
    if (item) this.armBack(item, false);
    this.scrollTw = gsap.timeline({
      onReverseComplete: () => {
        this.closing = false;
        this.scrollClose = false;
        this.busy = false;
        this.open = true;
        this.lock(true);
        if (this.active) this.armBack(this.active, true);
        this.fitDetail();
      },
    });
    if (detail) this.scrollTw.to(detail, { autoAlpha: 0, height: 0, duration: this.reduce ? 0.001 : App.SERVICE.closeDur, ease: "power2.in" }, 0);
    if (back) this.scrollTw.to(back, { autoAlpha: 0, duration: this.reduce ? 0.001 : App.SERVICE.fadeDur, ease: "power2.in" }, 0);
    this.scrollTw.to(this.head, { autoAlpha: 1, duration: this.reduce ? 0.001 : App.SERVICE.fadeDur, ease: "power2.out" }, 0.08);
    this.scrollTw.to(rest, { autoAlpha: 1, duration: this.reduce ? 0.001 : App.SERVICE.fadeDur, ease: "power2.out" }, 0.08);
  },

  syncPage() {
    if (this.closing && !this.scrollClose) return;
    if (!this.open && !this.busy && !this.scrollClose) return;
    if (this.scrollClose && this.pageGone()) {
      this.commitClose();
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

  relocalize() {
    if (!this.items) return;
    this.pauseMedia();
    this.items.forEach((item) => this.fill(item));
    if (this.open && this.active && !this.busy) this.fitDetail();
  },

  init() {
    this.root = document.getElementById("service");
    if (!this.root) return;
    this.inner = this.root.querySelector(".service-inner");
    this.head = this.root.querySelector(".service-head");
    this.items = [...this.root.querySelectorAll(".service-item")];
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.items.forEach((item) => {
      this.fill(item);
      gsap.set(this.detailOf(item), { height: 0, autoAlpha: 0, overflow: "hidden" });
      const hit = item.querySelector(".service-hit");
      const back = this.backOf(item);
      hit.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (this.busy || this.closing) return;
        if (this.open && item === this.active) this.close();
        else this.openItem(item);
      });
      if (back) {
        gsap.set(back, { autoAlpha: 0 });
        back.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (this.busy || this.closing) return;
          if (this.open && item === this.active) this.close();
        });
      }
      const body = item.querySelector(".service-detail-body");
      body.addEventListener("play", (event) => {
        if (event.target.tagName !== "AUDIO") return;
        body.querySelectorAll("audio").forEach((el) => {
          if (el !== event.target) el.pause();
        });
      }, true);
      body.addEventListener("wheel", (event) => {
        if (!this.open || item !== this.active) return;
        const max = body.scrollHeight - body.clientHeight;
        if (max <= 0) return;
        event.preventDefault();
        event.stopPropagation();
        body.scrollTop = Math.max(0, Math.min(max, body.scrollTop + event.deltaY));
      }, { passive: false });
    });
    this.inner.addEventListener("click", (event) => {
      if (!this.open || this.busy) return;
      const el = event.target;
      if (!(el instanceof Element)) return;
      if (el.closest(".service-item")) return;
      this.close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.open && !this.busy) this.close();
    });
    window.addEventListener("resize", () => {
      if (this.open && !this.busy && !this.closing) this.fitDetail();
    });
    gsap.ticker.add(() => this.syncPage());
  },
};
