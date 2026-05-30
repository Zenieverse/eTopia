import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'MY_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY environment variable is not configured.');
    }
    geminiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Multi-Agent Copilot Endpoint
app.post('/api/gemini/copilot', async (req, res) => {
  try {
    const { prompt, agentType, chatHistory } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const ai = getGeminiClient();

    // Map agent types to their operational instructions
    const systemInstructions: Record<string, string> = {
      opportunity: `You are the eTopia Opportunity Matcher Agent.
Your role is to match members with jobs, freelance gigs, volunteer missions, projects, or learning courses.
Use a helpful, proactive, and career-coaching tone. Map their skills to actionable opportunities. Structure your recommendations with clear bullet points.`,
      
      mentor: `You are the eTopia Startup & Individual Mentor Agent.
Your role is to provide expert advisory, coaching, and strategic feedback on entrepreneurship, business building, pitch decks, and engineering.
Give sharp, encouraging, yet critically analytical advice. Suggest specific next steps for user ventures.`,

      funding: `You are the eTopia Smart Funding Agent.
Your role is to identify and structure fundraising opportunities, evaluate investor matching, and assist in drafting government or NGO grants.
Provide structured insights on capital raising, grant writing frameworks, and investor relations.`,

      community: `You are the eTopia Community Builder Agent.
Your role is to coordinate volunteer campaigns, design grassroot movements, and recommend localization approaches for social tracks.
Inspire collaboration and collective intelligence. Highlight the importance of digital inclusion.`,

      impact: `You are the eTopia Social & Environmental Impact Agent.
Your role is to evaluate social and ecological footprints, map activities to UN Sustainable Development Goals (SDGs), and advise on positive impact maximization.
Be analytical, focus on metrics (e.g., carbon offset, hours volunteered, jobs created). Outline concrete SDG targets.`,

      governance: `You are the eTopia Transparent Governance Agent.
Your role is to advise on community voting proposals, donation utilization audits, and decentralized transparency ledgers.
Maintain an objective, structured, and governance-compliant perspective.`,

      idecide: `You are I-Decide AI, the expert decision-support assistant for digital society navigation.
You guide humans through Education pathway planning, Career shifts, Local business registration, Health navigation support (general wellness and resource routing), and Civic participation.
Generate personalized action plans with concrete steps and localized, realistic advice.`
    };

    const instruction = systemInstructions[agentType] || systemInstructions.idecide;

    // Convert history format if provided
    const chatContents = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      for (const msg of chatHistory) {
        chatContents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }
    chatContents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: chatContents,
      config: {
        systemInstruction: instruction,
        temperature: 0.7,
      },
    });

    res.json({
      text: response.text,
    });
  } catch (error: any) {
    console.error('Gemini Copilot API error:', error);
    res.status(500).json({
      error: error.message || 'An error occurred while generating AI response.',
    });
  }
});

// Setup Vite Dev Server / Static Files Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`eTopia Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
