import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { useAppContext } from "@/context/AppContext.tsx";

type PresetSize = "400x400" | "600x400" | "custom";

export const CanvasSizePicker = () => {
	const { canvasSize, setCanvasSize } = useAppContext();

	const initialSelected =
		canvasSize[0] === 400 && canvasSize[1] === 400
			? "400x400"
			: canvasSize[0] === 600 && canvasSize[1] === 400
				? "600x400"
				: "custom";

	const [selected, setSelected] = useState<PresetSize>(initialSelected);
	const [customW, setCustomW] = useState<string>(String(canvasSize[0]));
	const [customH, setCustomH] = useState<string>(String(canvasSize[1]));

	useEffect(() => {
		// keep local state in sync if canvasSize changes externally
		if (canvasSize[0] === 400 && canvasSize[1] === 400) setSelected("400x400");
		else if (canvasSize[0] === 600 && canvasSize[1] === 400)
			setSelected("600x400");
		else {
			setSelected("custom");
			setCustomW(String(canvasSize[0]));
			setCustomH(String(canvasSize[1]));
		}
	}, [canvasSize]);

	const applyPreset = (val: PresetSize) => {
		setSelected(val);
		if (val === "400x400") setCanvasSize([400, 400]);
		else if (val === "600x400") setCanvasSize([600, 400]);
		// if custom, don't change until user clicks Apply
	};

	const applyCustom = () => {
		const w = Math.max(1, Math.floor(Number(customW) || 0));
		const h = Math.max(1, Math.floor(Number(customH) || 0));
		if (w > 0 && h > 0) {
			setCanvasSize([w, h]);
			setSelected("custom");
		}
	};

	return (
		<div className="flex flex-col items-center gap-2 p-2">
			<Label className={"font-semibold"}>Canvas Size</Label>
			<ToggleGroup
				type="single"
				value={selected}
				onValueChange={(v) => applyPreset(v as PresetSize)}
				className="border"
			>
				<ToggleGroupItem className="cursor-pointer" value="400x400">
					400 x 400
				</ToggleGroupItem>
				<ToggleGroupItem className="cursor-pointer" value="600x400">
					600 x 400
				</ToggleGroupItem>
				<ToggleGroupItem className="cursor-pointer" value="custom">
					Custom
				</ToggleGroupItem>
			</ToggleGroup>
			{selected === "custom" && (
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
