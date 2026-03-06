import { ClipboardCopyButton } from "@/components/ClipboardCopyButton.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useAppContext } from "@/context/AppContext.tsx";

export const ExportPath = () => {
	const { config } = useAppContext();

	const title = config.exportPath?.title;
	const path = config.exportPath?.path;
	const show = config.exportPath?.show;

	if (!title || !path || !show) {
		return;
	}

	return (
		<div className={"flex flex-row items-center gap-2"}>
			<Label>{title}</Label>
			<div className={"flex flex-row items-center gap-2"}>
				<Label className={"flex font-light"}>{path}</Label>
				<ClipboardCopyButton path={path} />
			</div>
		</div>
	);
};
