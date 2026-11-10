import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { useAppContext } from "@/context/AppContext.tsx";

const CUSTOM = "custom";
const key = (w: number, h: number) => `${w}x${h}`;

export const CanvasSizePicker = () => {
	const { canvasSize, setCanvasSize, config } = useAppContext();
	const presets = config.canvasSizes;

	const matchPreset = (w: number, h: number) =>
		presets.some((p) => p.width === w && p.height === h) ? key(w, h) : CUSTOM;

	const [selected, setSelected] = useState<string>(
		matchPreset(canvasSize[0], canvasSize[1]),
	);
	const [customW, setCustomW] = useState<string>(String(canvasSize[0]));
	const [customH, setCustomH] = useState<string>(String(canvasSize[1]));

	// keep local state in sync if canvasSize or presets change externally
	useEffect(() => {
		const [w, h] = canvasSize;
		const match = presets.some((p) => p.width === w && p.height === h);
		setSelected(match ? key(w, h) : CUSTOM);
		if (!match) {
			setCustomW(String(w));
			setCustomH(String(h));
		}
	}, [canvasSize, presets]);

	const applyPreset = (val: string) => {
		if (!val) return;
		setSelected(val);
		const preset = presets.find((p) => key(p.width, p.height) === val);
		if (preset) setCanvasSize([preset.width, preset.height]);
		// if custom, don't change until user clicks Apply
	};

	const applyCustom = () => {
		const w = Math.max(1, Math.floor(Number(customW) || 0));
		const h = Math.max(1, Math.floor(Number(customH) || 0));
		if (w > 0 && h > 0) {
			setCanvasSize([w, h]);
			setSelected(CUSTOM);
		}
	};

	return (
		<div className="flex flex-col items-center gap-2 p-2">
			<Label className={"font-semibold"}>Canvas Size</Label>
			<ToggleGroup
				type="single"
				value={selected}
				onValueChange={applyPreset}
				className="border"
			>
				{presets.map((p) => (
					<ToggleGroupItem
						key={key(p.width, p.height)}
						className="cursor-pointer"
						value={key(p.width, p.height)}
					>
						{p.label ?? `${p.width} x ${p.height}`}
					</ToggleGroupItem>
				))}
				<ToggleGroupItem className="cursor-pointer" value={CUSTOM}>
					Custom
				</ToggleGroupItem>
			</ToggleGroup>
			{selected === CUSTOM && (
				<div
					className={"flex flex-row border-2 border-gray-200 p-4 rounded-md"}
				>
					<div className="flex flex-col gap-3 flex-1">
						<div className="flex items-center">
							<Label className="w-16 text-right">Width</Label>
							<Input
								type="number"
								min={1}
								value={customW}
								onChange={(e) => setCustomW(e.target.value)}
								placeholder="width"
								className="w-20"
							/>
						</div>
						<div className="flex items-center">
							<Label className="w-16 text-right">Height</Label>
							<Input
								type="number"
								min={1}
								value={customH}
								onChange={(e) => setCustomH(e.target.value)}
								placeholder="height"
								className="w-20"
							/>
						</div>
					</div>
					<div className="flex items-end ml-4">
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={applyCustom}
							className={"cursor-pointer"}
						>
							<Save />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};
