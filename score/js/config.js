window.App = window.App || {};

App.NS = "http://www.w3.org/2000/svg";

App.FRAME = new Set([
  "StaffLines",
  "Bracket",
  "BarLine",
  "KeySig",
  "MeasureNumber",
  "Clef",
]);

App.TIMING = {
  heroDur: 0.49,
  hintDur: 0.22,
  aboutAt: 0.08,
  aboutDur: 0.52,
  copyAt: 0.18,
  copyDur: 0.49,
  staffDur: 0.62,
  staffStagger: 0.2,
  fillAt: 0.27,
  fillDur: 0.27,
  notesAt: 0.56,
  notesDur: 0.95,
  notesStagger: 6.4,
  aboutHold: 0.5,
  pageDur: 0.85,
  pageInDelay: 0.2,
  pageHold: 0.75,
  contactHold: 0.9,
};

App.TIMING.aboutDone = App.TIMING.notesAt + App.TIMING.notesStagger + App.TIMING.notesDur;
App.TIMING.pageDone = App.TIMING.pageInDelay + App.TIMING.pageDur;
App.TIMING.homeToAbout = App.TIMING.aboutAt + App.TIMING.aboutDur;

App.GALLERY = {
  scale: [1, 0.555, 0.405],
  opacity: [1, 0.52, 0.32],
  peek: 1 / 3,
  gap: 32,
  dur: 0.58,
  copyDur: 0.42,
  copyOverlap: 0.5,
};

App.INTRO = {
  minDur: 1,
  hold: 0.88,
  creepDur: 12,
  finishDur: 0.22,
  wipeDur: 0.92,
  wipeAngle: 20,
};

App.WHEEL = {
  count: 5,
  yGap: { compact: 56, open: 50 },
  curve: { compact: 3, open: 2.8 },
  scaleHi: { compact: 1.12, open: 1.02 },
  scaleLo: { compact: 0.72, open: 0.9 },
  ink: "#161616",
  dim: "#7a7a7a",
};
