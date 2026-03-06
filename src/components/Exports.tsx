import { Settings } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { ExportPath } from "@/components/ExportPath.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ImageFormat } from "@/config/defaultConfig.ts";
import { useAppContext } from "@/context/AppContext.tsx";
import { drawOverlay, OverlayType } from "@/utils/drawOverlay.ts";

const overlayNames: Record<string, string> = {
	a: "original",
	b: OverlayType.NONE,
	c: OverlayType.APP,
	d: OverlayType.MAINTENANCE,
	e: OverlayType.EDIT,
	f: OverlayType.DAPR,
};

export const Exports = () => {
	const { config, previewCanvasRef, originalImageRef } = useAppContext();
	const [filename, setFilename] = useState(config.export.defaultName);
	const [filetype, setFiletype] = useState<ImageFormat>(
		config.export.defaultFormat,
	);
	const [hasTimestamp, setHasTimestamp] = useState<boolean>(
		config.export.defaultTimestampActive,
	);
	const [selectedOverlays, setSelectedOverlays] = useState<string[]>(
		config.export.defaultSelectedBulkOverlays ?? [],
	);

	useEffect(() => {
		setFilename(config?.export?.defaultName ?? "");
		setFiletype(config?.export?.defaultFormat ?? "jpg");
		setHasTimestamp(Boolean(config?.export?.defaultTimestampActive));
		setSelectedOverlays(config?.export?.defaultSelectedBulkOverlays ?? []);
	}, [
		config?.export?.defaultName,
		config?.export?.defaultFormat,
		config?.export?.defaultTimestampActive,
		config?.export?.defaultSelectedBulkOverlays,
	]);

	const handleDownload = async (bulk: boolean = false) => {
		const canvas = previewCanvasRef.current;
		if (!canvas) return;
		const mimeType = filetype === "jpg" ? "image/jpeg" : "image/png";
		let finalFilename = filename;

		const downloadBlob = (blob: Blob, name: string) => {
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = name;
			a.click();
			URL.revokeObjectURL(url);
		};

		const timestampSuffix = hasTimestamp ? `_${getLocalTimestamp()}` : "";

		const elementToBlob = async (
			el: HTMLImageElement | HTMLCanvasElement,
		): Promise<Blob | null> => {
			const tmp = document.createElement("canvas");
			if (el instanceof HTMLImageElement) {
				// wait if image not yet loaded
				if (!el.complete)
					await new Promise((res) => {
						el.onload = res;
						el.onerror = res;
					});
				tmp.width = el.naturalWidth || el.width;
				tmp.height = el.naturalHeight || el.height;
				const tctx = tmp.getContext("2d");
				if (!tctx) return null;
				tctx.drawImage(el, 0, 0, tmp.width, tmp.height);
			} else {
				tmp.width = el.width;
				tmp.height = el.height;
				const tctx = tmp.getContext("2d");
				if (!tctx) return null;
				tctx.drawImage(el, 0, 0);
			}
			return await new Promise<Blob | null>((res) =>
				tmp.toBlob((b) => res(b), mimeType),
			);
		};

		if (bulk) {
			for (const key of selectedOverlays) {
				const overlayTypeStr = overlayNames[key];
				if (!overlayTypeStr) continue;

				// special-case "original": export the uploaded image (originalImageRef) not the preview canvas
				if (overlayTypeStr === "original") {
					const origEl =
						(originalImageRef?.current as
							| HTMLImageElement
							| HTMLCanvasElement
							| null) ?? null;
					if (origEl) {
						const blob = await elementToBlob(origEl);
						if (blob) {
							const safeName = `${filename}_original${timestampSuffix}.${filetype}`;
							downloadBlob(blob, safeName);
						}
					} else {
						// fallback: export the preview canvas if original not available
						const off = document.createElement("canvas");
						off.width = canvas.width;
						off.height = canvas.height;
						const ctx = off.getContext("2d");
						if (!ctx) continue;
						ctx.drawImage(canvas, 0, 0);
						const blob = await new Promise<Blob | null>((res) =>
							off.toBlob((b) => res(b), mimeType),
						);
						if (blob) {
							const safeName = `${filename}_original${timestampSuffix}.${filetype}`;
							downloadBlob(blob, safeName);
						}
					}
					continue;
				}

				// non-original entries: clone preview canvas and draw overlay
				const overlayType = overlayTypeStr as OverlayType;
				const off = document.createElement("canvas");
				off.width = canvas.width;
				off.height = canvas.height;
				const ctx = off.getContext("2d");
				if (!ctx) continue;
				ctx.drawImage(canvas, 0, 0);

				await drawOverlay(ctx, overlayType);

				const blob = await new Promise<Blob | null>((res) =>
					off.toBlob((b) => res(b), mimeType),
				);
				if (blob) {
					const safeName = `${filename}_${overlayType}${timestampSuffix}.${filetype}`;
					downloadBlob(blob, safeName);
				}
			}
			return;
		}

		if (hasTimestamp) {
			finalFilename += `${timestampSuffix}`;
		}

		canvas.toBlob((blob) => {
			if (!blob) return;
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = finalFilename;
			a.click();
			URL.revokeObjectURL(url);
		}, mimeType);
	};

	const getLocalTimestamp = (): string => {
		const now = new Date();

		const year = now.getFullYear();
		const day = String(now.getDate()).padStart(2, "0");
		const month = String(now.getMonth() + 1).padStart(2, "0");
		const hours = String(now.getHours()).padStart(2, "0");
		const minutes = String(now.getMinutes()).padStart(2, "0");
		const seconds = String(now.getSeconds()).padStart(2, "0");

		return `${year}${day}${month}_${hours}${minutes}${seconds}`;
	};

	return (
		<div className={"flex flex-col gap-4 border rounded-md p-2 m-2"}>
			<div className={"flex flex-row gap-4"}>
				<FileNameInput value={filename} onChange={setFilename} />
				<ExportSettingsMenu
					filetype={filetype}
					setFiletype={setFiletype}
					hastimestamp={hasTimestamp}
					sethasTimestamp={setHasTimestamp}
					selectedOverlays={selectedOverlays}
					setSelectedOverlays={setSelectedOverlays}
					onBulkExport={() => handleDownload(true)}
				/>
				<Button
					className="px-4 py-2 rounded cursor-pointer"
					onClick={() => handleDownload(false)}
					type="button"
					disabled={!previewCanvasRef.current}
				>
					Export
				</Button>
			</div>
			<ExportPath />
		</div>
	);
};

