import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<Array<{ lat: number, lng: number }>>([]);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (e) => {
      const { lat, lng } = JSON.parse(e.data) as { lat: number, lng: number };
      setState(s => [...s, { lat, lng }]);
    };
    ws.onopen = () => ws.send(JSON.stringify({ type: "app" }));
    return () => ws.close();
  }, []);
  useEffect(() => {
    if (state.length < 1) return;

    const canvasWidth = ref.current!.width;
    const canvasHeight = ref.current!.height;
    const maxLat = Math.max(...state.map(({ lat }) => lat));
    const minLat = Math.min(...state.map(({ lat }) => lat));
    const latRatio = canvasWidth / (Math.round(((maxLat * 100) - (minLat * 100)) * 10000) / 100);
    const maxLng = Math.max(...state.map(({ lng }) => lng));
    const minLng = Math.min(...state.map(({ lng }) => lng));
    const lngRatio = canvasHeight / (Math.round(((maxLng * 100) - (minLng * 100)) * 10000) / 100);

    const context = ref.current!.getContext("2d")!;
    const positions = state.map(({ lat, lng }) => ({
      x: Math.round(((lat * 100) - (minLat * 100)) * 10000) / 100,
      y: Math.round(((lng * 100) - (minLng * 100)) * 10000) / 100,
    }))
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    context.moveTo(positions[0].x, positions[0].y);
    context.beginPath();
    for (const { x, y } of positions.slice(1)) {
      context.lineTo(x * latRatio, y * lngRatio);
    }

    context.strokeStyle = "#999";
    context.lineWidth = 1;
    context.stroke();
  }, [state.length]);
  return (
    <canvas ref={ref} width={1000} height={1000}></canvas>
  );
}

const root = createRoot(document.querySelector("#app")!);
root.render(<App />);