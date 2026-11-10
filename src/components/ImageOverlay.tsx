import { Label } from "@/components/ui/label.tsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select.tsx";
import { NO_OVERLAY } from "@/config/defaultConfig.ts";
import { useAppContext } from "@/context/AppContext.tsx";

export const ImageOverlay = ({
	value,
	onChange,
}: {
	value: string;
	onChange: (id: string) => void;
}) => {
	const { config } = useAppContext();
	const options = [{ id: NO_OVERLAY, label: "None" }, ...config.overlays];

	return (
		<div className="flex flex-col items-center gap-2">
			<Label className="font-semibold">Overlay Selector</Label>

			<Select value={value} onValueChange={onChange}>
				<SelectTrigger className="w-50 cursor-pointer">
					<SelectValue placeholder="Select overlay" />
				</SelectTrigger>

				<SelectContent>
					{options.map((opt) => (
						<SelectItem
							key={opt.id}
							value={opt.id}
							className={"cursor-pointer"}
						>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};
