import { CanvasTexture, SRGBColorSpace } from "three";

const W = 1024;
const H = 704;

// Deck layout, in texture space. +v maps to the hinge end of the base, so the
// keyboard is drawn at the top of the canvas and the palm rest below it.
const WELL = { x: 168, y: 52, w: 688, h: 344 };
const GRILLE = { w: 82, h: 330, inset: 62 };
const PAD = { w: 306, h: 214, y: 434 };

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/**
 * A single keycap.
 *
 * Three passes, because a flat rectangle is what made the old keyboard read as
 * a painted-on grid: the near-black socket it sits in, the cap itself carrying
 * a top-lit vertical gradient, and a bright top lip. The lip is what actually
 * sells the height — it is the only cue that survives once the mip chain
 * compresses ~700px of texture into ~120 screen pixels at this viewing angle.
 */
function key(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = "#08080b";
  roundRect(ctx, x, y, w, h, 5);
  ctx.fill();

  const cap = ctx.createLinearGradient(0, y, 0, y + h);
  cap.addColorStop(0, "#52525e");
  cap.addColorStop(0.45, "#3d3d47");
  cap.addColorStop(1, "#2b2b33");
  ctx.fillStyle = cap;
  roundRect(ctx, x + 1.5, y + 1, w - 3, h - 3, 4.5);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + 6, y + 2.2);
  ctx.lineTo(x + w - 6, y + 2.2);
  ctx.stroke();
}

