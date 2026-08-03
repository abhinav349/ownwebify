import { CanvasTexture, SRGBColorSpace } from "three";

export type SiteMock = {
  name: string;
  type: string;
  tagline: string;
  cta: string;
  accent: string;
  photo: string;
  nav: string[];
};

/**
 * Screen resolution of the drawn mock. 16:10 to match the lid geometry. This is
 * the texture size, not a DOM size — 1200px wide keeps 14px nav text legible
 * once the screen occupies roughly a third of a 1440px viewport, and anything
 * larger is spent on pixels the perspective throws away.
 */
const W = 1200;
const H = 750;

const DWELL = 3.4;
const TRANSITION = 0.85;

const CARD_LINES = [0.75, 0.45] as const;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Cover-fit, matching CSS `object-fit: cover` — crops rather than distorts. */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const target = w / h;
  const source = img.width / img.height;
  let sw = img.width;
  let sh = img.height;
  let sx = 0;
  let sy = 0;
  if (source > target) {
    sw = img.height * target;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / target;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

/**
 * Paints a plausible marketing site — nav, photo hero, headline, CTA, card row.
 *
 * The mock is always dark regardless of the page theme. A screen is an emitter,
 * so it should read brighter than whatever surrounds it; a light mock in light
 * mode makes the lid look like a sheet of white card rather than a display, and
 * dark UI is also what makes the accent colour register at this size.
 */
function drawMock(
  ctx: CanvasRenderingContext2D,
  site: SiteMock,
  photo: HTMLImageElement | null
) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#08080c";
  ctx.fillRect(0, 0, W, H);

  const pad = 56;
  const navH = 60;

  // ── Nav ────────────────────────────────────────────────────────────────
  ctx.fillStyle = site.accent;
  ctx.beginPath();
  ctx.arc(pad + 8, navH / 2, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 19px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(site.name, pad + 26, navH / 2 + 1);

  const ctaW = 118;
  const ctaX = W - pad - ctaW;
  ctx.font = "500 14px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  // Right-to-left so the link run always ends flush against the CTA pill,
  // whatever the label widths happen to be.
  let linkX = ctaX - 34;
  for (let i = site.nav.length - 1; i >= 0; i--) {
    const label = site.nav[i];
    linkX -= ctx.measureText(label).width;
    ctx.fillText(label, linkX, navH / 2 + 1);
    linkX -= 30;
  }

  ctx.fillStyle = site.accent;
  roundRect(ctx, ctaX, navH / 2 - 16, ctaW, 32, 16);
  ctx.fill();
  ctx.fillStyle = "#0a0a0f";
  ctx.font = "600 13px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(site.cta, ctaX + ctaW / 2, navH / 2 + 1);
  ctx.textAlign = "left";

  // ── Hero ───────────────────────────────────────────────────────────────
  const heroY = navH;
  const heroH = 400;
  if (photo) {
    drawCover(ctx, photo, 0, heroY, W, heroH);
  } else {
    // Loading (or failed) state: a flat accent-tinted panel. Never a blank
    // hole — the texture is uploaded before the photo resolves, and on a
    // slow connection this is what the screen shows as the lid opens.
    ctx.fillStyle = "#15151d";
    ctx.fillRect(0, heroY, W, heroH);
  }

  const scrim = ctx.createLinearGradient(0, heroY, 0, heroY + heroH);
  scrim.addColorStop(0, "rgba(6,6,10,0.35)");
  scrim.addColorStop(0.45, "rgba(6,6,10,0.55)");
  scrim.addColorStop(1, "rgba(6,6,10,0.92)");
  ctx.fillStyle = scrim;
  ctx.fillRect(0, heroY, W, heroH);

  ctx.fillStyle = site.accent;
  ctx.font = "600 13px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.letterSpacing = "2.5px";
  ctx.fillText(site.type.toUpperCase(), pad, heroY + 168);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 62px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillText(site.tagline, pad, heroY + 226);

  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = "400 19px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillText(
    "Designed, built and launched by OwnWebify.",
    pad,
    heroY + 274
  );

  const heroBtnW = 172;
  const heroBtnY = heroY + 306;
  ctx.fillStyle = site.accent;
  roundRect(ctx, pad, heroBtnY, heroBtnW, 46, 23);
  ctx.fill();
  ctx.fillStyle = "#0a0a0f";
  ctx.font = "600 15px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(site.cta, pad + heroBtnW / 2, heroBtnY + 24);
  ctx.textAlign = "left";

  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 1.5;
  roundRect(ctx, pad + heroBtnW + 16, heroBtnY, 150, 46, 23);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.textAlign = "center";
  ctx.fillText("Learn more", pad + heroBtnW + 16 + 75, heroBtnY + 24);
  ctx.textAlign = "left";

  // ── Card row ───────────────────────────────────────────────────────────
  const cardsY = heroY + heroH + 52;
  const gap = 26;
  const cardW = (W - pad * 2 - gap * 2) / 3;
  const cardH = 148;
  for (let i = 0; i < 3; i++) {
    const x = pad + i * (cardW + gap);
    ctx.fillStyle = "rgba(255,255,255,0.045)";
    roundRect(ctx, x, cardsY, cardW, cardH, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.085)";
    ctx.lineWidth = 1;
    roundRect(ctx, x, cardsY, cardW, cardH, 14);
    ctx.stroke();

    ctx.fillStyle = site.accent;
    roundRect(ctx, x + 22, cardsY + 24, 34, 4, 2);
    ctx.fill();

    // Greeked body copy. Real sentences at this size turn into noise anyway,
    // and bars keep the eye on the hero where the story is.
    CARD_LINES.forEach((frac, line) => {
      ctx.fillStyle = `rgba(255,255,255,${0.22 - line * 0.08})`;
      roundRect(ctx, x + 22, cardsY + 52 + line * 22, (cardW - 44) * frac, 9, 4);
      ctx.fill();
    });
  }
}

