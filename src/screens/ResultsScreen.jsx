import { C } from "../lib/constants.js";
import { hasGasUrl } from "../lib/gas.js";
import TypeBadge from "../components/ui/TypeBadge.jsx";
import SpectrumResult from "../components/ui/SpectrumResult.jsx";
import InsightCard from "../components/ui/InsightCard.jsx";
import RadarChart from "../components/RadarChart.jsx";
import ShareButtons from "../components/ShareButtons.jsx";
import ScientificBasis from "../components/ScientificBasis.jsx";

const AXIS_LABELS = {
  focus_dialogue: "思考スタイルの詳細",
  concrete_abstract: "情報処理の詳細",
  conservative_adventurous: "リスク姿勢の詳細",
  planning_exploration: "作業様式の詳細",
};
const AXIS_ICONS = ["🔍", "🧩", "⚡", "🗺️"];

export default function ResultsScreen({ result, scores, userName, userEmail, sheetSaved, onReset }) {
  const sp = result.style_profile || {};
  const colors = [C.gold, C.cyan, C.purple, C.green];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "40px 20px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48, animation: "fadeUp 0.8s ease" }}>
          <div style={{ fontFamily: C.fontMono, fontSize: 11, color: C.gold, letterSpacing: 6, marginBottom: 20 }}>ASSESSMENT RESULT</div>
          <h1 style={{ fontFamily: C.fontDisplay, fontSize: 40, fontWeight: 600, color: "#f0f0f0", marginBottom: 12 }}>プロファイル分析結果</h1>
          <p style={{ fontFamily: C.fontBody, fontSize: 14, color: C.textMuted, marginBottom: 24 }}>{userName} さん（{userEmail}）</p>
          {result.type_code && (
            <>
              <img
                src={`/characters/${result.type_code}.svg`}
                alt={result.type_name || result.type_code}
                style={{ width: 160, height: 160, margin: "0 auto 20px", display: "block", filter: "drop-shadow(0 0 24px #e8c54722)" }}
              />
              <TypeBadge label={result.type_code} description={result.type_name || ""} />
            </>
          )}
        </div>

        {/* Summary */}
        {result.summary && (
          <div style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #121210 100%)", border: "1px solid #e8c54722", borderRadius: 16, padding: "28px 32px", marginBottom: 40, animation: "fadeUp 0.8s ease 0.1s both" }}>
            <p style={{ fontFamily: C.fontBody, fontSize: 15, color: "#c0c0c0", lineHeight: 2, margin: 0 }}>{result.summary}</p>
          </div>
        )}

        {/* Style Profile */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: C.fontMono, fontSize: 11, color: C.gold, letterSpacing: 3, marginBottom: 24 }}>STYLE PROFILE</div>
          <SpectrumResult label="思考スタイル" leftLabel="Deep Focus（集中型）" rightLabel="Talk-through（対話型）" value={sp.focus_dialogue?.score ?? 50} color={colors[0]} />
          <SpectrumResult label="情報処理" leftLabel="Concrete（具体型）" rightLabel="Abstract（抽象型）" value={sp.concrete_abstract?.score ?? 50} color={colors[1]} />
          <SpectrumResult label="リスク姿勢" leftLabel="Steady（安定志向）" rightLabel="Challenge（挑戦志向）" value={sp.conservative_adventurous?.score ?? 50} color={colors[2]} />
          <SpectrumResult label="作業様式" leftLabel="Plan（計画型）" rightLabel="eXplore（探索型）" value={sp.planning_exploration?.score ?? 50} color={colors[3]} />
          {Object.entries(sp).map(([key, val], i) => {
            if (!val?.insight) return null;
            return <InsightCard key={key} title={AXIS_LABELS[key] || key} text={val.insight} icon={AXIS_ICONS[i]} delay={200 + i * 150} />;
          })}
        </div>

        {/* Radar Chart */}
        <RadarChart scores={scores} />

        {/* Technical Values */}
        {result.tech_values && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: C.fontMono, fontSize: 11, color: C.gold, letterSpacing: 3, marginBottom: 24 }}>TECHNICAL VALUES</div>
            {result.tech_values.core_belief && (
              <div style={{ textAlign: "center", padding: "24px 32px", background: C.card, border: "1px solid #e8c54733", borderRadius: 12, marginBottom: 20 }}>
                <div style={{ fontFamily: C.fontMono, fontSize: 10, color: "#6a6a6a", marginBottom: 10, letterSpacing: 2 }}>CORE BELIEF</div>
                <div style={{ fontFamily: C.fontBody, fontSize: 18, fontWeight: 600, color: C.gold, lineHeight: 1.6 }}>「{result.tech_values.core_belief}」</div>
              </div>
            )}
            <InsightCard title="コード品質への哲学" text={result.tech_values.quality_philosophy || ""} icon="✨" delay={100} />
            <InsightCard title="問題解決パターン" text={result.tech_values.problem_solving_pattern || ""} icon="🔧" delay={250} />
            <InsightCard title="トレードオフ判断の傾向" text={result.tech_values.tradeoff_tendency || ""} icon="⚖️" delay={400} />
          </div>
        )}

        {/* Candidate's Own Words */}
        {(result.freetext_responses?.tech_passion || result.freetext_responses?.team_episode) && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: C.fontMono, fontSize: 11, color: C.gold, letterSpacing: 3, marginBottom: 24 }}>CANDIDATE'S OWN WORDS</div>
            {result.freetext_responses.tech_passion && (
              <InsightCard title="技術者としてのこだわり（本人記述）" text={result.freetext_responses.tech_passion} icon="💬" delay={100} />
            )}
            {result.freetext_responses.team_episode && (
              <InsightCard title="チーム開発エピソード（本人記述）" text={result.freetext_responses.team_episode} icon="📝" delay={250} />
            )}
          </div>
        )}

        {/* Collaboration & Learning */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: C.fontMono, fontSize: 11, color: C.gold, letterSpacing: 3, marginBottom: 24 }}>COLLABORATION & LEARNING</div>
          {result.collaboration && <InsightCard title={`協働スタイル（${result.collaboration.score ?? "—"}/100）`} text={`${result.collaboration.style || ""}\n\n強み: ${result.collaboration.strength || ""}`} icon="🤝" delay={100} />}
          {result.learning && <InsightCard title={`学習パターン（${result.learning.score ?? "—"}/100）`} text={`${result.learning.pattern || ""}\n\n${result.learning.depth_vs_breadth || ""}`} icon="📚" delay={250} />}
        </div>

        {/* Interview Suggestions */}
        {result.interview_suggestions?.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: C.fontMono, fontSize: 11, color: C.gold, letterSpacing: 3, marginBottom: 24 }}>INTERVIEW SUGGESTIONS</div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 28px" }}>
              <p style={{ fontFamily: C.fontBody, fontSize: 13, color: "#6a6a6a", marginBottom: 16, marginTop: 0 }}>面談で深掘りすべきポイント：</p>
              {result.interview_suggestions.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: C.fontMono, fontSize: 12, color: C.gold, flexShrink: 0, marginTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontFamily: C.fontBody, fontSize: 14, color: "#b0b0b0", lineHeight: 1.8 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scientific Basis */}
        <ScientificBasis />

        {/* Share */}
        <ShareButtons typeCode={result.type_code} typeName={result.type_name} scores={scores} />

        {/* GAS Status */}
        {hasGasUrl() && (
          <div style={{ textAlign: "center", marginBottom: 24, fontFamily: C.fontMono, fontSize: 11, color: sheetSaved ? "#5a8a4a" : C.textDark }}>
            {sheetSaved ? "✓ スプレッドシートに保存済み" : "スプレッドシートに保存中..."}
          </div>
        )}

        {/* Disclaimer */}
        <div style={{ padding: "20px 24px", background: C.card, borderRadius: 8, border: `1px solid ${C.border}`, marginBottom: 32 }}>
          <p style={{ fontFamily: C.fontBody, fontSize: 11, color: C.textDark, lineHeight: 1.8, margin: 0 }}>※ 本結果はビッグファイブ心理学モデルを参考にしたルールベースの分析であり、公式な心理学テストではありません。実務パフォーマンスを直接保証するものではなく、連続尺度の傾向を示すものであり、能力の優劣を判定するものではありません。面談の対話材料としてご活用ください。</p>
        </div>

        {/* Reset */}
        <div style={{ textAlign: "center" }}>
          <button onClick={onReset}
            style={{ background: "transparent", border: "1px solid #2a2a2a", color: "#6a6a6a", padding: "12px 32px", borderRadius: 8, fontFamily: C.fontBody, fontSize: 14, cursor: "pointer" }}>
            最初からやり直す
          </button>
        </div>
      </div>
    </div>
  );
}
