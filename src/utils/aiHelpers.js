// parseAiResponseToJson: tries to robustly extract JSON from model text
export function parseAiResponseToJson(text) {
  if (!text) return null;
  // If model returns only JSON, easy:
  try {
    return JSON.parse(text);
  } catch (e) {
    // Try to extract JSON substring
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      const sub = text.slice(start, end + 1);
      try { return JSON.parse(sub); } catch (e2) { /* fallthrough */ }
    }
    // fallback: return empty
    return null;
  }
}
