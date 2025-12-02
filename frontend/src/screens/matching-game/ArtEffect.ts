// src/utils/createSciFiBox.ts
import Konva from "konva";

/**
 * Creates a sci-fi / neon-glow box
 * @param x - X position
 * @param y - Y position
 * @param size - Width & height (default 200)
 * @returns Konva.Rect with pulsing neon glow
 */
export function createNeonMetalBox(
  x: number,
  y: number,
  size: number = 200
): Konva.Rect {
  const box = new Konva.Rect({
    x,
    y,
    width: size,
    height: size,
    cornerRadius: 16,
    listening: true,
  });

  // 1. Brushed metal fill
  box.fillLinearGradientStartPoint({ x: 0, y: 0 });
  box.fillLinearGradientEndPoint({ x: size, y: size });
  box.fillLinearGradientColorStops([
    0,    "#b8c4d8",
    0.2,  "#e0e8f5",
    0.5,  "#7888b0",
    0.8,  "#d0d8eb",
    1,    "#b8c4d8",
  ]);

  // 2. Deep metal shadow (3D depth)
  box.shadowColor("rgba(0,0,0,0.9)");
  box.shadowBlur(15);
  box.shadowOffset({ x: 6, y: 6 });
  box.shadowOpacity(0.8);

  // 3. Polished top-left shine
  box.fillPriority("linear-gradient"); // ensures gradient + pattern work together

  // 4. NEON GLOW — the star of the show
  box.stroke("#00ffff");
  box.strokeWidth(8);
  box.shadowColor("#00ffff");
  box.shadowBlur(40);
  box.shadowOpacity(0.95);
  box.shadowOffset({ x: 0, y: 0 });

  // 5. Pulsing neon heartbeat animation
  new Konva.Tween({
    node: box,
    duration: 2.2 + Math.random() * 0.8,
    shadowBlur: 65,
    easing: Konva.Easings.EaseInOut,
    yoyo: true,
    repeat: -1,
  }).play();

  // 6. Hover effect: panel lifts + neon flares brighter
  box.on("mouseenter", () => {
    box.shadowOffset({ x: 10, y: 10 });
    box.shadowBlur(30);
    new Konva.Tween({
      node: box,
      duration: 0.3,
      shadowBlur: 90,
      shadowOpacity: 1,
    }).play();
    box.getLayer()?.batchDraw();
  });

  box.on("mouseleave", () => {
    box.shadowOffset({ x: 6, y: 6 });
    box.shadowBlur(15);
    new Konva.Tween({
      node: box,
      duration: 0.6,
      shadowBlur: 40,
      shadowOpacity: 0.95,
    }).play();
    box.getLayer()?.batchDraw();
  });

  return box;
}

/**
 * Creates a planet box
 * @param x - X position
 * @param y - Y position
 * @param size - Width & height (default 200)
 * @returns Konva.Rect with cloud
 */
