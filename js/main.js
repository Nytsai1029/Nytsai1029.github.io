window.App = window.App || {};

App.boot = function () {
  if (typeof gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Observer);
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  document.querySelectorAll(".hero-links a").forEach((a) => {
    a.addEventListener("click", (event) => event.preventDefault());
  });

  App.i18n.init();
  App.theme.init();
  App.grid.start();
  App.wheel.bind();
  App.works.init();
  App.era.init();
  App.lang.bind();

  const prepared = App.score.prepare();
  if (!prepared) return;
  App.timeline.build(prepared);
};

App.boot();
