import React, {createContext, useContext, useState, useRef} from "react";

interface AppContextProps {
    image: File | null;
    setImage: (file: File | null) => void;
    imageUrl: string | null;
    previewCanvasRef: React.RefObject<HTMLCanvasElement>;

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
    const prevUrl = useRef<string | null>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);


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
        }
    };


    return (
        <AppContext.Provider value={{
            image,
            imageUrl,
            setImage,
            previewCanvasRef
        }}>
            {children}
        </AppContext.Provider>
    );
};
