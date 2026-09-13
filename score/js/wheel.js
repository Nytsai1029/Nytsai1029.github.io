window.App = window.App || {};

App.wheel = {
  root: null,
  items: [],
  hover: { t: 0, target: 0 },

  lerp(a, b, t) {
    return a + (b - a) * t;
  },

    curveX(d, expanded) {
      const curve = expanded ? App.WHEEL.curve.open : App.WHEEL.curve.compact;
      return d * d * curve;
    },

  vars(active, k, expanded) {
    const d = k - active;
    const near = gsap.utils.clamp(0, 1, Math.abs(d));
    const yGap = expanded ? App.WHEEL.yGap.open : App.WHEEL.yGap.compact;
    const scaleHi = expanded ? App.WHEEL.scaleHi.open : App.WHEEL.scaleHi.compact;
    const scaleLo = expanded ? App.WHEEL.scaleLo.open : App.WHEEL.scaleLo.compact;
    return {
      yPercent: -50,
      y: d * yGap,
      x: this.curveX(d, expanded),
      scale: gsap.utils.interpolate(scaleHi, scaleLo, expanded ? near * 0.85 : near),
      color: gsap.utils.interpolate(App.WHEEL.ink, App.WHEEL.dim, expanded ? near * 0.82 : near),
      zIndex: near < 0.001 ? 2 : 1,
    };
  },

  layout(active, hoverT) {
    this.items.forEach((el, k) => {
      const compact = this.vars(active, k, false);
      const open = this.vars(active, k, true);
      gsap.set(el, {
        yPercent: -50,
        y: this.lerp(compact.y, open.y, hoverT),
        x: this.lerp(compact.x, open.x, hoverT),
        scale: this.lerp(compact.scale, open.scale, hoverT),
        color: gsap.utils.interpolate(compact.color, open.color, hoverT),
        zIndex: Math.abs(k - active) < 0.5 ? 2 : 1,
      });
    });
  },

  activeFromTime(t) {
    const st = ScrollTrigger.getAll()[0];
    const anim = st && st.animation;
    if (!anim || !anim.labels) return 0;
    const worksAt = anim.labels.works;
    const serviceAt = anim.labels.service;
    const contactAt = anim.labels.contact;
    if (worksAt == null) return 0;
    const homeDur = App.TIMING.homeToAbout;
    const trans = App.TIMING.pageDur;
    if (t < homeDur) return gsap.utils.mapRange(0, homeDur, 0, 1, t);
    if (t < worksAt) return 1;
    if (t < worksAt + trans) return gsap.utils.mapRange(worksAt, worksAt + trans, 1, 2, t);
    if (t < serviceAt) return 2;
    if (t < serviceAt + trans) return gsap.utils.mapRange(serviceAt, serviceAt + trans, 2, 3, t);
    if (t < contactAt) return 3;
    if (t < contactAt + trans) return gsap.utils.mapRange(contactAt, contactAt + trans, 3, 4, t);
    return 4;
  },

  update() {
    try {
      this.hover.t += (this.hover.target - this.hover.t) * 0.16;
      const st = ScrollTrigger.getAll()[0];
      const t = st && st.animation ? st.animation.time() : 0;
      this.layout(this.activeFromTime(t), this.hover.t);
    } catch (err) {}
  },

  bind() {
    this.root = document.getElementById("wheel");
    this.items = [...this.root.querySelectorAll(".wheel-item")];
    gsap.set(this.root, { x: 84, yPercent: -50, autoAlpha: 0 });
    this.layout(0, 0);

    const enter = () => { this.hover.target = 1; };
    const leave = () => { this.hover.target = 0; };
    this.root.addEventListener("pointerenter", enter);
    this.root.addEventListener("pointerleave", leave);
    this.root.addEventListener("mouseenter", enter);
    this.root.addEventListener("mouseleave", leave);
  },

  watch(timeline) {
    timeline.eventCallback("onUpdate", () => this.update());
    gsap.ticker.add(() => this.update());
  },
};