/**
 * Owns the laptop screen's texture: pre-renders each site to its own layer,
 * loads the photos, and transitions between them on a timer.
 *
 * Layers are cached canvases rather than being redrawn per frame — a full mock
 * is ~40 canvas ops, and mid-transition the per-frame cost collapses to two
 * `drawImage` blits.
 */
export class SiteScreen {
  readonly texture: CanvasTexture;

  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly layers: (HTMLCanvasElement | null)[];
  private photos: (HTMLImageElement | null)[] = [];
  private readonly requested: boolean[] = [];
  private index = 0;
  private next = 0;
  private elapsed = 0;
  /** 1 = settled on `index`; <1 = mid-transition from `index` to `next`. */
  private fade = 1;
  private dirty = true;
  private disposed = false;

  constructor(private readonly sites: SiteMock[]) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = W;
    this.canvas.height = H;
    this.ctx = this.canvas.getContext("2d")!;

    // Backing stores are allocated in `ensureLayer`, not here. Four 1200x750
    // canvases is ~14MB reserved before a single pixel is shown, and three of
    // them are for panels that do not appear for at least 3.4s.
    this.layers = sites.map(() => null);
    this.photos = sites.map(() => null);

    this.texture = new CanvasTexture(this.canvas);
    this.texture.colorSpace = SRGBColorSpace;
    // Clamped to the device max on upload, so an unsupported value is safe.
    this.texture.anisotropy = 8;

