import { useState } from "react";
import { CSS_BLOCK } from "./lib/constants.js";
import QUESTIONS from "./lib/questions.js";
import { calculateScores, generateTypeCode, band } from "./lib/scoring.js";
import {
  TYPE_NAMES, AXIS_INSIGHTS, DEBUG_PROFILES, TRADEOFF_PROFILES,
  generateQualityPhilosophy, generateCollabInsight, generateLearningInsight,
  generateCoreBelief, generateSummary, generateInterviewSuggestions,
} from "./lib/analysis.js";
import { sendToSheet } from "./lib/gas.js";
import IntroScreen from "./screens/IntroScreen.jsx";
import QuestionsScreen from "./screens/QuestionsScreen.jsx";
import AnalyzingScreen from "./screens/AnalyzingScreen.jsx";
import ResultsScreen from "./screens/ResultsScreen.jsx";

function generateFullResult(answers) {
  const scores = calculateScores(answers);
  const typeCode = generateTypeCode(scores);
  const typeName = TYPE_NAMES[typeCode] || "バランス型エンジニア";

  return {
    scores,
    style_profile: {
      focus_dialogue: { score: scores.focus_dialogue, insight: AXIS_INSIGHTS.focus_dialogue[band(scores.focus_dialogue)] },
      concrete_abstract: { score: scores.concrete_abstract, insight: AXIS_INSIGHTS.concrete_abstract[band(scores.concrete_abstract)] },
      conservative_adventurous: { score: scores.conservative_adventurous, insight: AXIS_INSIGHTS.conservative_adventurous[band(scores.conservative_adventurous)] },
      planning_exploration: { score: scores.planning_exploration, insight: AXIS_INSIGHTS.planning_exploration[band(scores.planning_exploration)] },
    },
    type_code: typeCode,
    type_name: typeName,
    tech_values: {
      core_belief: generateCoreBelief(answers),
      quality_philosophy: generateQualityPhilosophy(answers.s3_quality_mc),
      problem_solving_pattern: DEBUG_PROFILES[answers.s3_debug_mc] || "問題解決アプローチに対する回答が未選択です。",
      tradeoff_tendency: TRADEOFF_PROFILES[answers.s3_tradeoff_mc] || "トレードオフ判断に対する回答が未選択です。",
    },
    collaboration: {
      score: scores.collaboration,
      style: generateCollabInsight(scores.collaboration, answers.s4_collab_mc),
      strength: band(scores.collaboration) === "high"
        ? "心理的安全性の構築とチームの一体感づくり"
        : band(scores.collaboration) === "low"
        ? "技術的品質の番人としてのレビュー力"
        : "技術力と共感力のバランスによるブリッジ役",
    },
    learning: {
      score: scores.learning,
      pattern: generateLearningInsight(scores.learning, answers.s4_learn_mc),
      depth_vs_breadth: band(scores.learning) === "high"
        ? "幅広い技術への好奇心が旺盛で、チーム内の技術的な橋渡し役として活躍できるポテンシャルがあります。"
        : band(scores.learning) === "low"
        ? "深い専門性を武器にしており、特定領域のエキスパートとしてチームに安定感をもたらします。"
        : "深さと広さのバランスが取れたT型エンジニアとして、幅広い貢献が期待できます。",
    },
    interview_suggestions: generateInterviewSuggestions(scores, answers),
    summary: generateSummary(scores, typeCode, typeName),
    freetext_responses: {
      tech_passion: answers.s3_passion || "",
      team_episode: answers.s4_freetext || "",
    },
  };
}

const containerStyle = { minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };

export default function EngineerAssessment() {
  const [phase, setPhase] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [scores, setScores] = useState(null);
  const [animIn, setAnimIn] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [sheetSaved, setSheetSaved] = useState(false);

  const transitionTo = (fn) => { setAnimIn(false); setTimeout(() => { fn(); setAnimIn(true); }, 300); };
  const handleAnswer = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const goNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      transitionTo(() => setCurrentQ((c) => c + 1));
    } else {
      runAnalysis();
    }
  };

  const goPrev = () => {
    if (currentQ > 0) transitionTo(() => setCurrentQ((c) => c - 1));
  };

  const runAnalysis = () => {
    setPhase("analyzing");
    setTimeout(() => {
      const res = generateFullResult(answers);
      setResult(res);
      setScores(res.scores);
      setPhase("results");
      sendToSheet(res, answers, userName, userEmail).then((ok) => { if (ok) setSheetSaved(true); });
    }, 1800);
  };

  const handleReset = () => {
    setPhase("intro");
    setCurrentQ(0);
    setAnswers({});
    setResult(null);
    setScores(null);
    setSheetSaved(false);
  };

  if (phase === "results" && result) {
    return (
      <>
        <style>{CSS_BLOCK}</style>
        <ResultsScreen result={result} scores={scores} userName={userName} userEmail={userEmail} sheetSaved={sheetSaved} onReset={handleReset} />
      </>
    );
  }

  return (
    <div style={containerStyle}>
      <style>{CSS_BLOCK}</style>
      {phase === "intro" && (
        <IntroScreen userName={userName} userEmail={userEmail} onNameChange={setUserName} onEmailChange={setUserEmail} onStart={() => setPhase("questions")} />
      )}
      {phase === "questions" && (
        <QuestionsScreen currentQ={currentQ} answers={answers} animIn={animIn} onAnswer={handleAnswer} onNext={goNext} onPrev={goPrev} />
      )}
      {phase === "analyzing" && <AnalyzingScreen />}
    </div>
  );
}
