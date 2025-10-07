import {useAppContext} from "@/context/AppContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group"
import {Input} from "@/components/ui/input"
import React, {useState} from "react";
import {Label} from "@/components/ui/label.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {Settings} from "lucide-react";

export const Exports = () => {
    const {previewCanvasRef} = useAppContext();
    const [filename, setFilename] = useState(`thumbnail`);
    const [filetype, setFiletype] = useState<"png" | "jpg">("jpg");
    const [hastimestamp, sethasTimestamp] = useState<boolean>(true);

    const handleDownload = () => {
        const canvas = previewCanvasRef.current;
        if (!canvas) return;
        const mimeType = filetype === "jpg" ? "image/jpeg" : "image/png";

        let finalFilename = filename;
        if (hastimestamp) {
            const timestamp = getLocalTimestamp()
            finalFilename += `_${timestamp}`;
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

        <div className={"flex flex-row gap-4"}>
            <FileNameInput value={filename} onChange={setFilename}/>
            <ExportSettingsMenu
                filetype={filetype}
                setFiletype={setFiletype}
                hastimestamp={hastimestamp}
                sethasTimestamp={sethasTimestamp}
            />
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


interface FileNameInputProps {
    value: string;
    onChange: (value: string) => void;
}

export const FileNameInput = ({value, onChange}: FileNameInputProps) => {
    return (
        <div className="grid w-full max-w-sm items-center gap-3">
            <Label>Filename</Label>
            <Input
                type="text"
                placeholder="Filename"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

interface ExportSettingsMenuProps {
    filetype: "png" | "jpg";
    setFiletype: (type: "png" | "jpg") => void;
    hastimestamp: boolean;
    sethasTimestamp: (val: boolean) => void;
}

export const ExportSettingsMenu = (
    {
        filetype,
        setFiletype,
        hastimestamp,
        sethasTimestamp
    }: ExportSettingsMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={"cursor-pointer"}>
                <Settings/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Export Settings</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <ExportSettingsMenuItem
                    label={"Bulk Export"}
                    children={
                        <>
                            <ToggleGroup
                                type="multiple"
                                defaultValue={["a", "b", "c"]}>
                                <ToggleGroupItem value="a">Original</ToggleGroupItem>
                                <ToggleGroupItem value="b">App</ToggleGroupItem>
                                <ToggleGroupItem value="c">Maintenance</ToggleGroupItem>
                                <ToggleGroupItem value="d">Edit</ToggleGroupItem>
                            </ToggleGroup>
                            <Button variant={"outline"}>Export Bulk</Button>
                        </>
                    }
                    layout={"col"}
                />
                <DropdownMenuSeparator/>
                <ExportSettingsMenuItem
                    label={"Filetype"}
                    children={
                        <ToggleGroup
                            type="single"
                            value={filetype}
                            onValueChange={(val) => setFiletype(val as "png" | "jpg")}
                        >
                            <ToggleGroupItem
                                className="cursor-pointer" value="jpg">jpg</ToggleGroupItem>
                            <ToggleGroupItem
                                className="cursor-pointer" value="png">png</ToggleGroupItem>
                        </ToggleGroup>}
                />
                <DropdownMenuSeparator/>
                <ExportSettingsMenuItem
                    label={"Timestamp"}
                    children={
                        <Switch
                            checked={hastimestamp}
                            onCheckedChange={sethasTimestamp}
                            className="cursor-pointer"
                        />}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

interface ExportSettingsMenuItemProps {
    label: string;
    children: React.ReactNode;
    layout?: "row" | "col";
}

export const ExportSettingsMenuItem = (
    {
        label,
        children,
        layout
    }: ExportSettingsMenuItemProps) => {
    return (
        <div className={`flex flex-${layout} justify-between items-center`}>
            <Label className={"font-normal"}>{label}</Label>
            {children}
        </div>
    )
}