/* ─── GAS Webhook ─── */
const GAS_WEBHOOK_URL = import.meta.env.VITE_GAS_URL || "";

export async function sendToSheet(result, answers, userName, userEmail) {
  if (!GAS_WEBHOOK_URL) return false;
  try {
    await fetch(GAS_WEBHOOK_URL, {
      method: "POST",
      body: JSON.stringify({
        ...result,
        timestamp: new Date().toISOString(),
        answers,
        candidate_name: userName,
        candidate_email: userEmail,
      }),
    });
    return true;
  } catch (e) {
    console.warn("Sheet save failed:", e);
    return false;
  }
}

export function hasGasUrl() {
  return !!GAS_WEBHOOK_URL;
}