/** Perforated speaker strip — the detail that most reads as "a real machine". */
function grille(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const step = 9;
  const r = 2.1;
  ctx.fillStyle = "rgba(0,0,0,0.42)";
  for (let gy = y + step; gy < y + h - step; gy += step) {
    // Offset alternate rows so the perforation reads as a milled hex-ish field
    // rather than a screen-door grid, which aliases badly at a distance.
    const odd = Math.round((gy - y) / step) % 2;
    for (let gx = x + step / 2 + (odd ? step / 2 : 0); gx < x + w - step / 2; gx += step) {
      ctx.beginPath();
      ctx.arc(gx, gy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/**
 * The base's top face: milled aluminium with a recessed keyboard, speaker
 * grilles and a trackpad.
 *
 * A texture rather than geometry — a real key grid is 60-odd meshes and this is
 * seen edge-on at a shallow angle, where the only things that survive are the
 * dark well, the key rhythm, and the trackpad outline.
 *
 * Everything recessed is drawn with an inner shadow along its top edge and a
 * bright lip along its bottom edge. That single convention is what separates
 * "cut into the metal" from "printed on top of it", which is how the previous
 * version read: the well and trackpad were flat rectangles lying on the
 * surface with no depth cue at all.
 *
 * `body` should match the base mesh colour so the plane's border disappears
 * into it.
 */
export function createDeckTexture(body: string) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // ── Palm rest ────────────────────────────────────────────────────────────
  ctx.fillStyle = body;
  ctx.fillRect(0, 0, W, H);

  // Occlusion from the open lid. The deck nearest the hinge sits in the lid's
  // shadow and the front lip catches the most light; without this the whole
  // panel renders as one flat tone, which was the single biggest reason the
  // chassis looked like matte plastic rather than metal.
  const wash = ctx.createLinearGradient(0, 0, 0, H);
  wash.addColorStop(0, "rgba(0,0,0,0.40)");
  wash.addColorStop(0.26, "rgba(0,0,0,0.12)");
  wash.addColorStop(0.68, "rgba(255,255,255,0.06)");
  // Falls back off at the very bottom: a bright edge here met the chassis
  // chamfer as a visible seam across the front of the deck.
  wash.addColorStop(0.93, "rgba(255,255,255,0.13)");
  wash.addColorStop(1, "rgba(255,255,255,0.04)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, W, H);

  // Brushed grain. Aluminium is milled, and at any distance the giveaway is a
  // fine directional grain rather than a perfectly even surface — without it
  // the palm rest renders as flat painted card no matter how the gradient is
  // tuned. Deterministic spacing, alternating polarity, and far below the
  // threshold where it reads as individual lines.
  for (let y = 0; y < H; y += 3) {
    ctx.fillStyle = y % 6 === 0 ? "rgba(255,255,255,0.028)" : "rgba(0,0,0,0.022)";
    ctx.fillRect(0, y, W, 1);
  }

  // Very slight darkening toward the left and right edges, so the surface
  // curves away instead of ending flat.
  const vignette = ctx.createLinearGradient(0, 0, W, 0);
  vignette.addColorStop(0, "rgba(0,0,0,0.16)");
  vignette.addColorStop(0.5, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.16)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  // ── Speaker grilles ──────────────────────────────────────────────────────
  grille(ctx, GRILLE.inset, WELL.y + 8, GRILLE.w, GRILLE.h);
  grille(ctx, W - GRILLE.inset - GRILLE.w, WELL.y + 8, GRILLE.w, GRILLE.h);

  // ── Keyboard well ────────────────────────────────────────────────────────
  ctx.fillStyle = "#0b0b0f";
  roundRect(ctx, WELL.x, WELL.y, WELL.w, WELL.h, 12);
  ctx.fill();

  // Inner shadow at the top of the recess, bright lip at the bottom.
  ctx.save();
  roundRect(ctx, WELL.x, WELL.y, WELL.w, WELL.h, 12);
  ctx.clip();
  const wellShade = ctx.createLinearGradient(0, WELL.y, 0, WELL.y + 26);
  wellShade.addColorStop(0, "rgba(0,0,0,0.85)");
  wellShade.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = wellShade;
  ctx.fillRect(WELL.x, WELL.y, WELL.w, 26);
  ctx.restore();
  ctx.strokeStyle = "rgba(255,255,255,0.20)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(WELL.x + 14, WELL.y + WELL.h - 1);
  ctx.lineTo(WELL.x + WELL.w - 14, WELL.y + WELL.h - 1);
  ctx.stroke();

  const inset = 14;
  const cols = 14;
  const gap = 5;
  const keyW = (WELL.w - inset * 2 - gap * (cols - 1)) / cols;
  const left = WELL.x + inset;

  // Function row is half height, like every laptop keyboard.
  const rowHeights = [30, 58, 58, 58, 58];
  let rowY = WELL.y + inset;

  for (let row = 0; row < rowHeights.length; row++) {
    const h = rowHeights[row];
    if (row < rowHeights.length - 1) {
      for (let col = 0; col < cols; col++) {
        key(ctx, left + col * (keyW + gap), rowY, keyW, h);
      }
    } else {
      // Bottom row: modifiers around a space bar. Widths are in key units so
      // the row lines up with the grid above it.
      const units = [1.5, 1.25, 1.25, 6.5, 1.25, 1.25, 1];
      const total = units.reduce((a, b) => a + b, 0);
      const unitW = (WELL.w - inset * 2 - gap * (units.length - 1)) / total;
      let x = left;
      for (const u of units) {
        const w = unitW * u;
        key(ctx, x, rowY, w, h);
        x += w + gap;
      }
    }
    rowY += h + gap;
  }

  // ── Trackpad ─────────────────────────────────────────────────────────────
  const padX = (W - PAD.w) / 2;
  const surface = ctx.createLinearGradient(0, PAD.y, 0, PAD.y + PAD.h);
  surface.addColorStop(0, "#1f1f26");
  surface.addColorStop(1, "#2b2b34");
  ctx.fillStyle = surface;
  roundRect(ctx, padX, PAD.y, PAD.w, PAD.h, 14);
  ctx.fill();

  ctx.save();
  roundRect(ctx, padX, PAD.y, PAD.w, PAD.h, 14);
  ctx.clip();
  const padShade = ctx.createLinearGradient(0, PAD.y, 0, PAD.y + 18);
  padShade.addColorStop(0, "rgba(0,0,0,0.7)");
  padShade.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = padShade;
  ctx.fillRect(padX, PAD.y, PAD.w, 18);
  ctx.restore();

  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padX + 12, PAD.y + PAD.h - 1);
  ctx.lineTo(padX + PAD.w - 12, PAD.y + PAD.h - 1);
  ctx.stroke();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