interface FileNameInputProps {
	value: string;
	onChange: (value: string) => void;
}

export const FileNameInput = ({ value, onChange }: FileNameInputProps) => {
	return (
		<div className="flex flex-row gap-2">
			<Label>Filename:</Label>
			<Input
				type="text"
				placeholder="Filename"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
};

interface ExportSettingsMenuProps {
	filetype: "png" | "jpg";
	setFiletype: (type: "png" | "jpg") => void;
	hastimestamp: boolean;
	sethasTimestamp: (val: boolean) => void;
	selectedOverlays?: string[];
	setSelectedOverlays?: (val: string[]) => void;
	onBulkExport?: () => void;
}

export const ExportSettingsMenu = ({
	filetype,
	setFiletype,
	hastimestamp,
	sethasTimestamp,
	selectedOverlays,
	setSelectedOverlays,
	onBulkExport,
}: ExportSettingsMenuProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className={"cursor-pointer"}>
				<Settings />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel className={"font-bold text-lg"}>
					Export Settings
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<ExportSettingsMenuItem label={"Filetype"}>
					<ToggleGroup
						type="single"
						value={filetype}
						onValueChange={(val) => setFiletype(val as "png" | "jpg")}
					>
						<ToggleGroupItem className="cursor-pointer" value="jpg">
							jpg
						</ToggleGroupItem>
						<ToggleGroupItem className="cursor-pointer" value="png">
							png
						</ToggleGroupItem>
					</ToggleGroup>
				</ExportSettingsMenuItem>
				<DropdownMenuSeparator />
				<ExportSettingsMenuItem label={"Timestamp"}>
					<Switch
						checked={hastimestamp}
						onCheckedChange={sethasTimestamp}
						className="cursor-pointer"
					/>
				</ExportSettingsMenuItem>
				<DropdownMenuSeparator />
				<ExportSettingsMenuItem label={"Bulk Export"} layout={"col"}>
					<div className={"flex flex-col items-center gap-2"}>
						<ToggleGroup
							type="multiple"
							value={selectedOverlays}
							onValueChange={setSelectedOverlays}
							className={"border rounded-md"}
						>
							<ToggleGroupItem className="cursor-pointer" value="a">
								Origi.
							</ToggleGroupItem>
							<ToggleGroupItem className="cursor-pointer" value="b">
								Blank
							</ToggleGroupItem>
							<ToggleGroupItem className="cursor-pointer" value="c">
								App
							</ToggleGroupItem>
							<ToggleGroupItem className="cursor-pointer" value="d">
								Maint.
							</ToggleGroupItem>
							<ToggleGroupItem className="cursor-pointer" value="e">
								Edit
							</ToggleGroupItem>
							<ToggleGroupItem className="cursor-pointer" value="f">
								dapr
							</ToggleGroupItem>
						</ToggleGroup>
						<Button
							variant={"default"}
							onClick={onBulkExport}
							className={"cursor-pointer"}
						>
							Export Bulk
						</Button>
					</div>
				</ExportSettingsMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

interface ExportSettingsMenuItemProps {
	label: string;
	children: React.ReactNode;
	layout?: "row" | "col";
}

export const ExportSettingsMenuItem = ({
	label,
	children,
	layout,
}: ExportSettingsMenuItemProps) => {
	return (
		<div className={`flex flex-${layout} justify-between items-center`}>
			<Label className={"font-semibold p-2"}>{label}</Label>
			{children}
		</div>
	);
};
