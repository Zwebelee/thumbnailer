import type React from "react";
import { Input } from "@/components/ui/input.tsx";
import { useAppContext } from "@/context/AppContext.tsx";

export const ImageSelector = () => {
	const { setImage } = useAppContext();

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || null;
		setImage(file);
	};

	return (
		<div>
			<div className="flex flex-row items-center gap-4 p-2">
				<Input
					type="file"
					className={"cursor-pointer"}
					onChange={handleFileChange}
				/>
			</div>
		</div>
	);
};
