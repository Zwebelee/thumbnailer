import { AppHeader } from "@/components/AppHeader.tsx";
import { Exports } from "@/components/Exports.tsx";
import { ImageConfigurator } from "@/components/ImageConfigurator.tsx";
import { ImageSelector } from "@/components/ImageSelector.tsx";
import { AppProvider } from "@/context/AppContext.tsx";

function App() {
	return (
		<AppProvider>
			<div
				className={
					"flex flex-col items-center p-8 gap-4 min-w-3xl max-w-7xl mx-auto"
				}
			>
				<AppHeader />
				<div className={"flex flex-col gap-4 p-2 w-full "}>
					<ImageSelector />
					<ImageConfigurator />
					<Exports />
				</div>
			</div>
		</AppProvider>
	);
}

export default App;
