export const OverlayType = {
    NONE: "none",
    APP: "app",
    MAINTENANCE: "maintenance",
    EDIT: "edit",
    APP_TEXT: "app_text",
    MAINTENANCE2: "maintenance2",
} as const;

export type OverlayType = typeof OverlayType[keyof typeof OverlayType];


export const IconPath = {
    SETTINGS: "/settings.svg",
    PENCIL: "/pencil.svg",
    APPWINDOW: "/app-window.svg"
} as const;


export interface OverlayOption {
    id: OverlayType;
    label: string;
}

export const overlayOptions: OverlayOption[] = [
    {id: OverlayType.NONE, label: "None"},
    {id: OverlayType.APP, label: "App"},
    {id: OverlayType.MAINTENANCE, label: "Maintenance"},
    {id: OverlayType.EDIT, label: "Edit"},
    {id: OverlayType.APP_TEXT, label: "Test App Text"},
    {id: OverlayType.MAINTENANCE2, label: "Test Maintenance 2"},
];

export function drawOverlay(ctx: CanvasRenderingContext2D, overlay: OverlayType) {
    if (overlay === OverlayType.APP) {
        ctx.save();
        ctx.fillStyle = "rgba(34, 221, 202,1)";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(180, 0);
        ctx.lineTo(0, 180);
        ctx.closePath();
        ctx.fill();

        const icon = new window.Image();
        icon.src = IconPath.APPWINDOW;
        icon.onload = () => {
            const iconSize = 92;
            const centroidX = (0 + 180 + 0) / 3;
            const centroidY = (0 + 0 + 180) / 3;
            ctx.save();
            ctx.translate(centroidX, centroidY);
            ctx.rotate(-Math.PI / 4);
            ctx.drawImage(icon, -iconSize / 2, -iconSize / 2, iconSize, iconSize);
            ctx.restore();
        };
    } else if (overlay === OverlayType.MAINTENANCE) {
        ctx.save();
        ctx.fillStyle = "rgba(227, 36, 42, 1)";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(180, 0);
        ctx.lineTo(0, 180);
        ctx.closePath();
        ctx.fill();


        const icon = new window.Image();
        icon.src = IconPath.SETTINGS;
        icon.onload = () => {
            const iconSize = 92;
            ctx.save();
            ctx.drawImage(icon, 10, 10, iconSize, iconSize);
            ctx.restore();
        };
    } else if (overlay === OverlayType.EDIT) {
        ctx.save();
        ctx.fillStyle = "rgba(242, 237, 231, 1)";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(180, 0);
        ctx.lineTo(0, 180);
        ctx.closePath();
        ctx.fill();


        const icon = new window.Image();
        icon.src = IconPath.PENCIL;
        icon.onload = () => {
            const iconSize = 92;
            ctx.save();
            ctx.drawImage(icon, 10, 10, iconSize, iconSize);
            ctx.restore();
        };
    } else if (overlay === OverlayType.APP_TEXT) {
        ctx.save();
        ctx.fillStyle = "rgba(34, 221, 202,1)";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(180, 0);
        ctx.lineTo(0, 180);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#fff";
        ctx.font = "bold 28px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.translate(60, 60);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText("GeoApp", 0, 0);
        ctx.restore();
    } else if (overlay === OverlayType.MAINTENANCE2) {
        ctx.save();
        ctx.fillStyle = "rgba(227, 36, 42, 1)";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(180, 0);
        ctx.lineTo(0, 180);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#fff";
        ctx.font = "bold 28px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.translate(60, 60);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText("GeoApp", 0, 0);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = "rgba(227, 36, 42, 1)";
        ctx.beginPath();
        ctx.moveTo(ctx.canvas.width, ctx.canvas.height);
        ctx.lineTo(ctx.canvas.width - 180, ctx.canvas.height);
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height - 180);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#fff";
        ctx.font = "bold 28px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.translate(ctx.canvas.width - 60, ctx.canvas.height - 60);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText("Betrieb", 0, 0);
        ctx.restore();

        const svgPath = "/settings.svg";
        fetch(svgPath)
            .then(res => res.text())
            .then(svgText => {
                // Replace fill="none" with your desired color, e.g., fill="#e3242a"
                const coloredSvg = svgText.replace(/fill="none"/g, 'fill="#e3242a"');
                const svgBlob = new Blob([coloredSvg], {type: "image/svg+xml"});
                const url = URL.createObjectURL(svgBlob);
                const icon = new window.Image();
                icon.src = url;
                icon.onload = () => {
                    const centerX = ctx.canvas.width / 2;
                    const centerY = ctx.canvas.height / 2;
                    const iconSize = 192;
                    ctx.save();
                    ctx.drawImage(icon, centerX - iconSize / 2, centerY - iconSize / 2, iconSize, iconSize);
                    ctx.restore();
                    URL.revokeObjectURL(url);
                };
            });
    }
}
