/* ═══════════════════════════════════════════════════════
   Share Image Generator — Canvas API
   OGP風のシェア画像を生成（タイプコード + タイプ名 + レーダーチャート）
   ═══════════════════════════════════════════════════════ */

function drawRadarOnCanvas(ctx, scores, cx, cy, radius) {
  const axes = [
    { key: "focus_dialogue", label: "思考" },
    { key: "concrete_abstract", label: "情報処理" },
    { key: "conservative_adventurous", label: "リスク" },
    { key: "planning_exploration", label: "作業様式" },
    { key: "collaboration", label: "協働" },
  ];
  const n = axes.length;
  const angleStep = (Math.PI * 2) / n;
  const startAngle = -Math.PI / 2;

  // Grid
  for (let level = 1; level <= 4; level++) {
    const r = (radius * level) / 4;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const angle = startAngle + angleStep * (i % n);
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Axis lines
  for (let i = 0; i < n; i++) {
    const angle = startAngle + angleStep * i;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Data polygon
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const idx = i % n;
    const angle = startAngle + angleStep * idx;
    const val = (scores[axes[idx].key] ?? 50) / 100;
    const x = cx + radius * val * Math.cos(angle);
    const y = cy + radius * val * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.fillStyle = "rgba(232, 197, 71, 0.2)";
  ctx.fill();
  ctx.strokeStyle = "#e8c547";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Dots + Labels
  ctx.font = "bold 11px 'Noto Sans JP', sans-serif";
  ctx.textAlign = "center";
  for (let i = 0; i < n; i++) {
    const angle = startAngle + angleStep * i;
    const val = (scores[axes[i].key] ?? 50) / 100;
    const dx = cx + radius * val * Math.cos(angle);
    const dy = cy + radius * val * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(dx, dy, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#e8c547";
    ctx.fill();

    const lx = cx + (radius + 20) * Math.cos(angle);
    const ly = cy + (radius + 20) * Math.sin(angle);
    ctx.fillStyle = "#8a8a8a";
    ctx.fillText(axes[i].label, lx, ly + 4);
  }
}

export function generateShareImage(typeCode, typeName, scores) {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, 600, 400);

  // Border
  ctx.strokeStyle = "rgba(232, 197, 71, 0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(16, 16, 568, 368);

  // Label
  ctx.font = "500 10px 'DM Mono', monospace";
  ctx.fillStyle = "#e8c547";
  ctx.textAlign = "center";
  ctx.letterSpacing = "4px";
  ctx.fillText("ENGINEER ASSESSMENT", 200, 50);

  // Type code
  ctx.font = "bold 36px 'DM Mono', monospace";
  ctx.fillStyle = "#e8c547";
  ctx.fillText(typeCode, 200, 95);

  // Type name
  ctx.font = "600 16px 'Noto Sans JP', sans-serif";
  ctx.fillStyle = "#c0c0c0";
  ctx.fillText(typeName, 200, 125);

  // URL
  ctx.font = "400 11px 'DM Mono', monospace";
  ctx.fillStyle = "#4a4a4a";
  ctx.fillText("Engineer Profiling Tool", 200, 370);

  // Radar chart
  drawRadarOnCanvas(ctx, scores, 430, 200, 110);

  return canvas.toDataURL("image/png");
}

export function downloadShareImage(typeCode, typeName, scores) {
  const dataUrl = generateShareImage(typeCode, typeName, scores);
  const link = document.createElement("a");
  link.download = `engineer-assessment-${typeCode}.png`;
  link.href = dataUrl;
  link.click();
}
