export type InfoConfig = {
	title: string;
	text?: string;
};

export type ExportConfig = {
	title?: string;
	path?: string;
};

export type AppConfig = {
	info: InfoConfig;
	exportPath: ExportConfig;
};

export const defaultConfig: AppConfig = {
	info: {
		title: "Thumbnailer",
		text: "Use this application to preview and manipulate your images with various overlays and canvas sizes.",
	},
	exportPath: {
		title: "Export Path",
		path: "/export/path/",
	},
};
