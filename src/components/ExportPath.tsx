import { ClipboardCopy } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useAppContext } from "@/context/AppContext.tsx";

export const ExportPath = () => {
	const { config } = useAppContext();

	const title = config.exportPath?.title;
	const path = config.exportPath?.path;

	if (!title && !path) {
		return null;
	}

	return (
		<div className={"flex flex-row items-center gap-2"}>
			<Label>{title}</Label>
			<div className={"flex flex-row items-center gap-2"}>
				<Label className={"flex font-light"}>{path}</Label>
				<Button
					variant="ghost"
					size={"icon"}
					className={"cursor-pointer"}
					onClick={() => {
						if (path) {
							navigator.clipboard.writeText(path);
						}
					}}
				>
					<ClipboardCopy />
				</Button>
			</div>
		</div>
	);
};
