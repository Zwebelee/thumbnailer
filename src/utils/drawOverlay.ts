import type {
	Anchor,
	Corner,
	IconLayer,
	OverlayDef,
	OverlayLayer,
	TextLayer,
	TriangleLayer,
} from "@/config/defaultConfig.ts";

/** Resolves a path relative to the app base url; absolute / data / blob urls pass through. */
export function getAssetUrl(name: string) {
	if (/^(https?:|data:|blob:)/.test(name)) return name;
	const asset = name.startsWith("/") ? name.slice(1) : name;
	const base = import.meta.env.BASE_URL ?? "/";
	const normalized = base.endsWith("/") ? base : `${base}/`;
	const absoluteBase = normalized.startsWith("http")
		? normalized
		: new URL(normalized, window.location.href).href;
	return new URL(asset, absoluteBase).href;
}

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new window.Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = (e) => reject(e);
		img.src = src;
	});
}

const imageCache = new Map<string, Promise<HTMLImageElement>>();

/** Loads (and caches) an icon; optionally recolors SVG fill / stroke attributes. */
function loadIcon(layer: IconLayer): Promise<HTMLImageElement> {
	const url = getAssetUrl(layer.src);
	const key = `${url}|${layer.fill ?? ""}|${layer.stroke ?? ""}`;
	let cached = imageCache.get(key);
	if (!cached) {
		cached = (async () => {
			if (!layer.fill && !layer.stroke) return loadImage(url);
			let svg = await (await fetch(url)).text();
			if (layer.fill)
				svg = svg.replace(/fill="[^"]*"/g, `fill="${layer.fill}"`);
			if (layer.stroke)
				svg = svg.replace(/stroke="[^"]*"/g, `stroke="${layer.stroke}"`);
			const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
			return loadImage(dataUrl);
		})();
		cached.catch(() => imageCache.delete(key));
		imageCache.set(key, cached);
	}
	return cached;
}

function anchorPoint(
	ctx: CanvasRenderingContext2D,
	anchor: Anchor = "tl",
	x = 0,
	y = 0,
): [number, number] {
	const { width: w, height: h } = ctx.canvas;
	switch (anchor) {
		case "tr":
			return [w - x, y];
		case "bl":
			return [x, h - y];
		case "br":
			return [w - x, h - y];
		case "center":
			return [w / 2 + x, h / 2 + y];
		default:
			return [x, y];
	}
}

const cornerSign: Record<Corner, [number, number]> = {
	tl: [1, 1],
	tr: [-1, 1],
	bl: [1, -1],
	br: [-1, -1],
};

function drawTriangle(ctx: CanvasRenderingContext2D, layer: TriangleLayer) {
	const corner = layer.corner ?? "tl";
	const size = layer.size ?? 180;
	const [cx, cy] = anchorPoint(ctx, corner);
	const [sx, sy] = cornerSign[corner];
	ctx.fillStyle = layer.color;
	ctx.beginPath();
	ctx.moveTo(cx, cy);
	ctx.lineTo(cx + sx * size, cy);
	ctx.lineTo(cx, cy + sy * size);
	ctx.closePath();
	ctx.fill();
}

function transformTo(
	ctx: CanvasRenderingContext2D,
	layer: IconLayer | TextLayer,
) {
	const [px, py] = anchorPoint(ctx, layer.anchor, layer.x, layer.y);
	ctx.translate(px, py);
	if (layer.rotate) ctx.rotate((layer.rotate * Math.PI) / 180);
}

function drawIcon(
	ctx: CanvasRenderingContext2D,
	layer: IconLayer,
	icon: HTMLImageElement,
) {
	const boxW = layer.width ?? layer.size ?? 64;
	const boxH = layer.height ?? layer.size ?? 64;
	const iw = icon.naturalWidth || boxW;
	const ih = icon.naturalHeight || boxH;
	const scale = Math.min(boxW / iw, boxH / ih);
	const w = iw * scale;
	const h = ih * scale;
	transformTo(ctx, layer);
	ctx.drawImage(icon, -w / 2, -h / 2, w, h);
}

function drawText(ctx: CanvasRenderingContext2D, layer: TextLayer) {
	ctx.fillStyle = layer.color ?? "#fff";
	ctx.font = layer.font ?? "bold 28px sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	transformTo(ctx, layer);
	ctx.fillText(layer.text, 0, 0);
}

/**
 * Draws all layers of an overlay in order.
 * Icons are loaded first; the actual drawing is fully synchronous so that
 * concurrent calls on the same canvas can't interleave their save/transform/restore.
 * `isCurrent` lets the caller drop a draw that became stale while icons were loading.
 */
export async function drawOverlay(
	ctx: CanvasRenderingContext2D,
	overlay: OverlayDef | undefined,
	isCurrent: () => boolean = () => true,
) {
	if (!overlay) return;
	const icons = new Map<OverlayLayer, HTMLImageElement>();
	await Promise.all(
		overlay.layers.map(async (layer) => {
			if (layer.type !== "icon") return;
			try {
				icons.set(layer, await loadIcon(layer));
			} catch (e) {
				console.warn("Overlay icon failed to load", layer.src, e);
			}
		}),
	);
	if (!isCurrent()) return;

	for (const layer of overlay.layers) {
		ctx.save();
		try {
			if (layer.type === "triangle") drawTriangle(ctx, layer);
			else if (layer.type === "text") drawText(ctx, layer);
			else if (layer.type === "icon") {
				const icon = icons.get(layer);
				if (icon) drawIcon(ctx, layer, icon);
			}
		} finally {
			ctx.restore();
		}
	}
}
