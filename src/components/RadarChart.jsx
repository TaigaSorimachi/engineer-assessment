import { useRef, useEffect } from "react";
import { C } from "../lib/constants.js";

const AXES = [
  { key: "focus_dialogue", label: "思考スタイル" },
  { key: "concrete_abstract", label: "情報処理" },
  { key: "conservative_adventurous", label: "リスク姿勢" },
  { key: "planning_exploration", label: "作業様式" },
  { key: "collaboration", label: "協働" },
];

export default function RadarChart({ scores, size = 280 }) {
  const canvasRef = useRef(null);
  const radius = size * 0.36;
  const cx = size / 2;
  const cy = size / 2;
  const n = AXES.length;
  const angleStep = (Math.PI * 2) / n;
  const startAngle = -Math.PI / 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    // Grid lines (4 levels)
    for (let level = 1; level <= 4; level++) {
      const r = (radius * level) / 4;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const angle = startAngle + angleStep * (i % n);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Axis lines
    for (let i = 0; i < n; i++) {
      const angle = startAngle + angleStep * i;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Data polygon
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const idx = i % n;
      const angle = startAngle + angleStep * idx;
      const val = (scores[AXES[idx].key] ?? 50) / 100;
      const x = cx + radius * val * Math.cos(angle);
      const y = cy + radius * val * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.fillStyle = "rgba(232, 197, 71, 0.15)";
    ctx.fill();
    ctx.strokeStyle = C.gold;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dots on data points
    for (let i = 0; i < n; i++) {
      const angle = startAngle + angleStep * i;
      const val = (scores[AXES[i].key] ?? 50) / 100;
      const dx = cx + radius * val * Math.cos(angle);
      const dy = cy + radius * val * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(dx, dy, 4, 0, Math.PI * 2);
      ctx.fillStyle = C.gold;
      ctx.fill();
      ctx.strokeStyle = C.bg;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Labels
    ctx.font = `500 12px 'Noto Sans JP', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < n; i++) {
      const angle = startAngle + angleStep * i;
      const lx = cx + (radius + 28) * Math.cos(angle);
      const ly = cy + (radius + 28) * Math.sin(angle);
      ctx.fillStyle = "#7a7a7a";
      ctx.fillText(AXES[i].label, lx, ly);

      // Score value
      const val = scores[AXES[i].key] ?? 50;
      ctx.font = `600 10px 'DM Mono', monospace`;
      ctx.fillStyle = "#5a5a5a";
      ctx.fillText(val, lx, ly + 15);
      ctx.font = `500 12px 'Noto Sans JP', sans-serif`;
    }
  }, [scores, size]);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
      <canvas ref={canvasRef} style={{ width: size, height: size }} />
    </div>
  );
}
