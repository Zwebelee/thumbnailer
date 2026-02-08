import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type OverlayType, overlayOptions } from "@/utils/drawOverlay.ts";

export const ImageOverlay = ({
	value,
	onChange,
}: {
	value: string;
	onChange: (id: OverlayType) => void;
}) => (
	<div className="flex flex-col items-center gap-2">
		<Label className="font-semibold">Overlay Selector</Label>

		<Select value={value} onValueChange={(v) => onChange(v as OverlayType)}>
			<SelectTrigger className="w-50 cursor-pointer">
				<SelectValue placeholder="Select overlay" />
			</SelectTrigger>

			<SelectContent>
				{overlayOptions.map((opt) => (
					<SelectItem key={opt.id} value={opt.id} className={"cursor-pointer"}>
						{opt.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	</div>
);
