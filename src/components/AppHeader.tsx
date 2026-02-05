import { Info, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useAppContext } from "@/context/AppContext.tsx";

export const AppHeader = () => {
	const { config } = useAppContext();
	const [infoOpen, setInfoOpen] = useState<boolean>(false);

	const title = config.info.title;
	const text = config.info.text;

	return (
		<header className={"mb-4 gap-2 flex flex-col items-center"}>
			<div className={"flex flex-row gap-8"}>
				<Label className={"text-3xl font-bold"}>{title}</Label>
				{text && (
					<Button
						onClick={() => setInfoOpen(!infoOpen)}
						variant="ghost"
						size={"icon"}
						className={"cursor-pointer"}
					>
						{infoOpen ? <X /> : <Info />}
					</Button>
				)}
			</div>
			<div>
				{infoOpen && (
					<Label className={"font-light wrap-break-word"}>{text}</Label>
				)}
			</div>
		</header>
	);
};
