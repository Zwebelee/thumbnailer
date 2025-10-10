import React, {createContext, useContext, useRef, useState} from "react";
import {OverlayType} from "@/utils/drawOverlay.ts";

interface AppContextProps {
    image: File | null;
    setImage: (file: File | null) => void;
    imageUrl: string | null;
    previewCanvasRef: React.RefObject<HTMLCanvasElement | null>;
    overlay: OverlayType;
    setOverlay: (overlay: OverlayType) => void;
    originalImageRef: React.RefObject<HTMLImageElement | HTMLCanvasElement | null>;

}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [image, setImageState] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [overlay, setOverlay] = useState<OverlayType>(OverlayType.NONE);
    const prevUrl = useRef<string | null>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const originalImageRef = useRef<HTMLImageElement | HTMLCanvasElement | null>(null);


    const setImage = (file: File | null) => {
        setImageState(file);
        if (prevUrl.current) {
            URL.revokeObjectURL(prevUrl.current);
            prevUrl.current = null;
        }
        if (file) {
            const url = URL.createObjectURL(file);
            setImageUrl(url);
            prevUrl.current = url;
        } else {
            setImageUrl(null);
            originalImageRef.current = null;
        }
    };


    return (
        <AppContext.Provider value={{
            image,
            imageUrl,
            setImage,
            previewCanvasRef,
            overlay,
            setOverlay,
            originalImageRef
        }}>
            {children}
        </AppContext.Provider>
    );
};
