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
	const showText = config.info.showText;

	return (
		<header className={"flex flex-col p-2 gap-2 items-center w-full"}>
			<div className={"flex flex-row gap-8"}>
				<Label className={"text-3xl font-bold"}>{title}</Label>
				{text && showText && (
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
			{infoOpen && (
				<Label className={"block font-light text-justify  p-2"}>{text}</Label>
			)}
		</header>
	);
};
