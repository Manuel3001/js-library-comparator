import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Wir importieren unsere Datenbank direkt ins Backend
import librariesData from '../src/data/libraries.json' with { type: "json" };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Security-Check: Wir erlauben nur POST-Anfragen, da wir Daten (den Prompt) senden
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  // 2. API-Key Validierung (Der Key bleibt sicher auf dem Server)
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("CRITICAL: GEMINI_API_KEY is missing in environment variables.");
    return res.status(500).json({ error: 'Server Configuration Error' });
  }

  // 3. User-Input Validierung
  const { userPrompt } = req.body;
  if (!userPrompt || typeof userPrompt !== 'string') {
    return res.status(400).json({ error: 'A valid userPrompt is required in the request body.' });
  }

  try {
    // 4. KI initialisieren (Wir nutzen gemini-1.5-flash für maximale Geschwindigkeit)
    const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });    // Wir bauen einen massiven System-Prompt zusammen, der die KI in eine Rolle zwingt
    // und ihr exakt unser Datenformat als alleinige Wahrheit vorgibt.
    const systemInstruction = `
      Du bist ein hochkarätiger, analytischer Software Architect. 
      Deine Aufgabe ist es, Entwicklern die beste JavaScript/TypeScript-Library für ihr Projekt zu empfehlen.
      
      REGELN:
      - Du darfst AUSSCHLIESSLICH Bibliotheken empfehlen, die in der folgenden JSON-Datenbank existieren.
      - Antworte präzise, technisch tiefgehend und objektiv.
      - Nenne konkrete Metriken (wie Bundle-Size oder CVEs), um deine Entscheidung zu begründen.
      - Formatiere deine Antwort in sauberem Markdown (mit Bulletpoints oder kleinen Code-Snippets, falls sinnvoll).
      
      DATENBANK:
      ${JSON.stringify(librariesData)}

      ANFRAGE DES NUTZERS:
      ${userPrompt}
    `;

    // 6. Anfrage an Gemini senden
    const result = await model.generateContent(systemInstruction);
    const responseText = result.response.text();

    // 7. Saubere Antwort an unser React-Frontend zurücksenden
    return res.status(200).json({ recommendation: responseText });

  } catch (error) {
    console.error('Error communicating with Gemini API:', error);
    return res.status(500).json({ error: 'Failed to generate recommendation.' });
  }
}