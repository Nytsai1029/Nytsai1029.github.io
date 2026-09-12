window.App = window.App || {};

App.boot = function () {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  document.querySelectorAll(".hero-links a").forEach((a) => {
    a.addEventListener("click", (event) => event.preventDefault());
  });

  App.grid.start();
  App.wheel.bind();

  const prepared = App.score.prepare();
  if (!prepared) return;
  App.timeline.build(prepared);
};

App.boot();
