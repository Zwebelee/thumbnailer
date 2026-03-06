import { Label } from "@/components/ui/label.tsx";
import { useAppContext } from "@/context/AppContext.tsx";

export const ImageOriginal = () => {
	const { imageUrl } = useAppContext();
	return (
		<div className={"flex flex-col items-center gap-2"}>
			<Label className={"font-semibold"}>Original</Label>
			<div className="w-32 h-32 border rounded bg-gray-50 flex items-center justify-center">
				{imageUrl ? (
					<img
						src={imageUrl}
						alt="original"
						className="h-full w-full object-contain"
					/>
				) : (
					<span className="text-xs text-gray-400">No image selected</span>
				)}
			</div>
		</div>
	);
};
