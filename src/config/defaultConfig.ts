export type InfoConfig = {
	title: string;
	text?: string;
	showText?: boolean;
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
	defaultSelectedBulkOverlays?: string[];
};

export type AppConfig = {
	info: InfoConfig;
	export: ExportConfig;
	exportPath: ExportPathConfig;
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
		defaultSelectedBulkOverlays: ["a", "c", "d"],
	},
	exportPath: {
		title: "Export Path",
		path: "/export/path/",
		show: true,
	},
};
