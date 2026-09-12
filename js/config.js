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
  heroDur: 0.7,
  hintDur: 0.32,
  aboutAt: 0.12,
  aboutDur: 0.74,
  copyAt: 0.26,
  copyDur: 0.7,
  staffDur: 0.88,
  staffStagger: 0.28,
  fillAt: 0.38,
  fillDur: 0.38,
  notesAt: 0.8,
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

App.WHEEL = {
  count: 5,
  yGap: { compact: 56, open: 50 },
  curve: { compact: 7, open: 2.8 },
  scaleHi: { compact: 1.12, open: 1.02 },
  scaleLo: { compact: 0.72, open: 0.9 },
  ink: "#161616",
  dim: "#7a7a7a",
};
