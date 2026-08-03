import { CanvasTexture, SRGBColorSpace } from "three";

const W = 1024;
const H = 704;

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
 * Key/well contrast is deliberately much wider than a photo of a real keyboard.
 * The deck is seen at a shallow angle, so ~700px of texture height compresses
 * into ~120 screen pixels and the mip chain averages the key grid away — at
 * realistic contrast the whole well collapses into one flat slab. Pushing the
 * caps light and the grout near-black keeps the rhythm alive through the
 * minification.
 */
function key(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = "#3b3b45";
  roundRect(ctx, x, y, w, h, 6);
  ctx.fill();
  // A single lit top edge. Individual keycaps are only ~50px here, so a
  // gradient reads as mud — one bright line is what makes them look raised.
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 5, y + 1.5);
  ctx.lineTo(x + w - 5, y + 1.5);
  ctx.stroke();
}

/**
 * The base's top face: milled aluminium with a recessed keyboard and trackpad.
 *
 * A texture rather than geometry — a real key grid is 60-odd meshes and this is
 * seen edge-on at a shallow angle, where the only things that survive are the
 * dark well, the key rhythm, and the trackpad outline.
 *
 * `body` should match the base mesh colour so the plane's border disappears
 * into it. The texture's +v axis maps to the hinge end of the base, so the
 * keyboard is drawn at the top of the canvas and the trackpad below it.
 */
export function createDeckTexture(body: string) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = body;
  ctx.fillRect(0, 0, W, H);

  // ── Keyboard well ────────────────────────────────────────────────────────
  const wellX = 88;
  const wellY = 58;
  const wellW = W - wellX * 2;
  const wellH = 348;
  ctx.fillStyle = "#0d0d11";
  roundRect(ctx, wellX, wellY, wellW, wellH, 10);
  ctx.fill();

  const inset = 16;
  const cols = 14;
  const gap = 6;
  const keyW = (wellW - inset * 2 - gap * (cols - 1)) / cols;
  const left = wellX + inset;

  // Function row is half height, like every laptop keyboard.
  const rowHeights = [34, 56, 56, 56, 56];
  let rowY = wellY + inset;

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
      const unitW = (wellW - inset * 2 - gap * (units.length - 1)) / total;
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
  const padW = 330;
  const padH = 216;
  const padX = (W - padW) / 2;
  const padY = 442;
  ctx.fillStyle = "#25252c";
  roundRect(ctx, padX, padY, padW, padH, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 2.5;
  roundRect(ctx, padX, padY, padW, padH, 12);
  ctx.stroke();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
