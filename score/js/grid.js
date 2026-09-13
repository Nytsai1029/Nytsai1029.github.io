window.App = window.App || {};

App.mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
  tx: innerWidth / 2,
  ty: innerHeight / 2,
};

App.grid = {
  canvas: null,
  ctx: null,

  start() {
    this.canvas = document.getElementById("grid");
    this.ctx = this.canvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("pointermove", (e) => {
      App.mouse.tx = e.clientX;
      App.mouse.ty = e.clientY;
    }, { passive: true });
    requestAnimationFrame((time) => this.draw(time));
  },

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = innerWidth * dpr;
    this.canvas.height = innerHeight * dpr;
    this.canvas.style.width = innerWidth + "px";
    this.canvas.style.height = innerHeight + "px";
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  },

  visible() {
    const raw = gsap.getProperty(this.canvas, "opacity");
    const opacity = raw === "" || raw == null ? 1 : Number(raw);
    return opacity > 0.02 && this.canvas.style.visibility !== "hidden";
  },

  draw(time) {
    requestAnimationFrame((next) => this.draw(next));
    const mouse = App.mouse;
    mouse.x += (mouse.tx - mouse.x) * 0.1;
    mouse.y += (mouse.ty - mouse.y) * 0.1;

    const ctx = this.ctx;
    if (!this.visible()) {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      return;
    }

    ctx.clearRect(0, 0, innerWidth, innerHeight);

    const gap = 28;
    const cols = Math.ceil(innerWidth / gap) + 1;
    const rows = Math.ceil(innerHeight / gap) + 1;
    const t = (time || 0) * 0.00025;
    const radius = Math.min(innerWidth, innerHeight) * 0.34;

    ctx.strokeStyle = "rgba(18, 18, 18, 0.045)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < cols; i++) {
      ctx.moveTo(i * gap, 0);
      ctx.lineTo(i * gap, innerHeight);
    }
    for (let j = 0; j < rows; j++) {
      ctx.moveTo(0, j * gap);
      ctx.lineTo(innerWidth, j * gap);
    }
    ctx.stroke();

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * gap;
        let y = j * gap;
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const influence = Math.max(0, 1 - dist / radius);
        const eased = influence * influence * (3 - 2 * influence);
        const angle = Math.atan2(dy, dx) || 0;
        x += Math.cos(angle) * eased * 18;
        y += Math.sin(angle) * eased * 18;

        const major = i % 4 === 0 || j % 4 === 0;
        const shimmer = 0.84 + 0.16 * Math.sin(t + i * 0.35 + j * 0.41);
        const alpha = (major ? 0.22 : 0.12) * shimmer + eased * 0.62;
        const size = (major ? 1.7 : 1.25) + eased * 2.1;

        ctx.fillStyle = `rgba(18, 18, 18, ${alpha})`;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
    }
  },
};