    // Only the first site is needed to render a complete screen. Drawing all
    // four here cost ~4x as much on the critical path for three panels nobody
    // sees for another 3.4s, and kicking off all four photo requests at once
    // made them contend: on a throttled connection the first site's photo
    // landed at ~1s instead of ~0.4s because three others were sharing the
    // pipe. The rest are prepared during idle time instead.
    this.ensureLayer(0);
    this.composite();
    this.schedulePrefetch();

  }

  /** Allocates and draws a layer on first use, with its photo if one arrived. */
  private ensureLayer(i: number): HTMLCanvasElement {
    let layer = this.layers[i];
    if (!layer) {
      layer = document.createElement("canvas");
      layer.width = W;
      layer.height = H;
      this.layers[i] = layer;
      drawMock(layer.getContext("2d")!, this.sites[i], this.photos[i]);
      this.loadPhoto(i);
    }
    return layer;
  }

  private loadPhoto(i: number) {
    if (this.requested[i]) return;
    this.requested[i] = true;
    const img = new Image();
    // Required: the texture upload reads pixels back out of the canvas, and
    // an image drawn without CORS approval taints it, which makes WebGL
    // reject the whole thing with a SecurityError rather than just this
    // photo. CSP `img-src` already allows images.unsplash.com.
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (this.disposed) return;
      this.photos[i] = img;
      // Only repaint if the layer exists; otherwise the photo is simply picked
      // up when `ensureLayer` first draws it.
      const layer = this.layers[i];
      if (layer) {
        drawMock(layer.getContext("2d")!, this.sites[i], img);
        this.dirty = true;
      }
    };
    // On error the layer keeps its photo-less draw, which is a complete
    // design rather than a broken one, so there is nothing to handle.
    img.src = this.sites[i].photo;
  }

  /**
   * Prepare the remaining panels once the main thread is free. Each still gets
   * drawn on demand in `update` if the cycle somehow reaches it first, so this
   * is an optimisation rather than a correctness requirement.
   */
  private schedulePrefetch() {
    const schedule =
      window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 400));
    schedule(
      () => {
        if (this.disposed) return;
        for (let i = 1; i < this.sites.length; i++) this.ensureLayer(i);
      },
      { timeout: 3000 }
    );
  }

  /**
   * Transitions are a horizontal push, not a crossfade.
   *
   * Dissolving one mock into another double-exposes their headlines and nav
   * labels, which sit at different x positions — the midpoint renders as
   * overlapping ghosted text and reads as a broken frame rather than an effect.
   * Sliding keeps every layer opaque, so type stays type, and a page pushing in
   * from the right is a motion the eye already reads as a site changing view.
   */
  private composite() {
    const ctx = this.ctx;
    ctx.globalAlpha = 1;

    if (this.fade >= 1) {
      ctx.drawImage(this.ensureLayer(this.index), 0, 0);
    } else {
      const t = this.fade;
      // easeInOutCubic — pushes off briskly and settles, rather than the linear
      // conveyor-belt slide a raw `t` would give.
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const dx = Math.round(W * e);
      // Guards the 1px seam that rounding can open between the two layers.
      ctx.fillStyle = "#08080c";
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(this.ensureLayer(this.index), -dx, 0);
      ctx.drawImage(this.ensureLayer(this.next), W - dx, 0);
    }

    this.texture.needsUpdate = true;
    this.dirty = false;
  }

  /**
   * @param delta   Seconds since the last frame.
   * @param playing Whether the lid is open far enough for the cycle to run.
   *                While false the timer is frozen, so the screen resumes on
   *                the site it was showing instead of jumping ahead by however
   *                long the section sat offscreen.
   */
  update(delta: number, playing: boolean) {
    if (playing) {
      if (this.fade < 1) {
        this.fade = Math.min(1, this.fade + delta / TRANSITION);
        if (this.fade >= 1) this.index = this.next;
        this.dirty = true;
      } else {
        this.elapsed += delta;
        if (this.elapsed >= DWELL && this.sites.length > 1) {
          this.elapsed = 0;
          this.next = (this.index + 1) % this.sites.length;
          // Safety net for the idle prefetch not having run yet — a panel that
          // slides in undrawn would be a blank white rectangle.
          this.ensureLayer(this.next);
          this.fade = 0;
          this.dirty = true;
        }
      }
    }
    // Runs even when paused: a photo may have finished loading since the last
    // frame, and the layer it repainted still has to reach the texture.
    if (this.dirty) this.composite();
  }

  dispose() {
    this.disposed = true;
    this.texture.dispose();
  }
}
