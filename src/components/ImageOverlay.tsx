import {overlayOptions, OverlayType} from "@/utils/drawOverlay.ts";

export const ImageOverlay = ({
                                 value,
                                 onChange,
                             }: {
    value: string;
    onChange: (id: OverlayType) => void;
}) => (
    <div className="border-2 border-gray-200 p-2 rounded">
        <h3 className="mb-2 text-sm font-semibold">Overlay Selector</h3>
        <select
            value={value}
            onChange={e => onChange(e.target.value as OverlayType)}
            className="border rounded px-2 py-1"
        >
            {overlayOptions.map(opt => (
                <option key={opt.id} value={opt.id}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);