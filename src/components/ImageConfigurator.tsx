import { ImageOriginal } from "@/components/ImageOriginal.tsx";
import { ImageOverlay } from "@/components/ImageOverlay.tsx";
import { ImagePreview } from "@/components/ImagePreview.tsx";
import { useAppContext } from "@/context/AppContext.tsx";

export const ImageConfigurator = () => {
	const { overlay, setOverlay } = useAppContext();

	return (
		<div className="flex flex-row gap-6 border-2 border-gray-200 p-4 rounded-md">
			<div className="flex flex-col items-center gap-4 w-48">
				<ImageOriginal />
				<ImageOverlay value={overlay} onChange={setOverlay} />
			</div>
			<div className="flex flex-col items-center gap-2">
				<ImagePreview />
			</div>
		</div>
	);
};
