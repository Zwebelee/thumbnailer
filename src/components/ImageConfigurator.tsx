import { CanvasSizePicker } from "@/components/CanvasSizePicker.tsx";
import { ImageOriginal } from "@/components/ImageOriginal.tsx";
import { ImageOverlay } from "@/components/ImageOverlay.tsx";
import { ImagePreview } from "@/components/ImagePreview.tsx";
import { useAppContext } from "@/context/AppContext.tsx";

export const ImageConfigurator = () => {
	const { overlay, setOverlay } = useAppContext();

	return (
		<div className="flex flex-row gap-6 m-2 p-2 border rounded-md">
			<div className="flex flex-col p-2 gap-2 items-center">
				<CanvasSizePicker />
				<ImageOriginal />
				<ImageOverlay value={overlay} onChange={setOverlay} />
			</div>
			<div className="gap-2">
				<ImagePreview />
			</div>
		</div>
	);
};
