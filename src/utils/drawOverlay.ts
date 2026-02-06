export const OverlayType = {
	NONE: "none",
	APP: "app",
	MAINTENANCE: "maintenance",
	EDIT: "edit",
	LU: "lu",
	DAPR: "dapr",
	APP_TEXT: "app_text",
	MAINTENANCE2: "maintenance2",
} as const;

export type OverlayType = (typeof OverlayType)[keyof typeof OverlayType];

export interface OverlayOption {
	id: OverlayType;
	label: string;
}

export const overlayOptions: OverlayOption[] = [
	{ id: OverlayType.NONE, label: "None" },
	{ id: OverlayType.APP, label: "App" },
	{ id: OverlayType.MAINTENANCE, label: "Maintenance" },
	{ id: OverlayType.EDIT, label: "Edit" },
	{ id: OverlayType.LU, label: "LU" },
	{ id: OverlayType.DAPR, label: "dapr" },
	{ id: OverlayType.APP_TEXT, label: "Test App Text" },
	{ id: OverlayType.MAINTENANCE2, label: "Test Maintenance 2" },
];

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new window.Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = (e) => reject(e);
		img.src = src;
	});
}

function getAssetUrl(name: string) {
	const asset = name.startsWith("/") ? name.slice(1) : name;
	const base = import.meta.env.BASE_URL ?? "/";
	const normalized = base.endsWith("/") ? base : base + "/";
	const absoluteBase = normalized.startsWith("http")
		? normalized
		: window.location.origin +
			(normalized.startsWith("/") ? normalized : "/" + normalized);
	return new URL(asset, absoluteBase).href;
}

export const IconPath = {
	SETTINGS: getAssetUrl("settings.svg"),
	PENCIL: getAssetUrl("pencil.svg"),
	APPWINDOW: getAssetUrl("app-window.svg"),
	LU: getAssetUrl("lu.svg"),
	DAPR: getAssetUrl("dapr.svg"),
} as const;