export function createPlanetBox(
  x: number,
  y: number,
  size: number = 200
): Konva.Rect {
  const box = new Konva.Rect({
    x,
    y,
    width: size,
    height: size,
    cornerRadius: 16,
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowBlur: 30,
    shadowOffset: { x: 10, y: 10 },
    shadowOpacity: 0.5,
    listening: false,
  });

  box.sceneFunc((ctx, shape) => {
    const w = shape.width();
    const h = shape.height();

    // ── Corner radius handling ──
    const raw = shape.cornerRadius();
    let tl = 0, tr = 0, br = 0, bl = 0;
    if (typeof raw === 'number') {
      tl = tr = br = bl = raw;
    } else {
      [tl, tr, br, bl] = raw as number[];
    }

    // ── Draw rounded rectangle ──
    ctx.beginPath();
    ctx.moveTo(tl, 0);
    ctx.lineTo(w - tr, 0);
    ctx.quadraticCurveTo(w, 0, w, tr);
    ctx.lineTo(w, h - br);
    ctx.quadraticCurveTo(w, h, w - br, h);
    ctx.lineTo(bl, h);
    ctx.quadraticCurveTo(0, h, 0, h - bl);
    ctx.lineTo(0, tl);
    ctx.quadraticCurveTo(0, 0, tl, 0);
    ctx.closePath();

    // ── 1. Dirt fill ──
    const dirtGrad = ctx.createLinearGradient(0, 0, w * 0.8, h);
    dirtGrad.addColorStop(0,    '#4E342E');
    dirtGrad.addColorStop(0.3,  '#5D4037');
    dirtGrad.addColorStop(0.55, '#8D6E63');
    dirtGrad.addColorStop(0.75, '#A1887F');
    dirtGrad.addColorStop(0.9,  '#6D4C41');
    dirtGrad.addColorStop(1,    '#5D4037');
    ctx.fillStyle = dirtGrad;
    ctx.fill();

    // Subtle soil texture
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 220; i++) {
      const sx = Math.random() * w;
      const sy = Math.random() * h;
      ctx.fillStyle = Math.random() > 0.5 ? '#3E2723' : '#BCAAA4';
      ctx.fillRect(sx, sy, 1 + Math.random() * 2.5, 1 + Math.random() * 2.5);
    }
    ctx.globalAlpha = 1;

    // ── 2. Grass stroke ──
    ctx.lineWidth = 21;
    ctx.strokeStyle = '#2E7D32';
    ctx.stroke();

    ctx.lineWidth = 13;
    ctx.strokeStyle = '#66BB6A';
    ctx.globalAlpha = 0.85;
    ctx.stroke();

    ctx.lineWidth = 9;
    ctx.strokeStyle = '#C8E6C9';
    ctx.globalAlpha = 0.75;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // ── 3. TWO STATIC CLOUDS (top-right & bottom-right) with fade animation ──
    const topCloudOpacity = 0.7;    
    const bottomCloudOpacity = 0.7; 

    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
    ctx.shadowBlur = 20;

    // Helper to draw a fluffy cloud
    const drawCloud = (cx: number, cy: number, scale: number, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(cx, cy);
      ctx.scale(scale, scale * 0.75);

      ctx.beginPath();
      ctx.moveTo(-30, 0);
      ctx.bezierCurveTo(-45, -18, -38, -35, -15, -32);
      ctx.bezierCurveTo(-5,  -42,  12, -36,  20, -26);
      ctx.bezierCurveTo(42,  -30,  52, -10,  38, 8);
      ctx.bezierCurveTo(48,  22,  28, 34,   6, 28);
      ctx.bezierCurveTo(-20, 38, -42, 22, -30, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Top-right cloud
    drawCloud(
      w  - 180,        // x position (near right edge)
      50,            // y position (top area)
      1.1,
      topCloudOpacity
    );

    // Bottom-right cloud
    drawCloud(
      w - 60,
      h - 30,
      1.3,
      bottomCloudOpacity
    );

    ctx.shadowBlur = 0;
  });

  box.cache();
  return box;
}

/**
 * Fiery flame blow-up effect — hot, organic, and beautiful
 */
export function flameBlowUp(
  x: number,
  y: number,
  stage: Konva.Stage
): void {
  const layer = stage.getLayers()[0];

  const flames: Konva.Shape[] = [];

  // Create 8–12 flame "tendrils"
  const count = 9 + Math.floor(Math.random() * 4);

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
    const speed = 180 + Math.random() * 220;
    const hue = 10 + Math.random() * 30; // red → orange → yellow

    const flame = new Konva.Path({
      data: makeFlameShape(),
      fillRadialGradientStartPoint: { x: 0, y: 0 },
      fillRadialGradientEndPoint: { x: 0, y: 0 },
      fillRadialGradientStartRadius: 5,
      fillRadialGradientEndRadius: 60,
      fillRadialGradientColorStops: [
        0,    `hsl(${hue}, 100%, 70%)`,     // bright core
        0.4,  `hsl(${hue + 10}, 100%, 60%)`,
        0.8,  `hsl(${hue + 20}, 90%, 50%)`,
        1,    'rgba(255, 100, 0, 0)',       // fade to transparent
      ],
      shadowColor: `hsl(${hue}, 100%, 60%)`,
      shadowBlur: 30,
      shadowOpacity: 0.9,
      x,
      y,
      offset: { x: 0, y: 30 }, // draw from base
      scaleY: 0.3 + Math.random() * 0.6,
      rotation: (angle * 180) / Math.PI,
    });

    layer.add(flame);
    flames.push(flame);

    // Animate each flame tongue
    new Konva.Animation((frame) => {
      if (!frame) return false;
      const t = frame.time / 1000;

      const progress = t * 1.8;
      if (progress > 1) {
        flame.destroy();
        return false;
      }

      // Stretch upward and outward
      flame.y(y + speed * t * Math.sin(angle));
      flame.x(x + speed * t * Math.cos(angle));

      // Grow tall then shrink
      const grow = Math.sin(progress * Math.PI); // 0 → 1 → 0
      flame.scaleY(grow * (1.5 + Math.random()));
      flame.scaleX(grow * 0.8);

      // Fade + cool down (turn to smoke)
      const opacity = 1 - progress;
      flame.opacity(opacity);
      flame.shadowBlur(30 * opacity);

      // Color shift: hot → dark → smoke
      if (progress > 0.6) {
        flame.fillRadialGradientColorStops([
          0, `hsla(${hue}, 80%, 50%, ${opacity})`,
          1, `rgba(80, 40, 20, ${opacity * 0.4})`,
        ]);
      }
    }, layer).start();
  }

  // Optional: Add a quick flash core
  const core = new Konva.Circle({
    x, y, radius: 10,
    fill: 'white',
    shadowColor: 'yellow',
    shadowBlur: 60,
  });
  layer.add(core);

  new Konva.Tween({
    node: core,
    duration: 0.15,
    radius: 80,
    opacity: 0,
    shadowBlur: 100,
    easing: Konva.Easings.EaseOut,
    onFinish: () => core.destroy(),
  }).play();
}

// Helper: creates a single flame tongue shape (like a teardrop)
function makeFlameShape(): string {
  return [
    'M', -15, 30,
    'Q', -25, -20, 0, -50,
    'Q', 25, -20, 15, 30,
    'Q', 8, 50, 0, 40,
    'Q', -8, 50, -15, 30,
    'Z'
  ].join(' ');
}