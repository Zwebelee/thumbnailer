import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppContext } from "@/context/AppContext.tsx";
import { drawOverlay } from "@/utils/drawOverlay.ts";

type Transform = { scale: number; tx: number; ty: number };

const clamp = (v: number, min: number, max: number) =>
	Math.max(min, Math.min(max, v));

export const ImagePreview = () => {
	const { imageUrl, previewCanvasRef, overlay, originalImageRef, canvasSize } =
		useAppContext();
	const imgRef = useRef<HTMLImageElement | null>(null);
	const canvasWidth = canvasSize[0];
	const canvasHeight = canvasSize[1];

	// Transform state in refs for performance
	const tRef = useRef<Transform>({ scale: 1, tx: 0, ty: 0 });
	const minScaleRef = useRef(1);
	const maxScaleRef = useRef(8);

	// For pointer events
	const dragRef = useRef<{ x: number; y: number } | null>(null);

	// For zoom slider
	const [zoomPct, setZoomPct] = useState(100);

	const draw = useCallback(() => {
		const canvas = previewCanvasRef.current;
		const ctx = canvas?.getContext("2d");
		const img = imgRef.current;
		if (!canvas || !ctx) return;
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);

		// Checkerboard
		const cell = 16;
		for (let y = 0; y < canvasHeight; y += cell) {
			for (let x = 0; x < canvasWidth; x += cell) {
				ctx.fillStyle = ((x + y) / cell) % 2 === 0 ? "#f2f2f2" : "#e6e6e6";
				ctx.fillRect(x, y, cell, cell);
			}
		}

		if (img) {
			const { scale, tx, ty } = tRef.current;
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = "high";
			ctx.drawImage(img, tx, ty, img.width * scale, img.height * scale);
		}

		ctx.strokeStyle = "rgba(0,0,0,0.35)";
		ctx.lineWidth = 1;
		ctx.strokeRect(0.5, 0.5, canvasWidth - 1, canvasHeight - 1);

		drawOverlay(ctx, overlay);
	}, [overlay, canvasWidth, canvasHeight, previewCanvasRef]);

	// Load image and initialize transform
	useEffect(() => {
		if (!imageUrl) {
			imgRef.current = null;
			if (originalImageRef) originalImageRef.current = null;
			draw();
			return;
		}
		const img = new window.Image();
		img.onload = () => {
			imgRef.current = img;
			if (originalImageRef) originalImageRef.current = img;
			const iw = img.width;
			const ih = img.height;
			const minScale = Math.max(canvasWidth / iw, canvasHeight / ih);
			minScaleRef.current = minScale;
			maxScaleRef.current = minScale * 8;
			tRef.current = {
				scale: minScale,
				tx: Math.floor((canvasWidth - iw * minScale) / 2),
				ty: Math.floor((canvasHeight - ih * minScale) / 2),
			};
			setZoomPct(100);
			draw();
		};
		img.src = imageUrl;
		// eslint-disable-next-line
	}, [imageUrl, canvasWidth, canvasHeight, originalImageRef, draw]);

	// Draw function

	// Redraw on zoom change
	useEffect(() => {
		draw();
	}, [draw]);

	// Clamp transform to keep image in bounds
	const clampTransform = (t: Transform): Transform => {
		const img = imgRef.current;
		if (!img) return t;
		const iw = img.width;
		const ih = img.height;
		const drawW = iw * t.scale;
		const drawH = ih * t.scale;
		const minTx = canvasWidth - drawW;
		const maxTx = 0;
		const minTy = canvasHeight - drawH;
		const maxTy = 0;
		return {
			scale: t.scale,
			tx: clamp(t.tx, Math.min(minTx, maxTx), Math.max(minTx, maxTx)),
			ty: clamp(t.ty, Math.min(minTy, maxTy), Math.max(minTy, maxTy)),
		};
	};

	// Set transform and redraw
	const setTransform = (next: Transform) => {
		const minS = minScaleRef.current;
		const maxS = maxScaleRef.current;
		const scaled = { ...next, scale: clamp(next.scale, minS, maxS) };
		tRef.current = clampTransform(scaled);
		setZoomPct(Math.round((tRef.current.scale / minS) * 100));
		draw();
	};

	// Pointer events for drag
	const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
		dragRef.current = { x: e.clientX, y: e.clientY };
		(e.target as Element).setPointerCapture(e.pointerId);
	};
	const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
		if (!dragRef.current || !imgRef.current) return;
		const dx = e.clientX - dragRef.current.x;
		const dy = e.clientY - dragRef.current.y;
		const { scale, tx, ty } = tRef.current;
		setTransform({ scale, tx: tx + dx, ty: ty + dy });
		dragRef.current = { x: e.clientX, y: e.clientY };
	};
	const onPointerUp = () => {
		dragRef.current = null;
	};

	// Wheel zoom
	const onWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
		e.preventDefault();
		if (!imgRef.current) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const cx = e.clientX - rect.left;
		const cy = e.clientY - rect.top;
		const { scale, tx, ty } = tRef.current;
		const zoom = Math.exp(-e.deltaY * 0.0015);
		const minS = minScaleRef.current;
		const maxS = maxScaleRef.current;
		const newScale = clamp(scale * zoom, minS, maxS);

		// Zoom to cursor
		const iw = imgRef.current.width;
		const ih = imgRef.current.height;
		const prevDrawW = iw * scale;
		const prevDrawH = ih * scale;
		const relX = (cx - tx) / prevDrawW;
		const relY = (cy - ty) / prevDrawH;
		const newDrawW = iw * newScale;
		const newDrawH = ih * newScale;
		const newTx = cx - relX * newDrawW;
		const newTy = cy - relY * newDrawH;

		setTransform({ scale: newScale, tx: newTx, ty: newTy });
	};

	// Zoom slider
	const onZoomSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!imgRef.current) return;
		const pct = Number(e.target.value);
		const minS = minScaleRef.current;
		const newScale = clamp((pct / 100) * minS, minS, maxScaleRef.current);
		// Center zoom
		const cx = canvasWidth / 2;
		const cy = canvasHeight / 2;
		const { scale, tx, ty } = tRef.current;
		const iw = imgRef.current.width;
		const ih = imgRef.current.height;
		const prevDrawW = iw * scale;
		const prevDrawH = ih * scale;
		const relX = (cx - tx) / prevDrawW;
		const relY = (cy - ty) / prevDrawH;
		const newDrawW = iw * newScale;
		const newDrawH = ih * newScale;
		const newTx = cx - relX * newDrawW;
		const newTy = cy - relY * newDrawH;
		setTransform({ scale: newScale, tx: newTx, ty: newTy });
	};

	return (
		<div className="border-2 border-gray-200 rounded-md p-2 w-fit">
			<canvas
				ref={previewCanvasRef}
				width={canvasWidth}
				height={canvasHeight}
				className="block"
				style={{ touchAction: "none", background: "#fafafa" }}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerLeave={onPointerUp}
				onWheel={onWheel}
			/>
			<div className="flex items-center gap-2 mt-2">
				<input
					type="range"
					min={100}
					max={Math.round(maxScaleRef.current * 100)}
					value={zoomPct}
					onChange={onZoomSlider}
					className="w-40"
				/>
				<span className="text-xs text-gray-500">{zoomPct}%</span>
			</div>
		</div>
	);
};
