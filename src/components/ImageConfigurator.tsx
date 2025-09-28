import {useAppContext} from "@/context/AppContext.tsx";
import {ImageOriginal} from "@/components/ImageOriginal.tsx";
import {ImagePreview} from "@/components/ImagePreview.tsx";
import {ImageOverlay} from "@/components/ImageOverlay.tsx";
//TODO do selection or new entry and contet for preview
const PREVIEW_SIZE = 400;


export const ImageConfigurator = () => {
    const {imageUrl} = useAppContext()

    return (
        <div className="flex flex-row gap-6 border-2 border-gray-200 p-4 rounded-md">
            <div className="flex flex-col items-center gap-4 w-48">
                <ImageOriginal/>
                <ImageOverlay />
            </div>
            <div className="flex flex-col items-center gap-2">
                <ImagePreview />
            </div>
        </div>
    );


}