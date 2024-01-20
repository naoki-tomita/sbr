import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<Array<{ x: number, y: number }>>([]);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (e) => {
      const { x, y } = JSON.parse(e.data) as { x: number, y: number };
      setState(s => [...s, { x, y }]);
    };
    ws.onopen = (e) => ws.send(JSON.stringify({ type: "app" }));
    return () => ws.close();
  }, []);
  useEffect(() => {
    const context = ref.current!.getContext("2d")!;
    if (state.length < 1) return;
    console.log("line", state.length);
    context.clearRect(0, 0, ref.current!.width, ref.current!.height);
    context.beginPath();
    context.moveTo(state[0].x, state[0].y);
    for (const { x, y } of state.slice(1)) {
      context.lineTo(x, y);
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