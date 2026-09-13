window.App = window.App || {};

App.timeline = {
  build(prepared) {
    const T = App.TIMING;
    const aboutScore = document.getElementById("about-score");
    const aboutCopy = document.getElementById("about-copy");
    const worksPage = document.getElementById("works");
    const servicePage = document.getElementById("service");
    const contactPage = document.getElementById("contact");
    const wheel = document.getElementById("wheel");
    const canvas = document.getElementById("grid");
    const { frameLines, frameFills, flies, lineLens } = prepared;

    gsap.set([worksPage, servicePage, contactPage], { autoAlpha: 0 });
    gsap.set(aboutScore, { autoAlpha: 0, yPercent: -50 });
    gsap.set(aboutCopy, { autoAlpha: 0, yPercent: -50 });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (typeof ScrollSmoother !== "undefined" && !ScrollSmoother.get()) {
      ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: reduce ? 0 : 1.35,
        smoothTouch: 0.18,
        normalizeScroll: true,
        effects: false,
      });
    }

    const smoother = typeof ScrollSmoother !== "undefined" ? ScrollSmoother.get() : null;
    if (smoother) smoother.scrollTo(0, false);
    else window.scrollTo(0, 0);

    if (reduce) {
      frameLines.forEach((el, i) => gsap.set(el, { strokeDashoffset: 0, strokeDasharray: lineLens[i] }));
      gsap.set(frameFills, { autoAlpha: 1 });
      gsap.set(flies.map((f) => f.el), { x: 0, y: 0, scale: 1, autoAlpha: 1 });
      gsap.set(["#hero", "#hint", canvas], { autoAlpha: 0 });
      gsap.set(aboutCopy, { autoAlpha: 1, yPercent: -50, y: 0 });
      gsap.set(aboutScore, { autoAlpha: 1, yPercent: -50, y: -10 });
      gsap.set(wheel, { autoAlpha: 1, x: 0, yPercent: -50 });
      App.wheel.layout(1, 0);
      App.story = null;
      return null;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#stage",
        start: "top top",
        end: () => "+=" + Math.round(window.innerHeight * 11.2),
        pin: true,
        scrub: 0.55,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
    App.story = tl;

    tl.addLabel("home", 0);
    tl.fromTo("#hero", { y: 0, autoAlpha: 1 }, { y: -56, autoAlpha: 0, duration: T.pageDur, ease: "power2.in" }, 0);
    tl.fromTo("#hint", { autoAlpha: 1 }, { autoAlpha: 0, duration: T.pageDur, ease: "power2.in" }, 0);
    tl.fromTo(canvas, { autoAlpha: 1 }, {
      autoAlpha: 0,
      duration: T.pageDur,
      ease: "power2.in",
    }, 0);

    tl.fromTo(aboutScore, { autoAlpha: 0, yPercent: -50, y: 18 }, {
      autoAlpha: 1,
      yPercent: -50,
      y: -10,
      duration: T.pageDur,
      ease: "power2.out",
    }, T.pageInDelay);
    tl.fromTo(aboutCopy, { autoAlpha: 0, yPercent: -50, y: 22 }, {
      autoAlpha: 1,
      yPercent: -50,
      y: 0,
      duration: T.pageDur,
      ease: "power2.out",
    }, T.pageInDelay);
    tl.fromTo(wheel, { x: 84, yPercent: -50, autoAlpha: 0 }, {
      x: 0,
      yPercent: -50,
      autoAlpha: 1,
      duration: T.pageDur,
      ease: "power3.out",
    }, T.pageInDelay);

    tl.fromTo(frameLines, {
      strokeDashoffset: (i) => lineLens[i],
    }, {
      strokeDashoffset: 0,
      duration: T.staffDur,
      ease: "power2.inOut",
      stagger: { amount: T.staffStagger, from: "start" },
      immediateRender: false,
    }, T.pageInDelay);

    tl.fromTo(frameFills, { autoAlpha: 0 }, {
      autoAlpha: 1,
      duration: T.fillDur,
      stagger: 0.012,
      ease: "power2.out",
      immediateRender: false,
    }, T.fillAt);

    tl.fromTo(flies.map((f) => f.el), {
      x: (i) => flies[i].fromX,
      y: (i) => flies[i].fromY,
      scale: (i) => flies[i].fromScale,
      autoAlpha: 0,
    }, {
      x: 0,
      y: 0,
      scale: 1,
      autoAlpha: 1,
      duration: T.notesDur,
      ease: "power3.out",
      stagger: { amount: T.notesStagger, from: "start" },
      immediateRender: false,
      force3D: false,
    }, T.notesAt);

    tl.addLabel("aboutDone", T.aboutDone);
    tl.to({}, { duration: T.aboutHold });

    tl.addLabel("works");
    tl.to(aboutScore, { yPercent: -50, y: -58, autoAlpha: 0, duration: T.pageDur, ease: "power2.in" }, "works");
    tl.to(aboutCopy, { yPercent: -50, y: -48, autoAlpha: 0, duration: T.pageDur, ease: "power2.in" }, "works");
    tl.fromTo(worksPage, { y: 40, autoAlpha: 0 }, {
      y: 0,
      autoAlpha: 1,
      duration: T.pageDur,
      ease: "power2.out",
      immediateRender: false,
    }, "works+=" + T.pageInDelay);
    tl.addLabel("worksDone", "works+=" + T.pageDone);
    tl.to({}, { duration: T.pageHold });

    tl.addLabel("service");
    tl.to(worksPage, { y: -48, autoAlpha: 0, duration: T.pageDur, ease: "power2.in" }, "service");
    tl.fromTo(servicePage, { y: 40, autoAlpha: 0 }, {
      y: 0,
      autoAlpha: 1,
      duration: T.pageDur,
      ease: "power2.out",
      immediateRender: false,
    }, "service+=" + T.pageInDelay);
    tl.addLabel("serviceDone", "service+=" + T.pageDone);
    tl.to({}, { duration: T.pageHold });

    tl.addLabel("contact");
    tl.to(servicePage, { y: -48, autoAlpha: 0, duration: T.pageDur, ease: "power2.in" }, "contact");
    tl.fromTo(contactPage, { y: 40, autoAlpha: 0 }, {
      y: 0,
      autoAlpha: 1,
      duration: T.pageDur,
      ease: "power2.out",
      immediateRender: false,
    }, "contact+=" + T.pageInDelay);
    tl.addLabel("contactDone", "contact+=" + T.pageDone);
    tl.to({}, { duration: T.contactHold });

    App.wheel.watch(tl);

    const pageTimes = () => [
      0,
      tl.labels.aboutDone,
      tl.labels.worksDone,
      tl.labels.serviceDone,
      tl.labels.contactDone,
    ];

    function scrollToPage(i) {
      const st = tl.scrollTrigger;
      if (!st) return;
      const t = pageTimes()[i];
      const progress = t / tl.duration();
      const top = st.start + (st.end - st.start) * progress;
      const jump = {
        scrollTop: top,
        duration: 0.48,
        ease: "power3.inOut",
        overwrite: true,
      };
      if (smoother) gsap.to(smoother, jump);
      else gsap.to(document.scrollingElement || document.documentElement, jump);
    }

    App.wheel.items.forEach((el, i) => {
      el.addEventListener("click", () => scrollToPage(i));
    });

    requestAnimationFrame(() => {
      if (smoother) smoother.scrollTo(0, false);
      else window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return tl;
  },
};
