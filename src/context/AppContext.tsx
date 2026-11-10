import type React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
	type AppConfig,
	type ConfigOverride,
	defaultConfig,
	mergeConfig,
	NO_OVERLAY,
	type OverlayDef,
} from "@/config/defaultConfig.ts";
import { getAssetUrl } from "@/utils/drawOverlay.ts";

type CanvasSize = [number, number];

interface AppContextProps {
	image: File | null;
	setImage: (file: File | null) => void;
	imageUrl: string | null;
	previewCanvasRef: React.RefObject<HTMLCanvasElement | null>;
	/** Selected overlay id ("none" = no overlay) */
	overlay: string;
	setOverlay: (overlay: string) => void;
	/** Definition of the selected overlay, undefined for "none" */
	overlayDef: OverlayDef | undefined;
	originalImageRef: React.RefObject<
		HTMLImageElement | HTMLCanvasElement | null
	>;
	canvasSize: CanvasSize;
	setCanvasSize: (size: CanvasSize) => void;
	config: AppConfig;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useAppContext must be used within an AppProvider");
	}
	return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [image, setImageState] = useState<File | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [overlay, setOverlay] = useState<string>(NO_OVERLAY);
	const prevUrl = useRef<string | null>(null);
	const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

	const originalImageRef = useRef<HTMLImageElement | HTMLCanvasElement | null>(
		null,
	);

	const [canvasSize, setCanvasSizeState] = useState<CanvasSize>([400, 400]);
	const setCanvasSize = (size: CanvasSize) => {
		// basic validation: ensure positive integers
		const w = Math.max(1, Math.floor(size[0]));
		const h = Math.max(1, Math.floor(size[1]));
		setCanvasSizeState([w, h]);
	};

	const setImage = (file: File | null) => {
		setImageState(file);
		if (prevUrl.current) {
			URL.revokeObjectURL(prevUrl.current);
			prevUrl.current = null;
		}
		if (file) {
			const url = URL.createObjectURL(file);
			setImageUrl(url);
			prevUrl.current = url;
		} else {
			setImageUrl(null);
			originalImageRef.current = null;
		}
	};

	const [config, setConfig] = useState<AppConfig>(defaultConfig);

	// defaultConfig.ts, overridden by custom/config.json (the company customization folder)
	useEffect(() => {
		let mounted = true;
		(async () => {
			const merged = mergeConfig(
				defaultConfig,
				await fetchConfig("custom/config.json"),
			);
			if (!mounted) return;
			setConfig(merged);
			const first = merged.canvasSizes[0];
			if (first) setCanvasSizeState([first.width, first.height]);
		})();
		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		if (config.info.title) document.title = config.info.title;
		if (config.info.favicon) {
			const link =
				document.querySelector<HTMLLinkElement>("link[rel='icon']") ??
				document.head.appendChild(document.createElement("link"));
			link.rel = "icon";
			link.href = getAssetUrl(config.info.favicon);
		}
	}, [config.info.title, config.info.favicon]);

	const overlayDef = config.overlays.find((o) => o.id === overlay);

	return (
		<AppContext.Provider
			value={{
				image,
				imageUrl,
				setImage,
				previewCanvasRef,
				overlay,
				setOverlay,
				overlayDef,
				originalImageRef,
				canvasSize,
				setCanvasSize,
				config,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

async function fetchConfig(file: string): Promise<ConfigOverride | null> {
	try {
		const res = await fetch(file, { cache: "no-store" });
		if (!res.ok) return null;
		const text = await res.text();
		// missing file: the dev server / SPA fallback answers with index.html
		if (text.trimStart().startsWith("<")) return null;
		return JSON.parse(text) as ConfigOverride;
	} catch (e) {
		console.warn(`Could not load ${file}`, e);
		return null;
	}
}
