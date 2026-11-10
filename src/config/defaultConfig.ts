export type InfoConfig = {
	title: string;
	text?: string;
	showText?: boolean;
	/** Logo shown next to the title, e.g. "custom/logo.svg" (relative to the app base URL) */
	logo?: string;
	/** Favicon override, e.g. "custom/favicon.svg" */
	favicon?: string;
};

export type ImageFormat = "png" | "jpg";

export type ExportPathConfig = {
	title?: string;
	path?: string;
	show?: boolean;
};

export type ExportConfig = {
	defaultName: string;
	defaultFormat: ImageFormat;
	defaultTimestampActive: boolean;
	/** Overlay ids preselected for bulk export. Special ids: "original", "none" */
	defaultSelectedBulkOverlays?: string[];
};

export type CanvasSize = {
	width: number;
	height: number;
	label?: string;
};

/** tl = top-left, tr = top-right, bl = bottom-left, br = bottom-right */
export type Corner = "tl" | "tr" | "bl" | "br";
export type Anchor = Corner | "center";

type Positioned = {
	/** Reference point on the canvas. Default "tl" */
	anchor?: Anchor;
	/** Center of the element, measured inward from the anchor (px) */
	x?: number;
	y?: number;
	/** Rotation in degrees around the element center */
	rotate?: number;
};

export type TriangleLayer = {
	type: "triangle";
	corner?: Corner;
	/** Leg length in px. Default 180 */
	size?: number;
	color: string;
};

export type IconLayer = Positioned & {
	type: "icon";
	/** Image url, relative to the app base url (e.g. "custom/logo.svg") or absolute */
	src: string;
	/** Square box size in px; or use width/height. The image is fit (contain) into the box */
	size?: number;
	width?: number;
	height?: number;
	/** SVG only: replace all fill / stroke attributes with this color */
	fill?: string;
	stroke?: string;
};

export type TextLayer = Positioned & {
	type: "text";
	text: string;
	/** CSS font shorthand. Default "bold 28px sans-serif" */
	font?: string;
	color?: string;
};

export type OverlayLayer = TriangleLayer | IconLayer | TextLayer;

export type OverlayDef = {
	id: string;
	label: string;
	/** Short label for the bulk export toggles */
	shortLabel?: string;
	layers: OverlayLayer[];
};

export type AppConfig = {
	info: InfoConfig;
	export: ExportConfig;
	exportPath: ExportPathConfig;
	/** First entry is the initial canvas size */
	canvasSizes: CanvasSize[];
	overlays: OverlayDef[];
};

/** Shape of custom/config.json and config.json: everything optional */
export type ConfigOverride = {
	info?: Partial<InfoConfig>;
	export?: Partial<ExportConfig>;
	exportPath?: Partial<ExportPathConfig>;
	/** Replaces the default canvas sizes */
	canvasSizes?: CanvasSize[];
	/** Replaces the default (sample) overlays */
	overlays?: OverlayDef[];
	/** Appended to the overlays (keeps the samples / previous list) */
	overlaysAppend?: OverlayDef[];
};

/** Built-in pseudo overlay ids */
export const NO_OVERLAY = "none";
export const ORIGINAL = "original";

const tealTriangle: TriangleLayer = {
	type: "triangle",
	color: "rgba(34, 221, 202, 1)",
};
const redTriangle: TriangleLayer = {
	type: "triangle",
	color: "rgba(227, 36, 42, 1)",
};

export const defaultConfig: AppConfig = {
	info: {
		title: "Thumbnailer",
		text: "Use this application to preview and manipulate your images with various overlays and canvas sizes.",
		showText: true,
	},
	export: {
		defaultName: "thumbnailer",
		defaultFormat: "jpg",
		defaultTimestampActive: true,
		defaultSelectedBulkOverlays: [ORIGINAL, "app", "maintenance"],
	},
	exportPath: {
		title: "Export Path",
		path: "/export/path/",
		show: true,
	},
	canvasSizes: [
		{ width: 400, height: 400 },
		{ width: 600, height: 400 },
	],
	// Sample overlays. Replace or extend them in public/custom/config.json
	overlays: [
		{
			id: "app",
			label: "App",
			layers: [
				tealTriangle,
				{
					type: "icon",
					src: "app-window.svg",
					size: 92,
					x: 60,
					y: 60,
					rotate: -45,
				},
			],
		},
		{
			id: "maintenance",
			label: "Maintenance",
			shortLabel: "Maint.",
			layers: [
				redTriangle,
				{ type: "icon", src: "settings.svg", size: 92, x: 56, y: 56 },
			],
		},
		{
			id: "edit",
			label: "Edit",
			layers: [
				{ type: "triangle", color: "rgba(242, 237, 231, 1)" },
				{ type: "icon", src: "pencil.svg", size: 92, x: 56, y: 56 },
			],
		},
		{
			id: "dapr",
			label: "dapr",
			layers: [
				{ type: "triangle", color: "rgba(255, 215, 0, 1)" },
				{ type: "icon", src: "dapr.svg", size: 72, x: 60, y: 60, rotate: -45 },
			],
		},
		{
			id: "app_text",
			label: "Test App Text",
			shortLabel: "Text",
			layers: [
				tealTriangle,
				{ type: "text", text: "GeoApp", x: 60, y: 60, rotate: -45 },
			],
		},
		{
			id: "maintenance2",
			label: "Test Maintenance 2",
			shortLabel: "Maint. 2",
			layers: [
				redTriangle,
				{ type: "text", text: "GeoApp", x: 60, y: 60, rotate: -45 },
				{ ...redTriangle, corner: "br" },
				{
					type: "text",
					text: "Betrieb",
					anchor: "br",
					x: 60,
					y: 60,
					rotate: -45,
				},
				{
					type: "icon",
					src: "settings.svg",
					anchor: "center",
					size: 192,
					fill: "#e3242a",
				},
			],
		},
	],
};

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
	typeof v === "object" && v !== null && !Array.isArray(v);

/** Deep-merges objects; arrays and primitives from `override` replace the base value. */
export function mergeConfig(
	base: AppConfig,
	override: ConfigOverride | null | undefined,
): AppConfig {
	if (!isPlainObject(override)) return base;
	const { overlaysAppend, ...rest } = override;
	const merged = deepMerge(base, rest) as AppConfig;
	if (Array.isArray(overlaysAppend)) {
		merged.overlays = [...merged.overlays, ...overlaysAppend];
	}
	return merged;
}

function deepMerge(base: unknown, override: unknown): unknown {
	if (!isPlainObject(base) || !isPlainObject(override)) {
		return override === undefined ? base : override;
	}
	const out: Record<string, unknown> = { ...base };
	for (const [key, value] of Object.entries(override)) {
		out[key] = deepMerge(base[key], value);
	}
	return out;
}
