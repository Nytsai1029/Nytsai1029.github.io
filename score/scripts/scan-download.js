#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "download");
const OUT = path.join(__dirname, "..", "js", "download-data.js");
const ROOT_ORDER = ["scores", "audio", "midi"];
const SKIP = new Set([".DS_Store", "Thumbs.db"]);

function kindOf(name) {
  const ext = path.extname(name).replace(".", "").toLowerCase();
  if (ext === "pdf") return "pdf";
  if (ext === "mid" || ext === "midi") return "midi";
  if (/^(wav|mp3|aiff|aif|flac|m4a|ogg|aac)$/.test(ext)) return "audio";
  return "file";
}

function sortNodes(nodes) {
  const rank = (name) => {
    const i = ROOT_ORDER.indexOf(name);
    return i === -1 ? ROOT_ORDER.length : i;
  };
  return nodes.slice().sort((a, b) => {
    if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
    const ra = rank(a.name);
    const rb = rank(b.name);
    if (ra !== rb) return ra - rb;
    return a.name.localeCompare(b.name, "en");
  });
}

function walk(dir, rel) {
  const names = fs.readdirSync(dir).filter((name) => !SKIP.has(name) && !name.startsWith("."));
  const nodes = names.map((name) => {
    const abs = path.join(dir, name);
    const fileRel = rel ? rel + "/" + name : name;
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      return {
        name,
        type: "dir",
        children: walk(abs, fileRel),
      };
    }
    return {
      name,
      type: "file",
      kind: kindOf(name),
      ext: path.extname(name).replace(".", "").toLowerCase(),
      path: "download/" + fileRel,
      bytes: stat.size,
    };
  });
  return sortNodes(nodes);
}

if (!fs.existsSync(ROOT)) {
  console.error("missing download/");
  process.exit(1);
}

const tree = walk(ROOT, "");
const body =
  "window.App = window.App || {};\n\n" +
  "// Generated from download/ by scripts/scan-download.js\n" +
  "App.DOWNLOAD = " +
  JSON.stringify({ root: "download", tree }, null, 2) +
  ";\n";

fs.writeFileSync(OUT, body);
console.log("wrote", path.relative(path.join(__dirname, ".."), OUT), "(" + tree.length + " roots)");
