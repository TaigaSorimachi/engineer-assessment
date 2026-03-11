/* ═══════════════════════════════════════════════════════
   SCORING ENGINE — Big Five based
   各軸: スペクトラム(自己申告) × 0.5-0.6 + 行動質問 × 0.4-0.5
   IPIP因子負荷量を参考にスコアマッピングを設定
   ═══════════════════════════════════════════════════════ */

const clamp = (v, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(v)));

function calcMultiChoiceScore(selected, scoreMap) {
  if (!selected || selected.length === 0) return 50;
  const scores = selected.map((id) => scoreMap[id] ?? 50);
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function calculateScores(answers) {
  // ── Axis 1: focus_dialogue (Extraversion) ──
  // 0=Deep Focus(集中), 100=Talk-through(対話)
  const fd_spectrum = answers.s1_focus ?? 50;
  const fd_mc = calcMultiChoiceScore(answers.s1_focus_mc, {
    a: 20, b: 30, c: 85, d: 25, e: 50, f: 40,
  });
  const focus_dialogue = clamp(fd_spectrum * 0.6 + fd_mc * 0.4);

  // ── Axis 2: concrete_abstract (Openness) ──
  // 0=Builder(具体), 100=Architect(抽象)
  const ca_spectrum = answers.s1_abstract ?? 50;
  const ca_mc = calcMultiChoiceScore(answers.s1_abstract_mc, {
    a: 70, b: 20, c: 30, d: 45, e: 25, f: 75,
  });
  const concrete_abstract = clamp(ca_spectrum * 0.6 + ca_mc * 0.4);

  // ── Axis 3: conservative_adventurous (Emotional Stability + Openness) ──
  // 0=Steady(安定), 100=Challenger(挑戦)
  const risk_spectrum = answers.s2_risk ?? 50;
  const risk_mc = { a: 15, b: 30, c: 80, d: 60 }[answers.s2_risk_mc] ?? 50;
  const conservative_adventurous = clamp(risk_spectrum * 0.55 + risk_mc * 0.45);

  // ── Axis 4: planning_exploration (Conscientiousness) ──
  // 0=Planner(計画), 100=Explorer(探索)
  const plan_spectrum = answers.s2_plan ?? 50;
  const plan_mc = { a: 25, b: 85, c: 20, d: 55 }[answers.s2_plan_mc] ?? 50;
  const planning_exploration = clamp(plan_spectrum * 0.55 + plan_mc * 0.45);

  // ── Supplementary: collaboration (Agreeableness) ──
  // 0=技術重視, 100=共感重視
  const collab_spectrum = answers.s4_collab ?? 50;
  const collab_mc = calcMultiChoiceScore(answers.s4_collab_mc, {
    a: 75, b: 35, c: 85, d: 40, e: 30,
  });
  const collaboration = clamp(collab_spectrum * 0.5 + collab_mc * 0.5);

  // ── Supplementary: learning ──
  // 0=深掘り(Specialist), 100=幅広(Generalist)
  const learn_spectrum = answers.s4_learn ?? 50;
  const learn_mc = { a: 25, b: 65, c: 35, d: 55 }[answers.s4_learn_mc] ?? 50;
  const learning = clamp(learn_spectrum * 0.6 + learn_mc * 0.4);

  // ── Scenario cross-axis adjustments ──
  // シナリオ判断で各軸を微補正（±5程度）
  const s1 = answers.s5_scenario1;
  const s2 = answers.s5_scenario2;

  let fd_adj = 0, ca_adj = 0, risk_adj = 0, plan_adj = 0;

  if (s1 === "a") { ca_adj += 3; plan_adj -= 3; }       // データ重視 → やや抽象・計画
  if (s1 === "b") { plan_adj += 5; risk_adj += 3; }      // PoC → 探索・挑戦
  if (s1 === "c") { fd_adj += 5; }                        // 傾聴 → 対話
  if (s1 === "d") { plan_adj -= 3; }                      // 決断 → 計画

  if (s2 === "a") { ca_adj += 3; }                        // 観測 → やや抽象
  if (s2 === "b") { risk_adj -= 5; plan_adj -= 3; }      // ロールバック → 安定・計画
  if (s2 === "c") { fd_adj += 5; }                        // チーム共有 → 対話
  if (s2 === "d") { ca_adj += 3; }                        // ステークホルダー → やや抽象

  return {
    focus_dialogue: clamp(focus_dialogue + fd_adj),
    concrete_abstract: clamp(concrete_abstract + ca_adj),
    conservative_adventurous: clamp(conservative_adventurous + risk_adj),
    planning_exploration: clamp(planning_exploration + plan_adj),
    collaboration,
    learning,
  };
}

export function generateTypeCode(scores) {
  const c1 = scores.focus_dialogue < 50 ? "D" : "T";
  const c2 = scores.concrete_abstract < 50 ? "B" : "A";
  const c3 = scores.conservative_adventurous < 50 ? "S" : "C";
  const c4 = scores.planning_exploration < 50 ? "P" : "X";
  return c1 + c2 + c3 + c4;
}

export function band(score) {
  if (score < 35) return "low";
  if (score < 65) return "mid";
  return "high";
}
