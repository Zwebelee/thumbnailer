import { Check, ClipboardCopy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";

export interface ClipboardCopyButtonProps {
	path?: string;
}

export const ClipboardCopyButton = ({ path }: ClipboardCopyButtonProps) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		if (!path) return;
		try {
			await navigator.clipboard.writeText(path);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {}
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			className="cursor-pointer"
			onClick={handleCopy}
			aria-pressed={copied}
			aria-label={copied ? "Copied" : "Copy path"}
			title={copied ? "Copied" : "Copy path"}
		>
			{copied ? <Check /> : <ClipboardCopy />}
		</Button>
	);
};
