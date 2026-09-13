window.App = window.App || {};

App.files = {
  path: [],
  query: "",
  busy: false,
  reduce: false,

  nodeAt(parts) {
    let nodes = (App.DOWNLOAD && App.DOWNLOAD.tree) || [];
    const trail = [];
    for (const name of parts) {
      const next = nodes.find((item) => item.type === "dir" && item.name === name);
      if (!next) break;
      trail.push(next);
      nodes = next.children || [];
    }
    return { nodes, trail };
  },

  dirLabel(name) {
    const key = "download.dir." + name;
    const text = App.i18n.t(key);
    return text === key ? name : text;
  },

  fileLabel(node) {
    const raw = node.name || "";
    const ext = node.ext ? "." + node.ext : "";
    if (ext && raw.toLowerCase().endsWith(ext)) return raw.slice(0, -ext.length);
    return raw.replace(/\.[^.]+$/, "") || raw;
  },

  kindLabel(node) {
    if (node.type === "dir") return App.i18n.t("download.kind.folder");
    if (node.kind === "pdf") return "PDF";
    if (node.kind === "audio") return (node.ext || "WAV").toUpperCase();
    if (node.kind === "midi") return "MIDI";
    return (node.ext || "").toUpperCase();
  },

  icon(node) {
    const kind = node.type === "dir" ? "folder" : node.kind || "file";
    const svgs = {
      folder: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 18.5V12h13.2l3.3 6.5H42V38H6z" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="miter"/><path d="M6 18.5h36" fill="none" stroke="currentColor" stroke-width="1.35"/></svg>',
      pdf: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 6h13l11 11v25H14z" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="miter"/><path d="M27 6v11h11" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="miter"/><path d="M20 28h8M20 33h12" fill="none" stroke="currentColor" stroke-width="1.35"/></svg>',
      audio: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M16 20h6l10-8v24l-10-8h-6z" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="miter"/><path d="M36 19.5c2.4 2.2 2.4 6.8 0 9" fill="none" stroke="currentColor" stroke-width="1.35"/></svg>',
      midi: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="14" width="32" height="22" fill="none" stroke="currentColor" stroke-width="1.35"/><path d="M16 14v22M24 14v22M32 14v22" fill="none" stroke="currentColor" stroke-width="1.35"/></svg>',
      file: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 6h13l11 11v25H14z" fill="none" stroke="currentColor" stroke-width="1.35"/><path d="M27 6v11h11" fill="none" stroke="currentColor" stroke-width="1.35"/></svg>',
    };
    return svgs[kind] || svgs.file;
  },

  hay(node, trail) {
    const bits = [
      node.name,
      this.fileLabel(node),
      this.kindLabel(node),
      node.ext,
      node.kind,
    ];
    trail.forEach((name) => {
      bits.push(name);
      bits.push(this.dirLabel(name));
    });
    return bits.filter(Boolean).join(" ").toLowerCase();
  },

  search(query) {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const hits = [];
    const walk = (nodes, trail) => {
      (nodes || []).forEach((node) => {
        const next = trail.concat(node.name);
        if (this.hay(node, trail).includes(q)) {
          hits.push({ node, trail });
        }
        if (node.type === "dir") walk(node.children, next);
      });
    };
    walk((App.DOWNLOAD && App.DOWNLOAD.tree) || [], []);
    return hits;
  },

  items() {
    const hits = this.search(this.query);
    if (hits) return hits;
    const { nodes } = this.nodeAt(this.path);
    return (nodes || []).map((node) => ({ node, trail: this.path.slice() }));
  },

  setCrumbs() {
    if (!this.crumbs) return;
    this.crumbs.replaceChildren();
    const searching = Boolean(this.query.trim());
    const parts = searching ? [] : this.path;
    const add = (label, index, current) => {
      if (this.crumbs.children.length) {
        const sep = document.createElement("span");
        sep.className = "download-sep";
        sep.textContent = "/";
        this.crumbs.appendChild(sep);
      }
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = current ? "download-crumb is-now" : "download-crumb";
      btn.textContent = label;
      if (!current) {
        btn.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          this.query = "";
          if (this.input) this.input.value = "";
          this.go(index < 0 ? [] : this.path.slice(0, index + 1));
        });
      }
      this.crumbs.appendChild(btn);
    };
    add(App.i18n.t("download.root"), -1, !searching && parts.length === 0);
    if (searching) {
      add(App.i18n.t("download.results"), -1, true);
      return;
    }
    parts.forEach((name, index) => add(this.dirLabel(name), index, index === parts.length - 1));
  },

  armUp() {
    if (!this.up) return;
    const on = this.path.length > 0 || Boolean(this.query.trim());
    this.up.setAttribute("aria-hidden", on ? "false" : "true");
    this.up.tabIndex = on ? 0 : -1;
    gsap.to(this.up, {
      autoAlpha: on ? 1 : 0,
      duration: this.reduce ? 0 : App.FILES.fadeDur,
      ease: "power2.out",
      overwrite: "auto",
    });
  },

  makeItem(entry) {
    const { node, trail } = entry;
    const btn = document.createElement(node.type === "file" ? "a" : "button");
    btn.className = "download-item is-" + (node.type === "dir" ? "dir" : "file");
    if (node.type === "file") {
      btn.href = node.path;
      btn.setAttribute("download", node.name);
      btn.rel = "noopener";
    } else {
      btn.type = "button";
    }
    const mark = document.createElement("span");
    mark.className = "download-icon is-" + (node.type === "dir" ? "folder" : node.kind || "file");
    mark.innerHTML = this.icon(node);
    const name = document.createElement("span");
    name.className = "download-name";
    name.textContent = node.type === "dir" ? this.dirLabel(node.name) : this.fileLabel(node);
    if (node.type === "dir") {
      if (App.i18n.locale === "ja") name.setAttribute("lang", "ja");
    } else {
      name.setAttribute("lang", "en");
    }
    const meta = document.createElement("span");
    meta.className = "download-meta";
    if (this.query.trim() && trail.length) {
      meta.textContent = trail.map((part) => this.dirLabel(part)).join(" / ");
    } else {
      meta.textContent = this.kindLabel(node);
    }
    btn.appendChild(mark);
    btn.appendChild(name);
    btn.appendChild(meta);
    btn.setAttribute("title", node.type === "dir" ? this.dirLabel(node.name) : node.name);
    if (node.type === "dir") {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.query = "";
        if (this.input) this.input.value = "";
        this.go(trail.concat(node.name));
      });
    }
    return btn;
  },

  paint(animate) {
    if (!this.grid) return;
    this.setCrumbs();
    this.armUp();
    const next = this.items();
    const fill = () => {
      this.grid.replaceChildren();
      if (!next.length) {
        const note = document.createElement("p");
        note.className = "download-empty";
        note.textContent = App.i18n.t("download.empty");
        this.grid.appendChild(note);
        return [];
      }
      return next.map((entry) => {
        const el = this.makeItem(entry);
        this.grid.appendChild(el);
        return el;
      });
    };
    const show = () => {
      const els = fill();
      if (!animate || this.reduce || !els.length) {
        gsap.set(els, { autoAlpha: 1, y: 0 });
        this.busy = false;
        return;
      }
      gsap.fromTo(els, {
        autoAlpha: 0,
        y: 14,
      }, {
        autoAlpha: 1,
        y: 0,
        duration: App.FILES.inDur,
        ease: "power2.out",
        stagger: { amount: Math.min(0.22, els.length * 0.028), from: "start" },
        onComplete: () => { this.busy = false; },
      });
    };
    if (this.tw) {
      this.tw.kill();
      this.tw = null;
    }
    const old = [...this.grid.children];
    if (animate && !this.reduce && old.length) {
      this.busy = true;
      this.tw = gsap.to(old, {
        autoAlpha: 0,
        y: -10,
        duration: App.FILES.fadeDur,
        ease: "power2.in",
        stagger: { amount: Math.min(0.16, old.length * 0.02), from: "start" },
        onComplete: show,
      });
      return;
    }
    show();
  },

  go(parts) {
    this.path = parts.slice();
    this.paint(true);
  },

  upDir() {
    if (this.query.trim()) {
      this.query = "";
      if (this.input) this.input.value = "";
      this.paint(true);
      return;
    }
    if (!this.path.length) return;
    this.go(this.path.slice(0, -1));
  },

  relocalize() {
    if (!this.root) return;
    if (App.i18n.locale === "ja") this.root.setAttribute("lang", "ja");
    else this.root.removeAttribute("lang");
    if (this.input) this.input.setAttribute("placeholder", App.i18n.t("download.search"));
    this.paint(false);
  },

  bindWheel() {
    if (!this.stage) return;
    this.stage.addEventListener("wheel", (event) => {
      const max = this.stage.scrollHeight - this.stage.clientHeight;
      if (max <= 0) return;
      event.preventDefault();
      event.stopPropagation();
      this.stage.scrollTop = Math.max(0, Math.min(max, this.stage.scrollTop + event.deltaY));
    }, { passive: false });
  },

  init() {
    this.root = document.getElementById("download");
    if (!this.root) return;
    this.grid = this.root.querySelector(".download-grid");
    this.crumbs = this.root.querySelector(".download-crumbs");
    this.up = this.root.querySelector(".download-up");
    this.input = this.root.querySelector(".download-q");
    this.stage = this.root.querySelector(".download-stage");
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (this.up) {
      gsap.set(this.up, { autoAlpha: 0 });
      this.up.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.upDir();
      });
    }
    if (this.input) {
      this.input.setAttribute("placeholder", App.i18n.t("download.search"));
      this.input.addEventListener("input", () => {
        this.query = this.input.value;
        this.paint(true);
      });
      this.input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") event.preventDefault();
        if (event.key === "Escape") {
          event.preventDefault();
          if (this.query) {
            this.query = "";
            this.input.value = "";
            this.paint(true);
          } else this.input.blur();
        }
      });
      this.input.addEventListener("wheel", (event) => event.stopPropagation(), { passive: true });
    }
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (!this.root || this.root.style.visibility === "hidden") return;
      const op = Number(gsap.getProperty(this.root, "opacity"));
      if (!(op > 0.55)) return;
      if (this.query || this.path.length) this.upDir();
    });
    this.bindWheel();
    this.relocalize();
  },
};
