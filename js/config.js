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
  pageDur: 0.85,
  pageInDelay: 0.2,
  staffDur: 0.62,
  staffStagger: 0.2,
  fillDur: 0.27,
  notesDur: 0.09,
  notesStagger: 0.61,
  aboutHold: 0.5,
  pageHold: 0.75,
  contactHold: 0.9,
};

App.TIMING.pageDone = App.TIMING.pageInDelay + App.TIMING.pageDur;
App.TIMING.heroDur = App.TIMING.pageDur;
App.TIMING.hintDur = App.TIMING.pageDur;
App.TIMING.aboutAt = App.TIMING.pageInDelay;
App.TIMING.aboutDur = App.TIMING.pageDur;
App.TIMING.copyAt = App.TIMING.pageInDelay;
App.TIMING.copyDur = App.TIMING.pageDur;
App.TIMING.fillAt = App.TIMING.pageInDelay;
App.TIMING.notesAt = App.TIMING.pageDone;
App.TIMING.homeToAbout = App.TIMING.pageDone;
App.TIMING.aboutDone = App.TIMING.notesAt + App.TIMING.notesStagger + App.TIMING.notesDur;

App.GALLERY = {
  scale: [1, 0.555, 0.405],
  opacity: [1, 0.52, 0.32],
  peek: 1 / 3,
  gap: 32,
  dur: 0.58,
  copyDur: 0.42,
  copyOverlap: 0.5,
  panStep: 72,
};

App.ERA = {
  dotGap: 22,
  endPad: 48,
  openDur: 0.58,
  lineDur: 0.78,
  closeDur: 0.48,
};

App.INTRO = {
  minDur: 1,
  hold: 0.88,
  creepDur: 12,
  finishDur: 0.22,
  wipeDur: 0.92,
  wipeAngle: 20,
};

App.GRID = {
  gap: 28,
  tiltDeg: 15,
  wavePeriod: 3,
  waveAmp: 5.2,
  waveLen: 980,
  dotHi: 0.32,
  dotLo: 0.2,
  line: 0.07,
  waveAlpha: 0.18,
  nearDim: 0.1,
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
