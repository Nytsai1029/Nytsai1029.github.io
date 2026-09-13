window.App = window.App || {};

App.intro = {
  start() {
    const root = document.getElementById("intro");
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      this.release(root);
      return;
    }

    const line = root.querySelector(".intro-line");
    const bar = root.querySelector(".intro-bar");
    const fill = root.querySelector(".intro-bar-fill");
    const minDur = App.INTRO.minDur;
    const started = performance.now();
    const proxy = { v: 0 };
    let tween;
    let ready = false;

    const block = (event) => event.preventDefault();
    root.addEventListener("wheel", block, { passive: false });
    root.addEventListener("touchmove", block, { passive: false });

    const smoother = typeof ScrollSmoother !== "undefined" ? ScrollSmoother.get() : null;
    if (smoother) smoother.paused(true);

    gsap.set(fill, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(line, { autoAlpha: 0 });

    const setBar = (value, duration, ease) => {
      if (tween) tween.kill();
      tween = gsap.to(proxy, {
        v: value,
        duration,
        ease,
        onUpdate: () => gsap.set(fill, { scaleX: proxy.v }),
      });
      return tween;
    };

    setBar(App.INTRO.hold, minDur, "power1.out");

    gsap.delayedCall(minDur, () => {
      if (!ready) setBar(0.97, App.INTRO.creepDur, "none");
    });

    const waitLoad = () => {
      if (document.readyState === "complete") return Promise.resolve();
      return new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));
    };

    const waitFonts = () => {
      if (!document.fonts || !document.fonts.ready) return Promise.resolve();
      return document.fonts.ready.catch(() => {});
    };

    const timeout = new Promise((resolve) => setTimeout(resolve, 8000));

    Promise.race([Promise.all([waitLoad(), waitFonts()]), timeout]).then(() => {
      ready = true;
      const elapsed = (performance.now() - started) / 1000;
      const duration = elapsed < minDur ? minDur - elapsed : App.INTRO.finishDur;
      setBar(1, duration, "power2.inOut");
      tween.eventCallback("onComplete", () => this.wipe(root, line, bar, smoother));
    });
  },

  wipe(root, line, bar, smoother) {
    const panel = root.querySelector(".intro-panel");
    const angle = App.INTRO.wipeAngle;
    const rad = (angle * Math.PI) / 180;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const skew = h * Math.tan(rad);
    const proxy = { x: 0 };

    const apply = () => {
      const topX = proxy.x;
      gsap.set(panel, {
        clipPath: `polygon(${topX}px 0px, 150% 0px, 150% 100%, ${topX - skew}px 100%)`,
      });
      gsap.set(line, { x: topX, y: 0 });
    };

    const tl = gsap.timeline({
      onComplete: () => this.release(root, smoother),
    });

    tl.to(bar, { autoAlpha: 0, duration: 0.2, ease: "power2.out" });
    tl.add(() => {
      gsap.set(root, { backgroundColor: "transparent" });
      gsap.set(line, {
        autoAlpha: 1,
        width: 1,
        height: h / Math.cos(rad) + 48,
        rotation: angle,
        transformOrigin: "0% 0%",
        x: 0,
        y: 0,
      });
      apply();
    });
    tl.to(proxy, {
      x: w + skew,
      duration: App.INTRO.wipeDur,
      ease: "power3.inOut",
      onUpdate: apply,
    });
  },

  release(root, smoother) {
    if (smoother) smoother.paused(false);
    document.documentElement.classList.remove("intro-lock");
    if (root) root.remove();
  },
};
