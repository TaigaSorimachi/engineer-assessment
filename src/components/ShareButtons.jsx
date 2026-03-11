import { useState, useCallback } from "react";
import { C } from "../lib/constants.js";

export default function ShareButtons({ result, scores, userName }) {
  const [imgStatus, setImgStatus] = useState("idle");
  const [textCopied, setTextCopied] = useState(false);

  const handleImageDownload = useCallback(async () => {
    setImgStatus("loading");
    try {
      const { default: html2canvas } = await import("html2canvas");
      const target = document.getElementById("result-capture-area");
      if (!target) return;
      const canvas = await html2canvas(target, {
        backgroundColor: "#0a0a0a",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `engineer-assessment-${result.type_code || "result"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setImgStatus("done");
      setTimeout(() => setImgStatus("idle"), 2500);
    } catch (e) {
      console.error("Image capture failed:", e);
      setImgStatus("idle");
    }
  }, [result.type_code]);

  const buildFormattedText = useCallback(() => {
    const sp = result.style_profile || {};
    const tv = result.tech_values || {};
    const lines = [];
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("  ENGINEER ASSESSMENT RESULT");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("");
    lines.push(`名前: ${userName || "\u2014"}`);
    lines.push(`タイプ: ${result.type_code}（${result.type_name}）`);
    lines.push("");
    if (result.summary) { lines.push("【サマリー】"); lines.push(result.summary); lines.push(""); }
    lines.push("【スタイルプロファイル】");
    const axes = {
      focus_dialogue: ["思考スタイル", "Deep Focus（集中）", "Talk-through（対話）"],
      concrete_abstract: ["情報処理", "Concrete（具体）", "Abstract（抽象）"],
      conservative_adventurous: ["リスク姿勢", "Steady（安定）", "Challenge（挑戦）"],
      planning_exploration: ["作業様式", "Plan（計画）", "eXplore（探索）"],
    };
    for (const [key, [label, left, right]] of Object.entries(axes)) {
      const score = sp[key]?.score ?? scores[key] ?? 50;
      const filled = Math.round(score / 5);
      lines.push(`  ${label}: ${left} [${"█".repeat(filled)}${"░".repeat(20 - filled)}] ${right}  (${score}/100)`);
    }
    lines.push("");
    for (const [key, [label]] of Object.entries(axes)) {
      if (sp[key]?.insight) { lines.push(`  ${label}の詳細:`); lines.push(`    ${sp[key].insight}`); lines.push(""); }
    }
    if (scores) { lines.push("【補助スコア】"); lines.push(`  協働: ${scores.collaboration ?? "\u2014"}/100`); lines.push(`  学習: ${scores.learning ?? "\u2014"}/100`); lines.push(""); }
    if (tv.core_belief) { lines.push(`【核となる信念】「${tv.core_belief}」`); lines.push(""); }
    if (tv.quality_philosophy) { lines.push("【コード品質への哲学】"); lines.push(`  ${tv.quality_philosophy}`); lines.push(""); }
    if (tv.problem_solving_pattern) { lines.push("【問題解決パターン】"); lines.push(`  ${tv.problem_solving_pattern}`); lines.push(""); }
    if (tv.tradeoff_tendency) { lines.push("【トレードオフ判断の傾向】"); lines.push(`  ${tv.tradeoff_tendency}`); lines.push(""); }
    if (result.collaboration?.style) { lines.push("【協働スタイル】"); lines.push(`  ${result.collaboration.style}`); if (result.collaboration.strength) lines.push(`  強み: ${result.collaboration.strength}`); lines.push(""); }
    if (result.learning?.pattern) { lines.push("【学習パターン】"); lines.push(`  ${result.learning.pattern}`); if (result.learning.depth_vs_breadth) lines.push(`  ${result.learning.depth_vs_breadth}`); lines.push(""); }
    if (result.interview_suggestions?.length > 0) { lines.push("【面談で深掘りすべきポイント】"); result.interview_suggestions.forEach((s, i) => lines.push(`  ${i + 1}. ${s}`)); lines.push(""); }
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("※ ビッグファイブ心理学モデルを参考にしたルールベースの分析です");
    return lines.join("\n");
  }, [result, scores, userName]);

  const handleTextCopy = useCallback(async () => {
    const text = buildFormattedText();
    try { await navigator.clipboard.writeText(text); } catch {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    }
    setTextCopied(true);
    setTimeout(() => setTextCopied(false), 2500);
  }, [buildFormattedText]);

  const btnStyle = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "12px 24px", borderRadius: 8,
    border: `1px solid ${C.border}`, background: "transparent",
    fontFamily: C.fontBody, fontSize: 13, color: C.textMuted,
    cursor: "pointer", transition: "all 0.25s",
  };

  return (
    <div style={{ marginTop: 32, marginBottom: 32 }}>
      <div style={{ fontFamily: C.fontMono, fontSize: 11, color: C.gold, letterSpacing: 3, marginBottom: 16 }}>EXPORT RESULT</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <button style={btnStyle} onClick={handleImageDownload}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}>
          {imgStatus === "loading" ? "生成中..." : imgStatus === "done" ? "DL完了" : "画像として保存"}
        </button>
        <button style={btnStyle} onClick={handleTextCopy}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}>
          {textCopied ? "コピーしました" : "テキストをコピー"}
        </button>
      </div>
    </div>
  );
}