export async function drawOverlay(
	ctx: CanvasRenderingContext2D,
	overlay: OverlayType,
) {
	if (overlay === OverlayType.APP) {
		ctx.save();
		ctx.fillStyle = "rgba(34, 221, 202,1)";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(180, 0);
		ctx.lineTo(0, 180);
		ctx.closePath();
		ctx.fill();

		try {
			const icon = await loadImage(IconPath.APPWINDOW);
			const iconSize = 92;
			const centroidX = (0 + 180 + 0) / 3;
			const centroidY = (0 + 0 + 180) / 3;
			ctx.save();
			ctx.translate(centroidX, centroidY);
			ctx.rotate(-Math.PI / 4);
			ctx.drawImage(icon, -iconSize / 2, -iconSize / 2, iconSize, iconSize);
			ctx.restore();
		} catch {}
	} else if (overlay === OverlayType.MAINTENANCE) {
		ctx.save();
		ctx.fillStyle = "rgba(227, 36, 42, 1)";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(180, 0);
		ctx.lineTo(0, 180);
		ctx.closePath();
		ctx.fill();

		try {
			const icon = await loadImage(IconPath.SETTINGS);
			const iconSize = 92;
			ctx.save();
			ctx.drawImage(icon, 10, 10, iconSize, iconSize);
			ctx.restore();
		} catch {}
	} else if (overlay === OverlayType.EDIT) {
		ctx.save();
		ctx.fillStyle = "rgba(242, 237, 231, 1)";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(180, 0);
		ctx.lineTo(0, 180);
		ctx.closePath();
		ctx.fill();

		try {
			const icon = await loadImage(IconPath.PENCIL);
			const iconSize = 92;
			ctx.save();
			ctx.drawImage(icon, 10, 10, iconSize, iconSize);
			ctx.restore();
		} catch {}
	} else if (overlay === OverlayType.LU) {
		try {
			const icon = await loadImage(IconPath.LU);

			const maxW = 108;
			const maxH = 92;

			// intrinsic size fallbacks
			const iw = icon.naturalWidth || icon.width || maxW;
			const ih = icon.naturalHeight || icon.height || maxH;

			// scale to fit while preserving aspect ratio
			const scale = Math.min(maxW / iw, maxH / ih, 1);
			const w = Math.round(iw * scale);
			const h = Math.round(ih * scale);

			// position (left padding 5, vertically centered inside maxH)
			const x = 16;
			const y = 5;

			ctx.save();
			ctx.drawImage(icon, x, y, w, h);
			ctx.restore();
		} catch {}
	} else if (overlay === OverlayType.DAPR) {
		ctx.save();
		ctx.fillStyle = "rgba(255, 215, 0,1)";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(180, 0);
		ctx.lineTo(0, 180);
		ctx.closePath();
		ctx.fill();

		try {
			const icon = await loadImage(IconPath.DAPR);
			const iconSize = 72;
			const centroidX = (0 + 180 + 0) / 3;
			const centroidY = (0 + 0 + 180) / 3;
			ctx.save();
			ctx.translate(centroidX, centroidY);
			ctx.rotate(-Math.PI / 4);
			ctx.drawImage(icon, -iconSize / 2, -iconSize / 2, iconSize, iconSize);
			ctx.restore();
		} catch {}
	} else if (overlay === OverlayType.APP_TEXT) {
		ctx.save();
		ctx.fillStyle = "rgba(34, 221, 202,1)";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(180, 0);
		ctx.lineTo(0, 180);
		ctx.closePath();
		ctx.fill();

		ctx.fillStyle = "#fff";
		ctx.font = "bold 28px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.translate(60, 60);
		ctx.rotate(-Math.PI / 4);
		ctx.fillText("GeoApp", 0, 0);
		ctx.restore();
	} else if (overlay === OverlayType.MAINTENANCE2) {
		ctx.save();
		ctx.fillStyle = "rgba(227, 36, 42, 1)";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(180, 0);
		ctx.lineTo(0, 180);
		ctx.closePath();
		ctx.fill();

		ctx.fillStyle = "#fff";
		ctx.font = "bold 28px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.translate(60, 60);
		ctx.rotate(-Math.PI / 4);
		ctx.fillText("GeoApp", 0, 0);
		ctx.restore();

		ctx.save();
		ctx.fillStyle = "rgba(227, 36, 42, 1)";
		ctx.beginPath();
		ctx.moveTo(ctx.canvas.width, ctx.canvas.height);
		ctx.lineTo(ctx.canvas.width - 180, ctx.canvas.height);
		ctx.lineTo(ctx.canvas.width, ctx.canvas.height - 180);
		ctx.closePath();
		ctx.fill();

		ctx.fillStyle = "#fff";
		ctx.font = "bold 28px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.translate(ctx.canvas.width - 60, ctx.canvas.height - 60);
		ctx.rotate(-Math.PI / 4);
		ctx.fillText("Betrieb", 0, 0);
		ctx.restore();

		try {
			const svgPath = "/settings.svg";
			const res = await fetch(svgPath);
			const svgText = await res.text();
			const coloredSvg = svgText.replace(/fill="none"/g, 'fill="#e3242a"');
			const svgBlob = new Blob([coloredSvg], { type: "image/svg+xml" });
			const url = URL.createObjectURL(svgBlob);
			try {
				const icon = await loadImage(url);
				const centerX = ctx.canvas.width / 2;
				const centerY = ctx.canvas.height / 2;
				const iconSize = 192;
				ctx.save();
				ctx.drawImage(
					icon,
					centerX - iconSize / 2,
					centerY - iconSize / 2,
					iconSize,
					iconSize,
				);
				ctx.restore();
			} finally {
				URL.revokeObjectURL(url);
			}
		} catch {}
	}
}
