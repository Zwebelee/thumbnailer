import {useAppContext} from "@/context/AppContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Badge} from "@/components/ui/badge.tsx";


export const Exports = () => {
    const {previewCanvasRef} = useAppContext();

    const handleDownload = () => {
        const canvas = previewCanvasRef.current;
        if (!canvas) return;
        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "image-preview.png";
            a.click();
            URL.revokeObjectURL(url);
        }, "image/png");
    };

    return (

        <div className={"flex flex-row gap-4"}>
            <Badge>Multiselect Checkbox / Combobox for Outputvariant + original as option</Badge>
            <Badge>Define Name (vorschlagmachen e.g. mit zeitstempel "thumbnail_20250925_hhhmmss) (postfix will be set)</Badge>
            {/*TODO Tooltip for button _> Export package*/}
        <Button
            className="px-4 py-2 rounded cursor-pointer"
            onClick={handleDownload}
            type="button"
            disabled={!previewCanvasRef.current}
        >
            Export
        </Button>
        </div>

    );
}