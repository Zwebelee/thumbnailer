import './App.css'
import {AppProvider} from "@/context/AppContext.tsx";
import {AppHeader} from "@/components/AppHeader.tsx";
import {ImageConfigurator} from "@/components/ImageConfigurator.tsx";
import {ImageSelector} from "@/components/ImageSelector.tsx";
import {Exports} from "@/components/Exports.tsx";

function App() {

    return (
        <AppProvider>
            <div className={"flex flex-col items-center"}>
                <AppHeader/>
                <div className={"flex flex-col gap-4"}>
                    <ImageSelector/>
                    <ImageConfigurator/>
                </div>
                <Exports/>
            </div>
        </AppProvider>
    )
}

export default App
