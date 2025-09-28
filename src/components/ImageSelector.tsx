import React from "react";
import {useAppContext} from "@/context/AppContext.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";

export const ImageSelector = () => {
    const {setImage} = useAppContext()

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setImage(file);
    };

    return (
        <div>
            <div className="flex flex-row items-center gap-3 border p-4 rounded-md">
                <Label htmlFor="picture">Select Image</Label>
                <Input
                    id="picture"
                    type="file"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    )
}